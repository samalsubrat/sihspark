import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

// console.log("SID:", process.env.TWILIO_ACCOUNT_SID);
// console.log("Token:", process.env.TWILIO_AUTH_TOKEN ? "Loaded" : "Missing");
// console.log("WA Number:", process.env.TWILIO_WHATSAPP_NUMBER);

// Twilio Client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Wrapper function to send WhatsApp message
 * @param {string} to - Recipient phone number (E.164 format, e.g. +919876543210)
 * @param {string} body - Message content
 * @returns {Promise<{success: boolean, sid?: string, error?: string}>}
 */
export async function sendWhatsAppWrapper(to, body) {
  try {
    const message = await client.messages.create({
      body,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`,
    });

    console.log("✅ WhatsApp message sent successfully:", message.sid);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error("❌ Error sending WhatsApp message:", error);
    return { success: false, error: error.message };
  }
}

// Example test
// async function test() {
//   await sendWhatsAppWrapper(
//     "+919262569674",
//     "Hello 👋 This is a WhatsApp test 🚀"
//   );
// }
// test();
