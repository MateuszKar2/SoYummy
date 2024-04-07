import CryptoJS from "crypto-js";

const key: string | undefined = process.env.CRYPTO_KEY;

if (!key) {
  throw new Error("CRYPTO_KEY environment variable is not set.");
}

const iv: CryptoJS.lib.WordArray = CryptoJS.lib.WordArray.random(16);

const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, key, {
    iv: iv,
  }).toString();
};

const decryptData = (encryptedData: string): string => {
  return CryptoJS.AES.decrypt(encryptedData, key, {
    iv: iv,
  }).toString(CryptoJS.enc.Utf8);
};

export const encryptField = (value: string): string => encryptData(value);
export const decryptField = (value: string): string => decryptData(value);
export { encryptData, decryptData };
