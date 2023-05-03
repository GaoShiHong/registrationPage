// 手机校验
export function isValidPhoneNumber(phoneNumber: string): boolean {
  console.log(phoneNumber, 'phoneNumber')
  // 匹配中国手机号码的正则表达式
  const regExp = /^1[3-9]\d{9}$/;
  return regExp.test(phoneNumber);
}
// 账号校验，只能是数字或字母
export function isValidAccount(account: string): boolean {
  console.log(account, 'account')
  // 匹配中国手机号码的正则表达式
  const regExp = /^[A-Za-z0-9]+$/;
  return regExp.test(account);
}
