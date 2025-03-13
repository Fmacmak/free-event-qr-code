"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { registerAttendee } from "../app/actions"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  tShirtSize: z.enum(["S", "M", "L", "XL", "XXL"]).optional(),
  specialRequirements: z.string().optional(),
  marketingConsent: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStatus, setFormStatus] = useState<{
    success?: boolean
    message?: string
  }>({})

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      jobTitle: "",
      dietaryRestrictions: "",
      specialRequirements: "",
      marketingConsent: false,
    },
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      const result = await registerAttendee(values)
      if (result.success) {
        setFormStatus({
          success: true,
          message: "Registration successful! Check your email for confirmation.",
        })
        form.reset()
      } else {
        setFormStatus({
          success: false,
          message: result.error || "Something went wrong. Please try again.",
        })
      }
    } catch (error) {
      setFormStatus({
        success: false,
        message: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div id="registration" className="rounded-lg border bg-card p-6 shadow-sm">
      {formStatus.message && (
        <Alert variant={formStatus.success ? "default" : "destructive"} className="mb-6">
          {formStatus.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{formStatus.success ? "Success!" : "Registration Failed"}</AlertTitle>
          <AlertDescription>{formStatus.message}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* <FormField
            control={form.control}
            name="tShirtSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>T-Shirt Size</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your t-shirt size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="S">Small</SelectItem>
                    <SelectItem value="M">Medium</SelectItem>
                    <SelectItem value="L">Large</SelectItem>
                    <SelectItem value="XL">X-Large</SelectItem>
                    <SelectItem value="XXL">XX-Large</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* <FormField
            control={form.control}
            name="dietaryRestrictions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dietary Restrictions</FormLabel>
                <FormControl>
                  <Input placeholder="Vegetarian, Vegan, Gluten-free, etc." {...field} />
                </FormControl>
                <FormDescription>Let us know if you have any dietary restrictions.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialRequirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Requirements</FormLabel>
                <FormControl>
                  <Textarea placeholder="Any accessibility needs or special requirements" {...field} />
                </FormControl>
                <FormDescription>
                  Please let us know if you have any special requirements or accessibility needs.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name="marketingConsent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Marketing Communications</FormLabel>
                  <FormDescription>
                    I agree to receive marketing communications about future events and offers.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" variant="ghost" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Register for the Event"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

