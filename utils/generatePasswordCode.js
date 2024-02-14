import cryptoRandomString from 'crypto-random-string';

export const passwordRecoveryCode = () => {
  return cryptoRandomString({ length: 3, type: 'numeric' }) + '-' + cryptoRandomString({ length: 3, type: 'numeric' });
}
