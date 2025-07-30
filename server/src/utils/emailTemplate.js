export const emailTemplate = ({ name, otp }) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 24px auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 32px 24px; background-color: #f9f9f9;">
      <h2 style="color: #4f46e5; text-align: center; margin-bottom: 24px;">Verify Your Email Address</h2>
      <p style="font-size: 16px; color: #222;">Hi <strong>${name}</strong>,</p>
      <p style="font-size: 15px; color: #333; margin: 16px 0;">
        Thanks for signing up! To complete your registration, please enter the following One Time Password (OTP) to verify your email address:
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <span style="font-size: 32px; letter-spacing: 8px; font-weight: bold; background: #eef2ff; padding: 12px 36px; border-radius: 8px; display: inline-block; color: #4f46e5;">
          ${otp}
        </span>
      </div>
      <p style="color: #555; margin: 16px 0;">
        This OTP is valid for <strong>10 minutes</strong>. If you did not request to create an account, please ignore this email.
      </p>
      <p style="margin-top: 32px; font-size: 14px; color: #888;">
        Best Regards,<br>
        <span style="color: #4f46e5;">The Notes App Team</span>
      </p>
    </div>
  `;
};
