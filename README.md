# Sereno: Real-time Citizen Feedback Infrastructure

Sereno is an end-to-end governance solution for capturing and auditing citizen feedback at government offices using WhatsApp. By leveraging QR codes and an automated state-machine bot, Sereno removes friction from user reporting while providing administrators with a unified, real-time audit console.

## 🚀 Core Flow
1. **Citizen On-Site**: Citizen scans a location-specific QR code at a government office.
2. **Instant Bridge**: QR opens WhatsApp with the office context pre-filled.
3. **Automated Audit**: A state-machine powered bot conducts a structured survey.
4. **Governance Dashboard**: Real-time aggregation of feedback and technical message traces.

---

## 🛠️ Tech Stack
- **Frontend**: Next.js (App Router), TailwindCSS, Shadcn/UI
- **Backend**: Next.js API Routes, WhatsApp/Twilio Webhooks
- **Database**: MongoDB (Persistence for Message Logs & Feedback)
- **Tooling**: Lucide Icons, Ngrok (Local Testing)

---

## 📋 Getting Started

### 1. Prerequisites
- **Node.js**: v18+
- **MongoDB**: A running instance (Local or Atlas)
- **Twilio**: A WhatsApp Sandbox account
- **Ngrok**: For local webhook bridging

### 2. Environment Configuration
Create a `.env.local` in the root directory:
```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://your_uri

# Twilio Credentials
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### 3. Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start local bridge (in new terminal)
npx ngrok http 3000
```

### 4. Webhook Configuration
1. Start Ngrok and copy the `https` URL.
2. Navigate to your [Twilio Sandbox Settings](https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox).
3. Set the **"When a message comes in"** URL to:
   `https://your-ngrok-id.ngrok-free.app/api/twilio/webhook`

---

## 🛡️ Admin Console Features
- **Governance Dashboard**: Unified view of formalized audits and raw message traces.
- **Node Network**: Manage government offices/nodes and generate location-aware QR codes.
- **Protocol Audit**: Deep-dive into technical logs via `curl` or the automated UI stream.

---

## 📝 Verification Commands
**Check API Health:**
```powershell
curl.exe -X GET "http://localhost:3000/api/logs?limit=5"
```

**Verify DB Connectivity:**
```bash
node scratch/check_db.js
```

---
*Built for the next generation of transparent governance.*
