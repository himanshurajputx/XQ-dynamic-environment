import * as crypto from 'crypto';
import { APP_ } from './constant.helper';
// import * as CryptoJS from 'crypto-js';

// const securityKey = APP_.CRYPTO_KEY_2;
const key = APP_.CRYPTO_KEY_1;
const Algorithm = 'aes256';
const Key = crypto.scryptSync(key, 'salt', 32);

export const encrypt = (clearText?: any) => {
  const IV = crypto.randomBytes(16);
  try {
    const cipher = crypto.createCipheriv(Algorithm, Key, IV);
    const encrypted = cipher.update(JSON.stringify(clearText), 'utf8', 'hex');
    return [
      encrypted + cipher.final('hex'),
      Buffer.from(IV).toString('hex'),
    ].join('|');
  } catch (error) {
    throw error;
  }
};
export const decrypt = (ciphertext?: any) => {
  try {
    const [encrypted, iv] = ciphertext.split('|');
    if (!iv) throw new Error('IV not found');
    const decipher = crypto.createDecipheriv(
      Algorithm,
      Key,
      Buffer.from(iv, 'hex'),
    );
    return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
  } catch (error) {
    throw error;
  }
};
export const hashGenerate = async (txt?: any, size?: any) => {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(size).toString('hex');
    const hash = crypto
      .pbkdf2Sync(txt, salt, 1000, 64, `sha512`)
      .toString(`hex`);
    return resolve({ salt: salt, hash: hash });
  });
};

export const hashCompare = (current?: any, input?: any, salt?: any) => {
  return new Promise((resolve, reject) => {
    const hash = crypto
      .pbkdf2Sync(input, salt, 1000, 64, `sha512`)
      .toString(`hex`);
    return resolve(current === hash);
  });
};
// const _key = CryptoJS.enc.Utf8.parse(securityKey);
// const _iv = CryptoJS.enc.Utf8.parse(securityKey);
//
// export const encryptJs = (value?: any) => {
//   return CryptoJS.AES.encrypt(JSON.stringify(value), _key, {
//     keySize: 16,
//     iv: _iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   }).toString();
// };
// export const decryptJs = (encryptValue: any) => {
//   const decrypted = CryptoJS.AES.decrypt(encryptValue, _key, {
//     keySize: 16,
//     iv: _iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });
//   return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
// };
