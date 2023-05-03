import CryptoJS from "crypto-js";  //引用AES源码js
export function encryptAes(data: string) {
  var key  = CryptoJS.enc.Latin1.parse('pengcheck1231232');
  var iv   = CryptoJS.enc.Latin1.parse('pengcheck1231232');
  return CryptoJS.AES.encrypt(data, key, {iv:iv,mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.ZeroPadding}).toString();
}