export function isValidPhoneNumber(phoneNumber: string): boolean {
  // 匹配中国手机号码的正则表达式
  const regExp = /^1[3-9]\d{9}$/;
  return regExp.test(phoneNumber);
}
