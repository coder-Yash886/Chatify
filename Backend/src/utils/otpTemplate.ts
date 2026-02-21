export const otpEmailTemplate = (otp: string, username?: string) => `
  <div style="font-family: sans-serif; line-height: 1.5;">
    <h2>Hello ${username || 'User'},</h2>
    <p>Your OTP code is: <strong>${otp}</strong></p>
    <p>This code will expire in 5 minutes.</p>
    <p>Thank you for using our service!</p>
  </div>
`;
