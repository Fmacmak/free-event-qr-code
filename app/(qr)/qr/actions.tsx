'use server';

import { db } from "@/lib/db";
import { attendees } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function checkInAttendee(publicId: string) {
  try {
    // Trim and normalize the input
    const normalizedId = publicId.trim().toUpperCase();
    
    // Find the attendee by public ID
    const attendeeResult = await db.query.attendees.findFirst({
      where: eq(attendees.publicId, normalizedId),
    });

    if (!attendeeResult) {
      return {
        success: false,
        message: "No registration found with this ID.",
      };
    }

    // Check if already checked in
    if (attendeeResult.checkedIn) {
      return {
        success: true,
        message: "This attendee has already been checked in.",
        attendeeName: `${attendeeResult.firstName} ${attendeeResult.lastName}`,
      };
    }

    // Update the check-in status
    await db
      .update(attendees)
      .set({
        checkedIn: true,
        checkedInAt: new Date(),
      })
      .where(eq(attendees.publicId, normalizedId));

    return {
      success: true,
      message: "Attendee successfully checked in!",
      attendeeName: `${attendeeResult.firstName} ${attendeeResult.lastName}`,
    };
  } catch (error) {
    console.error("Check-in error:", error);
    return {
      success: false,
      message: "An error occurred during check-in. Please try again.",
    };
  }
}