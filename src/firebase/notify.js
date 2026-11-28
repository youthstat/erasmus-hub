import { HELP_NOTIFY_WEBHOOK_URL } from '../config/settings.js';

/**
 * Sends a non-blocking JSON alert payload to the admin's Google Apps Script Web App URL
 * (which forwards to Telegram and/or Email without exposing any bot token in GitHub Pages).
 */
export async function dispatchAdminAlert(payload, customWebhookUrl = '') {
  const url = String(customWebhookUrl || HELP_NOTIFY_WEBHOOK_URL || '').trim();
  if (!/^https:\/\//i.test(url)) return false;
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    return true;
  } catch {
    return false;
  }
}
