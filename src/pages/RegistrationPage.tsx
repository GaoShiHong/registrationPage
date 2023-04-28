import { createSignal } from 'solid-js';
import './RegistrationPage.css';
import { isValidPhoneNumber } from '../utils/valid';

export function RegistrationPage() {
  const [formData, setFormData] = createSignal({
    userAccount: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
    phoneNumber: '',
    imgVerificationCode: '',
    imgKey: ''
  });

  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [isSendingCode, setIsSendingCode] = createSignal(false);
  const [isPasswordMatch, setIsPasswordMatch] = createSignal(true);
  const [isCodeSent, setIsCodeSent] = createSignal(false);
  const [codeErrorMessage, setCodeErrorMessage] = createSignal('');
  const [codeErrorPhoneMessage, setCodeErrorPhoneMessage] = createSignal('');
  const [validImgUrl, setValidImgUrl] = createSignal('');

  const handleInputChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    let value = target.value
    if (target.name === "userAccount") {
      value = value.replace(/[^a-zA-Z0-9]/g, "")
    }
    setFormData({
      ...formData(),
      [target.name]: value,
    });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // simulate API request
    fetch("/app/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        account: formData().userAccount,
        pwd: formData().password,
        phoneNum: formData().phoneNumber,
        smsCode: formData().verificationCode
      })
    })
      .then(res => {
        res.json().then(resp => {
          if (resp.status === 200) {
            setToastShow(true);
            setToastMessage("账号注册成功")
          }
        })
      })
      .finally(() => {
        setIsSubmitting(false);
      })
  };

  const sendVerificationCode = () => {
    if (isValidPhoneNumber(formData().phoneNumber) && formData().imgVerificationCode) {
      setCodeErrorMessage('');
      setCodeErrorPhoneMessage('');

      setIsSendingCode(true);
      fetch("/app/user/sendSms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          key: formData().imgKey,
          phoneNum: formData().phoneNumber,
          value: formData().imgVerificationCode.toLocaleLowerCase()
        })
      })
        .then(res => {
          res.json().then(resp => {
            if (resp.status === 200) {
              setIsCodeSent(true);
              setToastShow(true);
              setTimeout(() => {
                setToastShow(false);
              }, 2000)
            }
          })
        })
        .finally(() => {
          setIsSendingCode(false);
        })
    } else {
      if (!formData().imgVerificationCode) {
        setCodeErrorPhoneMessage('请输入正确的手机号码');
      }
    }

  };

  const verifyCode = () => {
    if (formData().password !== formData().confirmPassword || formData().confirmPassword.length < 6) {
      setIsPasswordMatch(false);
      return;
    } else {
      setIsPasswordMatch(true);
    }

    if (formData().verificationCode) {
      setCodeErrorMessage('');
    } else {
      setCodeErrorMessage('请输入正确的验证码');
      return;
    }

    if (formData().userAccount) {
      handleSubmit();
    }
  };

  const debounceSubmit = (fn: () => void, delay: number) => {
    let timeoutId: number;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(fn, delay);
    };
  };

  const createImg = () => {
    fetch("/app/user/oauth/captcha").then(res => {
      res.json().then(resp => {
        console.log(resp)
        if (resp.data.image) {
          setValidImgUrl(resp.data.image);
          setFormData({
            ...formData(),
            imgKey: resp.data.key
          })
        }
      })
    })
  }
  createImg();
  const [toastShow, setToastShow] = createSignal(false);
  const [toastMessage, setToastMessage] = createSignal("短信发送成功");

  const handleDebouncedSubmit = debounceSubmit(verifyCode, 500);

  return (
    <form class="registration-form">
      <h2>注册账号</h2>
      <div class={"toast" + (toastShow() ? " show" : "")}>{toastMessage()}</div>
      <div class="form-group">
        <label for="userAccount">账号:</label>
        <input type="text" name="userAccount" id="userAccount" placeholder="请输入账号" onInput={handleInputChange} />
      </div>
      <div class="form-group">
        <label for="password">密码:</label>
        <input type="password" name="password" id="password" placeholder="请输入密码" onInput={handleInputChange} />
      </div>
      <div class="form-group">
        <div>
          <label for="confirm-password">确认密码:</label>
          <input type="password" name="confirmPassword" id="confirm-password" placeholder="请确认密码" onInput={handleInputChange} />
        </div>
        {!isPasswordMatch() && <span class="error-message">两次输入的密码不一致</span>}
      </div>
      <div class="form-group">
        <label for="phone-number">手机号码:</label>
        <div class='flex'>
          <input type="text" disabled={isCodeSent()} name="phoneNumber" id="phone-number" placeholder="请输入手机号码" onInput={handleInputChange} />
        </div>
        <div>
          <span class="error-message">{codeErrorPhoneMessage()}</span>
        </div>
      </div>
      {
        !isCodeSent() ? <div class="form-group">
          <label for="phone-number">图片验证码:</label>
          <div class='flex'>
            <input type="text" name="imgVerificationCode" id="img-verification-code" placeholder="请输入图片验证码" onInput={handleInputChange} />
            <img style={{ cursor: "pointer" }} onClick={createImg} src={validImgUrl()} alt="验证码" />
          </div>
          <button class="send-code-button" type="button" disabled={isSendingCode()} onClick={sendVerificationCode}>
            {isSendingCode() ? '发送中...' : '发送短信'}
          </button>
        </div> :
          <div class="form-group">
            <label for="verification-code">短信验证码:</label>
            <div class='flex' >
              <input type="text" name="verificationCode" id="verification-code" placeholder="请输入验证码" onInput={handleInputChange} />
            </div>
            <div>
              <span class="error-message">{codeErrorMessage()}</span>
            </div>
            <div>
              <button class="send-code-button" type="button" disabled={isSubmitting()} onClick={handleDebouncedSubmit}>
                {isSubmitting() ? '添加中...' : '添加账号'}
              </button>
            </div>
          </div>

      }
    </form>
  );
}
