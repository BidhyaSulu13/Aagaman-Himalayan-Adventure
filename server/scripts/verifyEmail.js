import "dotenv/config";
import { getTransporter } from "../src/services/emailService.js";

const oauthConfigured = Boolean(
  process.env.SMTP_OAUTH_CLIENT_ID &&
  process.env.SMTP_OAUTH_CLIENT_SECRET &&
  process.env.SMTP_OAUTH_REFRESH_TOKEN
);

if (!process.env.SMTP_USER || (!process.env.SMTP_PASSWORD && !oauthConfigured)) {
  console.error("SMTP is not configured in server/.env. Set SMTP_USER and either SMTP_PASSWORD or all three SMTP OAuth values.");
  process.exit(1);
}

try {
  await getTransporter().verify();
  console.log(`SMTP connection and authentication verified for ${process.env.SMTP_USER}.`);
} catch (error) {
  console.error(`SMTP verification failed (${error.code || error.name}): ${error.message}`);
  process.exitCode = 1;
}
