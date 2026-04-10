# Sereno — Citizen Feedback Protocol

Sereno is a bespoke GovTech platform designed to bridge the gap between citizens and government offices through a seamless, conversational WhatsApp AI. Built with a focus on high-fidelity design, trilingual support, and real-time governance metrics.

## 🚀 Quick Start

### 1. Environment Configuration
Create a `.env.local` file in the root directory and populate it with the following:

```env
MONGODB_URI=your_mongodb_connection_string
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886 (your twilio sandbox number)
NEXT_PUBLIC_APP_URL=https://your-ngrok-url.ngrok-free.app
```

### 2. Installation
```bash
npm install
```

### 3. Development
```bash
npm run dev
```

### 4. Webhook Setup
Point your Twilio WhatsApp Sandbox Sandbox URL to:
`https://your-ngrok-url.ngrok-free.app/api/twilio/webhook`

---

## 🛠 API Documentation (Log API)

### Get All Feedback Logs
Retrieve a unified stream of completed surveys and live interactions.

**Request:**
```bash
curl -X GET "http://localhost:3000/api/feedback?limit=10"
```

### Get Raw Message Logs
Retrieve raw inbound message history for audit purposes.

**Request:**
```bash
curl -X GET "http://localhost:3000/api/logs"
```

### Filter Logs by Phone
**Request:**
```bash
curl -X GET "http://localhost:3000/api/logs?phone=91XXXXXXXXXX"
```

---

## 🧪 Test Steps (Evidence Collection)

### 1. QR Scan Experience
1. Navigate to the Home Page or Admin Node Registry.
2. Scan a generated QR code using your phone.
3. WhatsApp will open with a pre-filled message: `I'm at the office. ID: node-central-001`.
4. **Evidence:** Take a screenshot of the pre-filled message on your phone.

### 2. Conversational Flow (Trilingual)
1. Send the pre-filled message to the Sereno WhatsApp number.
2. Select language (1 for Marathi, 2 for English, 3 for Hindi).
3. Complete the 6-question survey.
4. **Evidence:** Take a screenshot of the full WhatsApp chat history.

### 3. Admin Dashboard
1. Open `/admin`.
2. Verify that your chat interaction appears in the "Feedback Stream" in real-time.
3. **Evidence:** Take a screenshot of the Admin Dashboard showing your entry.

### 4. Database Verification
1. Access your MongoDB (Atlas or Compass).
2. Check the `messagelogs` and `feedbacks` collections.
3. **Evidence:** Take a screenshot of the JSON document for your recent interaction.

---

## 🏗 Technology Stack
- **Framework:** Next.js 14 (App Router)
- **Database:** MongoDB with Mongoose
- **Messaging:** Twilio WhatsApp API
- **Styling:** Bespoke CSS with Nordic Slate Palette
- **Icons:** Lucide React
- **Charts:** Recharts

---
Created with purpose for modern governance.
