const generateOTPEmail = (first_name, otp) => `
<div style="font-family: Arial, sans-serif; background:#f5f7fb; padding:40px;">
  <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;box-shadow:0 5px 20px rgba(0,0,0,0.08);">
    <div style="background:#4F46E5;padding:20px;text-align:center;color:white;">
        <h1>Verify Your Email</h1>
    </div>
    <div style="padding:30px;">
        <h2>Hi ${first_name} 👋</h2>
        <p>Your ZoeVerse verification code:</p>
        <div style="text-align:center;margin:30px 0;">
            <span style="font-size:28px;letter-spacing:6px;background:#f0f2f5;padding:15px 25px;border-radius:6px;">
                ${otp}
            </span>
        </div>
        <p>This code expires in 10 minutes.</p>
    </div>
  </div>
</div>
`;

const generateWelcomeEmail = (first_name) => `
<div style="font-family: Arial, sans-serif; background:#f5f7fb; padding:40px;">
  <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;box-shadow:0 5px 20px rgba(0,0,0,0.08);">
    <div style="background:#4F46E5;padding:20px;text-align:center;color:white;">
        <h1>Welcome to ZoeVerse</h1>
    </div>
    <div style="padding:30px;">
        <h2>Hi ${first_name} 👋</h2>
        <p>We're excited to have you join ZoeVerse.</p>
    </div>
  </div>
</div>
`;

module.exports = { generateOTPEmail, generateWelcomeEmail };