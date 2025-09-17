import { sendSMSWrapper } from "../lib/sms.js";
import { sendWhatsAppWrapper } from "../lib/whatapp.js";

function isValidPhoneNumber(number) {
  return typeof number === "string" && /^\+\d{10,15}$/.test(number);
}

export const sendMessageController = async (req, res) => {
  try {
    const { number, message, type } = req.body;

    if (!number || !message) {
      return res.status(400).json({ message: "number and message are required" });
    }

    if (!isValidPhoneNumber(number)) {
      return res.status(400).json({ message: "Invalid phone number format. Use +<countrycode><number>" });
    }

    if (!["sms", "whatsapp", "both"].includes(type)) {
      return res.status(400).json({ message: "Invalid type. Use sms, whatsapp, or both" });
    }

    let results = {};

    if (type === "sms" || type === "both") {
      const smsResult = await sendSMSWrapper(number, message);
      results.sms = smsResult;
    }

    if (type === "whatsapp" || type === "both") {
      const waResult = await sendWhatsAppWrapper(number, message);
      results.whatsapp = waResult;
    }

    return res.status(200).json({
      message: "Message sent successfully",
      results,
    });
  } catch (error) {
    console.error("sendMessageController error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
