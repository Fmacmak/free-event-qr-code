import { Resend } from "resend"

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Event details
const EVENT_NAME = "Tech Innovation Summit 2025"
const EVENT_DATE = "April 15, 2025"
const EVENT_LOCATION = "Tech Conference Center, 123 Isaac John Street, Ikeja, Lagos State"
const EVENT_TIME = "10:00 AM - 5:00 PM"

interface ConfirmationEmailProps {
  to: string
  firstName: string
  lastName: string
  publicId: string
}

/**
 * Generates a URL to a QR code image using a third-party service
 * @param publicId The unique identifier to encode in the QR code
 * @returns A URL string to the QR code image
 */
function getQRCodeServiceURL(publicId: string): string {
  // Using a service like QR Server API
  // const qrCodeValue = encodeURIComponent(`https://hook.fmac.ng/qr/${publicId}`);
  const qrCodeValue = encodeURIComponent(`https://hook.fmac.ng`);
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrCodeValue}`;


  //will use below
  // // const qrCodeValue = encodeURIComponent(`https://hook.fmac.ng/qr/${publicId}`);
  // return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${publicId}`;
}

export async function sendConfirmationEmail({ to, firstName, lastName, publicId }: ConfirmationEmailProps) {
  try {
    // Generate QR code as PNG data URL
    const qrCodeDataURL = await getQRCodeServiceURL(publicId);
    
    const { data, error } = await resend.emails.send({
      from: "Tech Innovation Summit <events@hook.thth.ng>",
      to: [to],
      subject: `Registration Confirmed: ${EVENT_NAME}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="color: #333; margin-top: 0;">Registration Confirmed!</h1>
            <p style="font-size: 16px; line-height: 1.5; color: #555;">
              Hello ${firstName} ${lastName},
            </p>
            <p style="font-size: 16px; line-height: 1.5; color: #555;">
              Thank you for registering for the ${EVENT_NAME}. We're excited to have you join us!
            </p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Event Details</h2>
            <p style="font-size: 16px; line-height: 1.5; color: #555;"><strong>Date:</strong> ${EVENT_DATE}</p>
            <p style="font-size: 16px; line-height: 1.5; color: #555;"><strong>Time:</strong> ${EVENT_TIME}</p>
            <p style="font-size: 16px; line-height: 1.5; color: #555;"><strong>Location:</strong> ${EVENT_LOCATION}</p>
          </div>
          
          <div style="margin-bottom: 30px; text-align: center;">
            <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Your Entry Pass</h2>
            <p style="font-size: 16px; line-height: 1.5; color: #555;">Please present this QR code at the registration desk:</p>
            <div style="max-width: 200px; margin: 15px auto; display: block;">
              <img src="${qrCodeDataURL}" alt="QR Code" style="width: 100%; max-width: 200px;">
            </div>
            <p style="font-size: 14px; color: #777;">Registration ID: ${publicId}</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">What to Bring</h2>
            <ul style="font-size: 16px; line-height: 1.5; color: #555;">
              <li>Photo ID for check-in</li>
              <li>Business cards for networking</li>
              <li>Laptop or tablet (optional)</li>
              <li>Questions for our speakers</li>
            </ul>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <p style="font-size: 16px; line-height: 1.5; color: #555;">
              If you have any questions or need to update your registration details, please reply to this email or contact our support team.
            </p>
            <p style="font-size: 16px; line-height: 1.5; color: #555;">
              We look forward to seeing you at the event!
            </p>
            <p style="font-size: 16px; line-height: 1.5; color: #555; margin-bottom: 0;">
              Best regards,<br>
              The ${EVENT_NAME} Team
            </p>
          </div>
          
          <div style="margin-top: 30px; font-size: 12px; color: #999; text-align: center;">
            <p>This email was sent to ${to}. If you did not register for this event, please disregard this email.</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Error sending email:", error)
      throw new Error(`Failed to send email: ${error.message}`)
    }
    console.log("Email sent successfully:", data)

    return { success: true, data }
  } catch (error) {
    console.error("Error in sendConfirmationEmail:", error)
    throw error
  }
}

