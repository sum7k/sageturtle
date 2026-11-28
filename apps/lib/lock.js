// The lock is the account: a passkey kept by the phone and opened by fingerprint, face or the phone's own PIN.
// There is no phone number and no OTP. The server check of the passkey comes with the shared backend;
// until then the passkey is made and asked for on the phone only.
const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
const bytes = (n) => crypto.getRandomValues(new Uint8Array(n));

export const canLock = () => typeof PublicKeyCredential !== "undefined" && !!navigator.credentials;

/** Make the passkey. Returns its id, or throws when the person cancels or the phone has no lock. */
export async function makeLock() {
  const cred = await navigator.credentials.create({
    publicKey: {
      challenge: bytes(32),
      rp: { name: "CubeGullak" },
      user: { id: bytes(16), name: "bodhilabs", displayName: "CubeGullak" },
      pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
      authenticatorSelection: { authenticatorAttachment: "platform", residentKey: "preferred", userVerification: "required" },
      timeout: 60000,
    },
  });
  return b64(cred.rawId);
}

/** Ask for the lock again, before a change of profile or variant and before a payment. */
export async function askLock(id) {
  const raw = Uint8Array.from(atob(id.replaceAll("-", "+").replaceAll("_", "/")), (c) => c.charCodeAt(0));
  await navigator.credentials.get({
    publicKey: { challenge: bytes(32), allowCredentials: [{ type: "public-key", id: raw }], userVerification: "required", timeout: 60000 },
  });
  return true;
}
