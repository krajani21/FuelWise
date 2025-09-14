const { Resend } = require('resend');

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

const sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'FuelWise <onboarding@resend.dev>', // Using Resend's test domain
      to: [email],
      subject: 'Reset Your FuelWise Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #003366; margin-bottom: 10px;">FuelWise</h1>
            <p style="color: #666; margin: 0;">Smart fuel savings for everyone</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Hello,
            </p>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              You requested to reset your password for your FuelWise account.
            </p>
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              Click the button below to reset your password:
            </p>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${resetUrl}" 
                 style="background-color: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Or copy and paste this link into your browser:
            </p>
            <p style="color: #4CAF50; word-break: break-all; background-color: #f0f0f0; padding: 10px; border-radius: 5px; font-family: monospace;">
              ${resetUrl}
            </p>
          </div>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>Important:</strong> This link will expire in 1 hour for security reasons.
            </p>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p style="margin-bottom: 10px;">
              If you did not request this password reset, please ignore this email.
            </p>
            <p style="margin: 0;">
              Best regards,<br>
              The FuelWise Team
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('Password reset email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPasswordResetEmail
};
