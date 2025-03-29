import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// POST API to send email
router.post("/send-email", async (req, res) => {
    const { to, subject, text } = req.body;
  
    if (!to || !subject || !text) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text,
      };
  
      await transporter.sendMail(mailOptions);
      res.json({ success: "Email sent successfully" });
  
    } catch (error) {
      console.error("Email sending failed:", error);
      res.status(500).json({ error: error.message });
    }
  });
  

export default router;
