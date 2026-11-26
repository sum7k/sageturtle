// One-to-one calls and messages are not carried by SageTurtle. A tap hands the person off, by a plain link,
// to the phone's dialer or to the app the other person chose in Reach me. No APIs and no fees.

/** The apps a person can choose for messages. WhatsApp has no link that starts a call, so a call always uses the dialer. */
export const REACH_APPS = ["whatsapp", "telegram", "sms"];
/** Teens are handed off only to the phone, SMS and WhatsApp (which allows age 13). */
export const TEEN_REACH_APPS = ["whatsapp", "sms"];

/** An Indian mobile number as ten digits, or "" when it is not one. Takes +91, 91 and a leading 0. */
export function cleanNumber(raw) {
  let d = String(raw ?? "").replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : "";
}

export function blankReach() {
  return { phone: "", app: "" };
}

export function normaliseReach(raw) {
  const phone = cleanNumber(raw?.phone);
  const app = REACH_APPS.includes(raw?.app) ? raw.app : "";
  return phone && app ? { phone, app } : blankReach();
}

/**
 * The links for one person's row: `call` opens the dialer, `message` opens their chat in the app they chose.
 * Null when there is nothing to open. Kids are never handed off: they talk only to guardians, inside the app.
 */
export function reachLinks(person) {
  if (!person || person.kid) return null;
  const { phone, app } = normaliseReach(person.reach);
  if (!phone) return null;
  const n = "91" + phone;
  const message = { whatsapp: `https://wa.me/${n}`, telegram: `https://t.me/+${n}`, sms: `sms:+${n}` }[app];
  return { app, call: `tel:+${n}`, message };
}
