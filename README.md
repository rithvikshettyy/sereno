This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Developer Runbook

### 1. Prerequisites
- **Node.js**: v18+ recommended.
- **MongoDB**: A running instance (local or Atlas cluster).
- **Twilio Account**: With WhatsApp Sandbox enabled.
- **Ngrok**: For local webhook testing.

### 2. Local Setup
1. **Clone & Install**:
   ```bash
   npm install
   ```
2. **Environment**: Create a `.env.local` file with:
   ```env
   # MongoDB
   MONGODB_URI=mongodb+srv://...

   # Twilio
   TWILIO_ACCOUNT_SID=AC...
   TWILIO_AUTH_TOKEN=...
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
3. **Run**:
   ```bash
   npm run dev
   ```

### 3. Public Webhook (Ngrok)
To receive WhatsApp messages locally:
1. Start Ngrok: `ngrok http 3000`
2. Copy the `https` forwarding URL (e.g., `https://xyz.ngrok.io`).
3. In Twilio Sandbox Settings, set the **"A MESSAGE COMES IN"** webhook to:
   `https://xyz.ngrok.io/api/twilio/webhook`

### 4. End-to-End Test Plan
1. **Register Office**: Go to `/admin/offices` and add an office (e.g., ID: `test-01`).
2. **Scan QR**: Open the Home page (`/`), find your office, and click the "PNG" button or scan the QR.
3. **WhatsApp Handshake**: It should open WhatsApp with a prefilled greeting like "Hi! I'm at ... ID: test-01".
4. **Complete Flow**: Answer the bot questions:
   - "1" for Marathi or "2" for English.
   - "1" (Yes) for visit.
   - "5" (Rating).
   - "1" (Yes) for helpdesk.
   - "Friendly staff" (Behavior).
   - "More chairs needed" (Suggestion).
5. **Verify Logs**: Go to `/admin` to see all raw inbound messages captured.
6. **Verify Analytics**: Go to `/admin/analytics` to see the rating distribution and stats update.
7. **Verify Database**: Check the `messagelogs` and `feedbacks` collections in MongoDB.

### 5. API Reference
- **GET `/api/logs`**: Lists recent messages. (Params: `phone`, `office_id`, `limit`)
- **GET `/api/offices`**: Lists registered offices.
- **GET `/api/analytics`**: Aggregated performance data.
- **GET `/api/offices/[id]/qr`**: Generates QR code asset.
