import User from "../model/User.js";
import bcrypt from "bcryptjs";
import genrateToken from "../utils/genrateToken.js";
import sendMail from "../utils/sendMail.js";

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
      const message = `Dear ${user.name},
        Your one-time password (OTP) for ShopNest account registration is: ${otp}

        This code is valid for 10 minutes and should not be shared with anyone for security reasons.

        Best regards,
        ShopNest Team`;

      await sendMail(user.email, "OTP for registration", message);

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

                const message = `Dear ${user.name},
                  Your one-time password (OTP) for ShopNest account registration is: ${otp}

                  This code is valid for 10 minutes and should not be shared with anyone for security reasons.

                  Best regards,
                  ShopNest Team`;

                await sendMail(user.email, "OTP for registration", message);

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

    await sendMail(adminEmail, subject, emailBody);
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

    const message = `Dear ${user.name},
      Your one-time password (OTP) for ShopNest account registration is: ${otp}

      This code is valid for 10 minutes and should not be shared with anyone for security reasons.

      Best regards,
      ShopNest Team`;

    await sendMail(user.email, "OTP for registration", message);

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};
