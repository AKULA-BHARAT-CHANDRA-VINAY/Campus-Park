import Contact from "../models/contactModel.js";
import User from "../models/userModel.js";

// USER: Send Message
export const sendMessage = async (req, res) => {
  try {
    const { fullname, regNo, email, message } = req.body;

    if (!fullname || !regNo || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // validate user exists
    const user = await User.findOne({ regNo, email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    await Contact.create({
      fullname,
      regNo,
      email,
      message
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully"
    });

  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// ADMIN: Get All Messages
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: messages.length,
      messages
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};