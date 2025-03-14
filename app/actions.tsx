"use server"

import { z } from "zod"
import { db } from "../lib/db"
import { attendees } from "../lib/db/schema"
import { sendConfirmationEmail } from "../lib/email"
import { revalidatePath } from "next/cache"

// Function to generate an 8-character alphanumeric public ID
function generatePublicId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const attendeeSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  marketingConsent: z.boolean().default(false),
})

export async function registerAttendee(formData: unknown) {
  try {
    // Validate form data
    const validatedData = attendeeSchema.parse(formData)

    // Check if email already registered
    const existingAttendee = await db.query.attendees.findFirst({
      where: (attendees, { eq }) => eq(attendees.email, validatedData.email),
    })

    if (existingAttendee) {
      return {
        success: false,
        error: "This email is already registered for the event.",
      }
    }
    const publicId = generatePublicId()

    // Insert into database
    const result = await db.insert(attendees).values({
      publicId: publicId,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      company: validatedData.company || null,
      jobTitle: validatedData.jobTitle || null,
      marketingConsent: validatedData.marketingConsent,
      registeredAt: new Date(),
    })

    // Send confirmation email
    await sendConfirmationEmail({
      to: validatedData.email,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      publicId: publicId,
    })

    revalidatePath("/")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Registration error:", error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid form data. Please check your inputs.",
      }
    }

    return {
      success: false,
      error: "Failed to register. Please try again later.",
    }
  }
}

