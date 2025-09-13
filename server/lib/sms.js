import twilio from "twilio";

// Twilio Client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Wrapper function to send SMS
 * @param {string} to - Recipient phone number
 * @param {string} body - Message content
 * @returns {Promise<{success: boolean, sid?: string, error?: string}>}
 */
export async function sendSMSWrapper(to, body) {
  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    // console.log(body);

    console.log("✅ SMS sent successfully:", message.sid);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error("❌ Error sending SMS:", error);
    return { success: false, error: error.message };
  }
}

// async function someBackendLogic() {
//   await sendSMSWrapper("+919262569674", "Test SMS 🚀 from backend function");
// }

// someBackendLogic();