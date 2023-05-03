import { createSignal } from 'solid-js';
import './RegistrationPage.css';
import './registrationOther.css'
import { isValidPhoneNumber, isValidAccount } from '../utils/valid';
import trueIcon from '../assets/trueIcon.png';
import greenLightIcon from '../assets/greenLightIcon.png';
import redLightIcon from '../assets/redLightIcon.png';
import openEye from '../assets/openEye.png';
import closeEye from '../assets/closeEye.png';
import { encryptAes } from '../utils/crypto'

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
  // 密码展示控制
  const [isOpenEye, setIsOpenEye] = createSignal(false)
  const [isOpenConfirmEye, setIsOpenConfirmEye] = createSignal(false)
  // 密码控制函数
  const openEyeFun = () => {
    setIsOpenEye(!isOpenEye())
  }
  const openConfirmEyeFun = () => {
    setIsOpenConfirmEye(!isOpenConfirmEye())
  }
  // 红绿灯
  const [light, setLight] = createSignal(greenLightIcon)
  // 是否注册成功
  const [isAddOver, setIsAddOver] = createSignal(false);
  // 必填校验
  const [vaildDataRequired, setVaildDataRequired] = createSignal({
    userAccount: '请输入账号',
    password: '请输入密码',
    confirmPassword: '请输入确认密码',
    verificationCode: '请输入短信验证码',
    phoneNumber: '请输入手机号码',
    imgVerificationCode: '请输入图片验证码'
  });
  // 是否触发校验
  const [vaildDataShow, setVaildDataShow] = createSignal({
    userAccount: false,
    password: false,
    confirmPassword: false,
    verificationCode: false,
    phoneNumber: false,
    imgVerificationCode: false
  });
  // 判断账号是否注册过
  const isAccountRegistra = (value: string) => {
    return new Promise((resolve: any, reject: any) => {
      const url = "/app/user/checkName/" + value
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          res.json().then(resp => {
            if (resp.status === 200) {
              resolve(resp) 
            } else {
              reject(resp)
            }
          })
        })
        .catch(() => {
          reject()
        })
    })
  }
  // 清空输入框中的数据
  const clearFormData = (obj: any) => {
    for (const key in obj) {
      const input = document.getElementById(key) as HTMLInputElement;
      if (!obj[key] && input) {
        input.value = ""
      }
    }
  }
  // 返回登录
  const goBack = () => {
    setFormData({
      userAccount: '',
      password: '',
      confirmPassword: '',
      verificationCode: '',
      phoneNumber: '',
      imgVerificationCode: '',
      imgKey: formData().imgKey
    })
    clearFormData(formData())
    setIsAddOver(false)
    setIsCodeSent(false)
  }
  const handleOnChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    let value = target.value
    if (!value) return
    // 判断账号是否注册过
    isAccountRegistra(value).then(() => {
      setLight(greenLightIcon)
    }).catch((resp) => {
      setToastMessage(resp ? resp.message : '系统异常')
      setToastShow(true);
      setTimeout(() => {
        setToastShow(false);
      }, 2000)
      setLight(redLightIcon)
    })
  };
  const handleInputChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    let value = target.value
    if (target.name === "userAccount") {
      // value = value.replace(/[^a-zA-Z0-9]/g, "")
      // // 判断账号是否注册过
      // isAccountRegistra(value).then(() => {
      //   setLight(greenLightIcon)
      // }).catch((resp) => {
      //   setToastMessage(resp ? resp.message : '系统异常')
      //   setToastShow(true);
      //   setTimeout(() => {
      //     setToastShow(false);
      //   }, 2000)
      //   setLight(redLightIcon)
      // })
    }
    setFormData({
      ...formData(),
      [target.name]: value,
    });
  };
  const handleSubmit = () => {
    setIsSubmitting(true);
    setToastShow(false);
    // simulate API request
    fetch("/app/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        account: encryptAes(formData().userAccount),
        pwd: encryptAes(formData().password),
        phoneNum: encryptAes(formData().phoneNumber),
        smsCode: encryptAes(formData().verificationCode)
      })
    })
      .then(res => {
        res.json().then(resp => {
          debugger
          if (resp.status === 200) {
            setIsAddOver(true)
            setToastMessage("账号注册成功")
            setToastShow(true);
            setTimeout(() => {
              setToastShow(false);
            }, 2000)
          } else if (resp.status === 402) {
            setIsCodeSent(false)
            setToastMessage(resp.message)
            setToastShow(true);
            setTimeout(() => {
              setToastShow(false);
            }, 2000)
          } else if (resp.status === 403) {
            setToastMessage(resp.message)
            setToastShow(true);
            setTimeout(() => {
              setToastShow(false);
            }, 2000)
            setFormData({
              ...formData(),
              phoneNumber: ''
            })
            clearFormData(formData())
            setIsCodeSent(false)
          } else {
            setToastMessage(resp.message)
            setToastShow(true);
            setTimeout(() => {
              setToastShow(false);
            }, 2000)
          }
        })
      })
      .catch(() => {
        setToastMessage('系统异常')
        setToastShow(true);
        setTimeout(() => {
          setToastShow(false);
        }, 2000)
      })
      .finally(() => {
        setIsSubmitting(false);
      })
  };

  const sendVerificationCode = () => {
    if (formData().phoneNumber && isValidPhoneNumber(formData().phoneNumber) && formData().imgVerificationCode) {
      setVaildDataShow({
        ...vaildDataShow(),
        phoneNumber: false,
        imgVerificationCode: false
      })
      setCodeErrorMessage('');
      setCodeErrorPhoneMessage('');

      setIsSendingCode(true);
      setToastShow(false);
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
              setToastMessage('短信发送成功')
              setToastShow(true);
              setTimeout(() => {
                setToastShow(false);
              }, 2000)
            } else {
              setToastMessage(resp.message)
              setToastShow(true);
              setTimeout(() => {
                setToastShow(false);
              }, 2000)
            }
          })
        })
        .catch(() => {
          setToastMessage('系统异常')
          setToastShow(true);
          setTimeout(() => {
            setToastShow(false);
          }, 2000)
        })
        .finally(() => {
          setIsSendingCode(false);
        })
    } else {
      if (!formData().phoneNumber) {
        setVaildDataRequired({
          ...vaildDataRequired(),
          phoneNumber: '请输入手机号码'
        })
        setVaildDataShow({
          ...vaildDataShow(),
          phoneNumber: true
        })
      }else if (!isValidPhoneNumber(formData().phoneNumber)) {
        setVaildDataRequired({
          ...vaildDataRequired(),
          phoneNumber: '请输入正确手机号码'
        })
        setVaildDataShow({
          ...vaildDataShow(),
          phoneNumber: true
        })
      } else if (!formData().imgVerificationCode) {
        setVaildDataShow({
          ...vaildDataShow(),
          imgVerificationCode: true
        })
      }
      if (formData().phoneNumber) {
        setVaildDataShow({
          ...vaildDataShow(),
          phoneNumber: false
        })
      }
    }

  };

  // 判断密码是否一致
  const makeSurePassWord = () => {
    if (formData().confirmPassword && formData().password && (formData().password !== formData().confirmPassword || formData().confirmPassword.length < 6)) {
      // setIsPasswordMatch(false);
      setVaildDataRequired({
        ...vaildDataRequired(),
        confirmPassword: '两次输入的需密码一致，且必须大于6位数'
      })
      setVaildDataShow({
        ...vaildDataShow(),
        confirmPassword: true
      })
    } else {
      setVaildDataRequired({
        ...vaildDataRequired(),
        confirmPassword: '请输入确认密码'
      })
      setVaildDataShow({
        ...vaildDataShow(),
        confirmPassword: false
      })
    }
  }

  const verifyCode = () => {
    // 是否校验不通过
    let vaild = false
    // 必填校验判断
    for (const key in formData()) {
      const item: any = formData()[key]
      if (!item) {
        setVaildDataShow({
          ...vaildDataShow(),
          [key]: true
        })
        vaild = true
      } else {
        setVaildDataShow({
          ...vaildDataShow(),
          [key]: false
        })
      }
    }
    console.log(vaildDataShow())
    // 密码其他校验
    if (formData().confirmPassword && formData().password && (formData().password !== formData().confirmPassword || formData().confirmPassword.length < 6)) {
      // setIsPasswordMatch(false);
      setVaildDataRequired({
        ...vaildDataRequired(),
        confirmPassword: '两次输入的需密码一致，且必须大于6位数'
      })
      setVaildDataShow({
        ...vaildDataShow(),
        confirmPassword: true
      })
      vaild = true
    } else {
      // setIsPasswordMatch(true);
      setVaildDataRequired({
        ...vaildDataRequired(),
        confirmPassword: '请输入确认密码'
      })
      if (formData().confirmPassword) {
        setVaildDataShow({
          ...vaildDataShow(),
          confirmPassword: false
        })
      }
    }
    console.log(isValidAccount(formData().userAccount), formData().userAccount)
    // 账号其他校验
    if (formData().userAccount && !isValidAccount(formData().userAccount)) {
      setVaildDataRequired({
        ...vaildDataRequired(),
        userAccount: '账号由字母加数字组成'
      })
      setVaildDataShow({
        ...vaildDataShow(),
        userAccount: true
      })
      vaild = true
    } else {
      setVaildDataRequired({
        ...vaildDataRequired(),
        userAccount: '请输入账号'
      })
      if (formData().userAccount) {
        setVaildDataShow({
          ...vaildDataShow(),
          userAccount: false
        })
      }
    }

    if (formData().verificationCode) {
      setCodeErrorMessage('');
    } else {
      setCodeErrorMessage('请输入正确的验证码');
      vaild = true
    }
    if (vaild) {
      console.log(vaildDataRequired(), vaildDataShow(), formData())
      return
    } else {
      setVaildDataShow({
        userAccount: false,
        password: false,
        confirmPassword: false,
        verificationCode: false,
        phoneNumber: false,
        imgVerificationCode: false
      })
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
        if (resp.status !== 200) {
          setToastMessage(resp.message)
          setToastShow(true);
          setTimeout(() => {
            setToastShow(false);
          }, 2000)
        }
        if (resp.data.image) {
          setValidImgUrl(resp.data.image);
          setFormData({
            ...formData(),
            imgKey: resp.data.key
          })
        }
      }).catch(() => {
        setToastMessage('系统异常')
        setToastShow(true);
        setTimeout(() => {
          setToastShow(false);
        }, 2000)
      })
    })
  }
  createImg();
  const [toastShow, setToastShow] = createSignal(false);
  const [toastMessage, setToastMessage] = createSignal("短信发送成功");

  const handleDebouncedSubmit = debounceSubmit(verifyCode, 500);

  return (
    
    <div>
      {
        isAddOver() ? 
        <div class="registration-success">
          <div class="success-top">
            注册
          </div>
          <div class="success-middle">
            <img src={trueIcon} alt="" srcset="" />
            <div class="success-middle-text">
              恭喜，注册成功
            </div>
          </div>
          <div class="success-bottom">
            <span onClick={goBack}>返回登录</span>
          </div>
        </div> :
        <form class="registration-form">
          <h2>注册账号</h2>
          <div class={"toast" + (toastShow() ? " show" : "")}>{toastMessage()}</div>
          <div class="form-group">
            <label for="userAccount">账号:</label>
            <input type="text" name="userAccount" id="userAccount" placeholder="请输入账号" onInput={handleInputChange} onBlur={handleOnChange} />
            <img class="account-icon" src={light()} alt="" srcset="" />
            <div>
              {vaildDataShow().userAccount && <span class="error-message">{vaildDataRequired().userAccount}</span>}
            </div>
          </div>
          <div class="form-group">
            <label for="password">密码:</label>
            <input type={isOpenEye() ? "text" : "password"} name="password" id="password" placeholder="请输入密码" onInput={handleInputChange} onBlur={makeSurePassWord} />
            <img class="account-icon" src={isOpenEye() ? openEye : closeEye} alt="" srcset="" onClick={openEyeFun} />
            <div>
              {vaildDataShow().password && <span class="error-message">{vaildDataRequired().password}</span>}
            </div>
          </div>
          <div class="form-group">
            <div>
              <label for="confirm-password">确认密码:</label>
              <input type={isOpenConfirmEye() ? "text" : "password"} name="confirmPassword" id="confirmPassword" placeholder="请确认密码" onInput={handleInputChange} onBlur={makeSurePassWord} />
              <img class="account-icon" src={isOpenConfirmEye() ? openEye : closeEye} alt="" srcset="" onClick={openConfirmEyeFun} />
            </div>
            <div>
              {vaildDataShow().confirmPassword && <span class="error-message">{vaildDataRequired().confirmPassword}</span>}
            </div>
          </div>
          <div class="form-group">
            <label for="phone-number">手机号码:</label>
            <div class='flex'>
              <input type="text" disabled={isCodeSent()} name="phoneNumber" id="phoneNumber" placeholder="请输入手机号码" onInput={handleInputChange} />
            </div>
            <div>
              {vaildDataShow().phoneNumber && <span class="error-message">{vaildDataRequired().phoneNumber}</span>}
            </div>
            {/* <div>
              <span class="error-message">{codeErrorPhoneMessage()}</span>
            </div> */}
          </div>
          {/* <button class="send-code-button" type="button" disabled={isSubmitting()} onClick={handleDebouncedSubmit}>
            测试
          </button> */}
          {
            !isCodeSent() ? <div class="form-group">
              <label for="phone-number">图片验证码:</label>
              <div class='flex'>
                <input type="text" name="imgVerificationCode" id="imgVerificationCode" placeholder="请输入图片验证码" onInput={handleInputChange} />
                <img style={{ cursor: "pointer" }} onClick={createImg} src={validImgUrl()} alt="验证码" />
              </div>
              <div class='marbottom'>
                {vaildDataShow().imgVerificationCode && <span>{vaildDataRequired().imgVerificationCode}</span>}
              </div>
              <button class="send-code-button" type="button" disabled={isSendingCode()} onClick={sendVerificationCode}>
                {isSendingCode() ? '发送中...' : '发送短信'}
              </button>
            </div> :
              <div class="form-group">
                <label for="verification-code">短信验证码:</label>
                <div class='flex' >
                  <input type="text" name="verificationCode" id="verificationCode" placeholder="请输入验证码" onInput={handleInputChange} />
                </div>
                <div class='marbottom'>
                  {/* <span class="error-message">{codeErrorMessage()}</span> */}
                  {vaildDataShow().verificationCode && <span>{vaildDataRequired().verificationCode}</span>}
                </div>
                <div>
                  <button class="send-code-button" type="button" disabled={isSubmitting()} onClick={handleDebouncedSubmit}>
                    {isSubmitting() ? '添加中...' : '添加账号'}
                  </button>
                </div>
              </div>

          }
        </form>
      }
    </div>
  );
}
