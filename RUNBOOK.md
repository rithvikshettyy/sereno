# Sereno Developer Runbook

Follow this guide to set up, run, and verify the Sereno E2E flow.

## 1. Local Application Setup

1.  **Clone & Install**:
    ```bash
    npm install
    ```
2.  **Environment Variables**: Create `.env.local` with:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    TWILIO_ACCOUNT_SID=your_sid
    TWILIO_AUTH_TOKEN=your_token
    TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886 (sandbox or production)
    ```
3.  **Start App**:
    ```bash
    npm run dev
    ```

## 2. Public Webhook Setup (Local Development)

Twilio requires a public URL to send webhooks to your local machine.

1.  **Use Ngrok**:
    ```bash
    ngrok http 3000
    ```
2.  **Copy the URL**: Note your public URL (e.g., `https://random-id.ngrok-free.app`).

## 3. Twilio Config

1.  Go to [Twilio Console](https://console.twilio.com/).
2.  Navigate to **Messaging > Try it Out > Send a WhatsApp Message**.
3.  Set the **Webhook URL** for "When a message comes in" to:
    `https://your-ngrok-url.app/api/twilio/webhook`
4.  Method: **POST**.

## 4. End-to-End Verification Flow

### A. Setup Office
1. Open `http://localhost:3000/admin/offices`.
2. Authorize a new node (e.g., ID: `MH-01`, Name: `Collector Office`, Location: `Pune`).

### B. Citizen QR Scan
1. Open `http://localhost:3000/api/offices/MH-01/qr`.
2. Scan the QR code with your phone. It should open WhatsApp with:
   `Hi! I'm at Collector Office (Pune). ID: MH-01`
3. Send the message.

### C. Execute Question Flow
Reply to the bot messages:
1. **Language**: Reply `1` or `Marathi`.
2. **Visit Confirmation**: Reply `Yes`.
3. **Rating**: Reply `5`.
4. **Helpdesk**: Reply `Yes`.
5. **Staff Behavior**: Reply `Friendly and professional`.
6. **Final Suggestion**: Reply `Keep it up!`.

### D. Verify Captured Data
1. **Database**: Check `MessageLog` collection in MongoDB. You should see entries for every message sent/received.
2. **UI Viewer**: Open `http://localhost:3000/admin/responses`.
   * Verify all messages appear in the table.
   * Click the **View (Eye)** icon to inspect raw payload and media metadata.
3. **Analytics**: Open `http://localhost:3000/admin/analytics` to see the protocol satisfaction score update.

## 5. Deployment Notes
* Ensure `MONGODB_URI` and Twilio secrets are set in your production provider (e.g. Vercel).
* Point production Twilio webhooks to your production domain.
