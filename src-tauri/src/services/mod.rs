/// External integration services for Forge.
/// These are stubs — actual implementations require API keys and credentials.

// ── Stripe ──────────────────────────────────────────────────────────────────
// TODO: Implement Stripe integration for:
// - Creating checkout sessions for invoices
// - Processing card payments via Stripe Terminal SDK
// - Handling webhooks for payment confirmation
// - Managing subscriptions for recurring membership billing
// - Generating payment links

// ── GoCardless ──────────────────────────────────────────────────────────────
// TODO: Implement GoCardless integration for:
// - Setting up Direct Debit mandates
// - Creating recurring payments
// - Handling payment retries on failure
// - Webhook processing for payment status updates

// ── TrueLayer (Open Banking) ────────────────────────────────────────────────
// TODO: Implement TrueLayer integration for:
// - Pay by Bank initiation
// - Payment status polling
// - Bank account verification

// ── Email (SMTP / SendGrid / Mailgun) ───────────────────────────────────────
// TODO: Implement email service for:
// - Sending transactional emails (invoices, receipts, confirmations)
// - Campaign emails with tracking pixels
// - Template rendering with variable substitution
// - Open/click tracking

// ── SMS (Twilio) ────────────────────────────────────────────────────────────
// TODO: Implement Twilio integration for:
// - Sending SMS notifications
// - Event reminders
// - Two-factor authentication codes

// ── Exchange Rates ──────────────────────────────────────────────────────────
// TODO: Implement FX rate caching from exchangerate.host:
// - Daily rate refresh
// - Multi-currency conversion
// - Historical rate lookup

// ── Firebase Cloud Messaging ────────────────────────────────────────────────
// TODO: Implement FCM for:
// - Push notifications to Android app
// - Campaign delivery
// - Loyalty alerts

// ── Apple Wallet / Google Wallet ────────────────────────────────────────────
// TODO: Implement wallet pass generation:
// - .pkpass creation for Apple Wallet
// - JWT-based save links for Google Wallet
// - Pass updates on membership renewal

// ── PDF Generation ──────────────────────────────────────────────────────────
// TODO: Implement PDF generation for:
// - Invoices with company branding
// - Contracts with embedded signatures
// - Membership cards (business card dimensions)
// - Reports

// ── Backup Service ──────────────────────────────────────────────────────────
// TODO: Implement backup functionality:
// - Automated daily SQLite snapshots
// - AES-256 encryption of backup files
// - Cloud upload to Azure Blob / S3 (optional)
// - Restore from backup point
