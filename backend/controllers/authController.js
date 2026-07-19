import User from "../model/User.js";
import bcrypt from "bcryptjs";
import genrateToken from "../utils/genrateToken.js";
import sendMail from "../utils/sendMail.js";

const getOTPEmailTemplate = (name, otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>OTP Verification</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f7f9fc; -webkit-text-size-adjust: none; -ms-text-size-adjust: none;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f7f9fc; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #eef2f6;">
              <!-- Header (Logo) -->
              <tr>
                <td style="padding: 40px 0 20px 0; text-align: center; border-bottom: 1px solid #f0f4f8;">
                  <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 36px; font-weight: 400; color: #0b0b0b; letter-spacing: -0.5px; display: inline-block;">season<span style="font-weight: 700; color: #000000;">.</span></span>
                </td>
              </tr>
              
              <!-- Content Body -->
              <tr>
                <td style="padding: 40px 40px 30px 40px;">
                  <p style="margin: 0 0 16px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333;">
                    Dear ${name},
                  </p>
                  <p style="margin: 0 0 24px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #4a5568;">
                    Thank you for creating an account with <strong>season.</strong> To complete your registration, please verify your email address using the one-time password (OTP) below:
                  </p>
                  
                  <!-- OTP Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                    <tr>
                      <td align="center">
                        <div style="background-color: #f7f9fc; border-radius: 8px; border: 1px dashed #cbd5e1; padding: 16px 40px; display: inline-block;">
                          <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 700; letter-spacing: 6px; color: #0b0b0b;">${otp}</span>
                        </div>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Expiry Alert -->
                  <p style="margin: 0 0 32px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #e53e3e; text-align: center; font-weight: 500;">
                    ⚠️ This code is valid for 10 minutes and should not be shared with anyone for security reasons.
                  </p>
                  
                  <hr style="border: 0; border-top: 1px solid #edf2f7; margin-bottom: 24px;">
                  
                  <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #4a5568;">
                    Best regards,<br>
                    <strong>The season. Team</strong>
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #fafbfc; padding: 24px 40px; text-align: center; border-top: 1px solid #f0f4f8;">
                  <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #a0aec0;">
                    This email was sent to you because you requested to sign up at season. If you did not make this request, you can safely ignore this email.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "name, email and password are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      verified: false,
    });

    if (user) {
      const message = getOTPEmailTemplate(user.name, otp);
      sendMail(user.email, "OTP for registration", message);

      res.status(201).json({
        message: "Registration successful. Please verify your email with the OTP sent to your inbox.",
        email: user.email,
      });
    } else {
      res.status(400).json({ message: "invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};


export const loginUser = async(req, res) => {
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        
        if(user && (await bcrypt.compare(password,user.password))){
            if (!user.verified) {
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
                user.otp = otp;
                user.otpExpires = otpExpires;
                await user.save();

                const message = getOTPEmailTemplate(user.name, otp);
                sendMail(user.email, "OTP for registration", message);

                return res.status(401).json({
                    message: "Please verify your email address first. An OTP has been sent.",
                    email: user.email,
                    unverified: true,
                });
            }

            res.json({
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                token:genrateToken(user._id)
            })
        }else{
            res.status(401).json({message:"invalid email or password"})
        }
    }
    catch(error){
      res.status(500).json({message:"internal server error"})
    }
}

export const getUsers = async(req, res) => {
    try {
      const users = await User.find({}).select('-password');
      res.json(users)
    } catch (error) {
      res.status(500).json({message:"internal server error"})
    }
}

export const contactSupport = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const adminEmail = process.env.GMAIL_USER;
    const subject = `Support Request from ${name}`;
    const emailBody = `
      <h3>New Support Request Received</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    sendMail(adminEmail, subject, emailBody);
    res.status(200).json({ message: "Support request sent successfully" });
  } catch (error) {
    console.error("Error sending support request:", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    if (new Date() > user.otpExpires) {
      return res.status(400).json({ message: "OTP code has expired" });
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
      message: "Account verified successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: genrateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

export const resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const message = getOTPEmailTemplate(user.name, otp);

    sendMail(user.email, "OTP for registration", message);

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};