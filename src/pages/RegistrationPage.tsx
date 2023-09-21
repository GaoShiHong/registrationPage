import { createSignal, For, Show } from 'solid-js';
import './RegistrationPage.css';
import './registrationOther.css'
import { isValidPhoneNumber, isValidAccount } from '../utils/valid';
import trueIcon from '../assets/trueIcon.png';
import greenLightIcon from '../assets/greenLightIcon.png';
import redLightIcon from '../assets/redLightIcon.png';
import openEye from '../assets/openEye.png';
import closeEye from '../assets/closeEye.png';
import linkIcon from '../assets/linkIcon.jpg';
import { encryptAes } from '../utils/crypto'
import { Model } from './Model';

export function RegistrationPage() {
  const [formData, setFormData] = createSignal({
    userAccount: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
    // phoneNumber: '',
    imgVerificationCode: '',
    imgKey: '',
    activationCode: '',
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
  const [lightMessage, setLightMessage] = createSignal('')
  // 是否注册成功
  const [isAddOver, setIsAddOver] = createSignal(false);
  // 注册成功返回的邀请码
  const [overCode, setOverCode] = createSignal('')
  // 必填校验
  const [vaildDataRequired, setVaildDataRequired] = createSignal({
    userAccount: '请输入账号',
    password: '请输入密码',
    confirmPassword: '请输入确认密码',
    verificationCode: '请输入短信验证码',
    // phoneNumber: '请输入手机号码',
    imgVerificationCode: '请输入图片验证码',
    invitationCode: '请输入邀请码',
    activationCode: '请输入激活码',
  });
  // 是否触发校验
  const [vaildDataShow, setVaildDataShow] = createSignal({
    userAccount: false,
    password: false,
    confirmPassword: false,
    verificationCode: false,
    // phoneNumber: false,
    imgVerificationCode: false,
    invitationCode: false,
    activationCode: false,
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
  // 清空校验提示信息
  const clearValideFun = () => {
    setVaildDataShow({
      userAccount: false,
      password: false,
      confirmPassword: false,
      verificationCode: false,
      // phoneNumber: false,
      imgVerificationCode: false,
      invitationCode: false,
      activationCode: false,
    })
  }
  // 返回登录
  const goBack = () => {
    setFormData({
      userAccount: '',
      password: '',
      confirmPassword: '',
      verificationCode: '',
      // phoneNumber: '',
      imgVerificationCode: '',
      imgKey: formData().imgKey,
      activationCode: '',
    })
    clearFormData(formData())
    setIsAddOver(false)
    setOverCode('')
    setIsCodeSent(false)
  }
  const handleOnChange = (event: Event) => {
    if (actionName() === 'registration') {
      const target = event.target as HTMLInputElement;
      let value = target.value
      if (!value) return
      // 判断账号是否注册过
      isAccountRegistra(value).then(() => {
        setLight(greenLightIcon)
      }).catch((resp) => {
        setToastMessage(resp ? resp.message : '系统异常')
        setLightMessage(resp ? resp.message : '系统异常')
        setToastShow(true);
        setTimeout(() => {
          setToastShow(false);
        }, 2000)
        setLight(redLightIcon)
      })
    }
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
        // phoneNum: encryptAes(formData().phoneNumber),
        // smsCode: encryptAes(formData().verificationCode),
        activationCode: encryptAes(formData().activationCode),
      })
    })
      .then(res => {
        res.json().then(resp => {
          if (resp.status === 200) {
            setIsAddOver(true)
            setToastMessage("账号注册成功")
            setOverCode(resp.data)
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
            // setFormData({
            //   ...formData(),
            //   phoneNumber: ''
            // })
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
  const [passwordOver, setPasswordOver] = createSignal(false)
  const makePassWordFun = () => {
    if (formData().confirmPassword && formData().password && (formData().password !== formData().confirmPassword || formData().confirmPassword.length < 6)) {
      return false
    } else {
      return true
    }
  }
  // 判断密码是否符合规则，判断密码是否一致
  const makeSurePassWordFun = () => {
    // 判断密码是否符合规则
    if (formData().password) {
      // 特殊字符
      const containSpecial = new RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/)
      // 是否包含数字
      const num = /\d/
      const isHasNum = num.test(formData().password)
      // 是否包含小写字母
      const smallLetter = /[a-z]/
      const isHasSmallLetter = smallLetter.test(formData().password)
      // 是否包含大写字母
      const bigLetter = /[A-Z]/
      const isHasBigLetter = bigLetter.test(formData().password)
      let isPassWordHave = 0
      if (isHasNum) isPassWordHave++
      if (isHasSmallLetter) isPassWordHave++
      if (isHasBigLetter) isPassWordHave++
      if (containSpecial.test(formData().password)) {
        // setVaildDataRequired({
        //   ...vaildDataRequired(),
        //   password: '不包含空格'
        // })
        // setVaildDataShow({
        //   ...vaildDataShow(),
        //   password: true
        // })
        // setPasswordOver(true)
        return {
          text: '不能包含空格和特殊符号',
          bool: true
        }
      } else if (formData().password.length < 8 || formData().password.length > 16) {
        // setVaildDataRequired({
        //   ...vaildDataRequired(),
        //   password: '长度为8到16个字符'
        // })
        // setVaildDataShow({
        //   ...vaildDataShow(),
        //   password: true
        // })
        // setPasswordOver(true)
        return {
          text: '长度为8到16个字符',
          bool: true
        }
      } else if (isPassWordHave < 3) {
        // setVaildDataRequired({
        //   ...vaildDataRequired(),
        //   password: '密码必须包含特殊字符，字母大写，字母小写，数字其中三项'
        // })
        // setVaildDataShow({
        //   ...vaildDataShow(),
        //   password: true
        // })
        // setPasswordOver(true)
        return {
          text: '密码必须包含字母大写，字母小写，数字三项',
          bool: true
        }
      } else {
        return {
          text: '',
          bool: false
        }
      }
      // else {
        // 判断密码是否一致
      //   if (!makePassWordFun()) {
      //     setVaildDataRequired({
      //       ...vaildDataRequired(),
      //       confirmPassword: '两次输入的需密码一致，且必须大于6位数'
      //     })
      //     setVaildDataShow({
      //       ...vaildDataShow(),
      //       confirmPassword: true
      //     })
      //     setPasswordOver(true)
      //   } else {
      //     setVaildDataRequired({
      //       ...vaildDataRequired(),
      //       password: '请输入密码'
      //     })
      //     setVaildDataShow({
      //       ...vaildDataShow(),
      //       password: false
      //     })
      //     setPasswordOver(false)
      //   }
      // }
    } else {
      // setVaildDataRequired({
      //   ...vaildDataRequired(),
      //   password: '请输入密码'
      // })
      // setVaildDataShow({
      //   ...vaildDataShow(),
      //   password: true
      // })
      return {
        text: '请输入密码',
        bool:  true
      }
    }
  }
  const makeConfirmPasswordFun = () => {
    if (formData().confirmPassword) {
      if (!makePassWordFun()) {
        // setVaildDataRequired({
        //   ...vaildDataRequired(),
        //   confirmPassword: '两次输入的需密码一致，且必须大于6位数'
        // })
        // setVaildDataShow({
        //   ...vaildDataShow(),
        //   confirmPassword: true
        // })
        return {
          text: '两次输入的需密码一致，且必须大于6位数',
          bool:  true
        }
      } else {
        // setVaildDataRequired({
        //   ...vaildDataRequired(),
        //   confirmPassword: '请输入确认密码'
        // })
        // setVaildDataShow({
        //   ...vaildDataShow(),
        //   confirmPassword: false
        // })
        return {
          text: '',
          bool:  false
        }
      }
    } else {
      // setVaildDataRequired({
      //   ...vaildDataRequired(),
      //   confirmPassword: '请输入确认密码'
      // })
      // setVaildDataShow({
      //   ...vaildDataShow(),
      //   confirmPassword: true
      // })
      return {
        text: '请输入确认密码',
        bool:  true
      }
    }
  }
  const makeSurePassWord = () => {
    if (actionName() !== 'registration') return
    const { text, bool } = makeSurePassWordFun()
    setVaildDataRequired({
      ...vaildDataRequired(),
      password: text
    })
    setVaildDataShow({
      ...vaildDataShow(),
      password: bool
    })
    const comfirm = makeConfirmPasswordFun()
    setVaildDataRequired({
      ...vaildDataRequired(),
      confirmPassword: comfirm.text
    })
    setVaildDataShow({
      ...vaildDataShow(),
      confirmPassword: comfirm.bool
    })
  }
  // 判断确认密码是否密码一致
  const makeConfirmPassword = () => {
    const { text, bool } = makeConfirmPasswordFun()
    setVaildDataRequired({
      ...vaildDataRequired(),
      confirmPassword: text
    })
    setVaildDataShow({
      ...vaildDataShow(),
      confirmPassword: bool
    })
  }

  const verifyCode = () => {
    // 判断账号是否通过接口的校验
    if(light() === redLightIcon) {
      setToastMessage(lightMessage())
      setToastShow(true);
      setTimeout(() => {
        setToastShow(false);
      }, 2000)
      return
    }
    // 是否校验不通过
    let vaild = false
    // 必填校验判断
    for (const key in formData()) {
      const item: any = formData()[key]
      if (!item && key !== 'verificationCode' && key !== 'imgVerificationCode') {
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
    // 密码的其他校验
    const { text, bool } = makeSurePassWordFun()
    setVaildDataRequired({
      ...vaildDataRequired(),
      password: text
    })
    setVaildDataShow({
      ...vaildDataShow(),
      password: bool
    })
    if (bool)  vaild = true
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
    // 短信验证码校验
    // if (formData().verificationCode) {
    //   setCodeErrorMessage('');
    // } else {
    //   setCodeErrorMessage('请输入正确的验证码');
    //   vaild = true
    // }
    if (vaild) {
      console.log(vaildDataRequired(), vaildDataShow(), formData())
      return
    } else {
      setVaildDataShow({
        ...vaildDataShow(),
        userAccount: false,
        password: false,
        confirmPassword: false,
        verificationCode: false,
        // phoneNumber: false,
        imgVerificationCode: false,
        invitationCode: false,
        activationCode: false,
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

  // 邀请码功能
  // 标题
  const [titleName, setTitleName] = createSignal({
    'registration': '注册账号',
    'detailInvitation': '查询邀请码',
    'bindingInvitation': '绑定邀请码',
    'queryBinding': '查询绑定用户',
    'queryInvitation': '查询邀请用户',
  })
  // 当前操作
  const [actionName, setActionName] = createSignal('registration')
  // 邀请码校验
  const verifyInvitation = (isCode = false) => {
    let bool = false
    if (!formData().userAccount) {
      setVaildDataShow({
        ...vaildDataShow(),
        userAccount: true
      })
      setVaildDataRequired({
        ...vaildDataRequired(),
        userAccount: '请输入账号'
      })
      bool = true
    } else {
      setVaildDataShow({
        ...vaildDataShow(),
        userAccount: false
      })
    }
    // if (!formData().password) {
    //   setVaildDataShow({
    //     ...vaildDataShow(),
    //     password: true
    //   })
    //   setVaildDataRequired({
    //     ...vaildDataRequired(),
    //     password: '请输入密码'
    //   })
    //   bool = true
    // } else {
    //   setVaildDataShow({
    //     ...vaildDataShow(),
    //     password: false
    //   })
    // }
    if (!formData().imgVerificationCode) {
      setVaildDataShow({
        ...vaildDataShow(),
        imgVerificationCode: true
      })
      setVaildDataRequired({
        ...vaildDataRequired(),
        imgVerificationCode: '请输入图片验证码'
      })
      bool = true
    } else {
      setVaildDataShow({
        ...vaildDataShow(),
        imgVerificationCode: false
      })
    }
    if (isCode) {
      if (!invitationCode()) {
        setVaildDataShow({
          ...vaildDataShow(),
          invitationCode: true
        })
        setVaildDataRequired({
          ...vaildDataRequired(),
          invitationCode: '请输入邀请码'
        })
        bool = true
      } else {
        setVaildDataShow({
          ...vaildDataShow(),
          invitationCode: false
        })
      }
    }
    return bool
  }
  // 查询邀请码
  const [invitationMessage, setInvitationMessage] = createSignal('')
  const [invitationMessageBool, setInvitationMessageBool] = createSignal(false)
  const [detailModel, setDetailModel] = createSignal(false)
  // 开启查询邀请码表单
  const queryButton = () => {
    setActionName('detailInvitation')
    clearValideFun()
  }
  const queryInvitationCode = () => {
    if (verifyInvitation()) {
      return
    }
    fetch("/app/invitationCode/getCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        account: formData().userAccount,
        password: formData().password,
        key: formData().imgKey,
        value: formData().imgVerificationCode.toLocaleLowerCase()
      })
    }).then((res) => {
      console.log(res)
      res.json().then((resp) => {
        let message
        if (resp.status === 200 && resp.data) {
          message = resp.data.invitationCode
          setInvitationMessageBool(true)
        } else {
          message = resp.message
          setInvitationMessageBool(false)
        }
        setInvitationMessage(message)
        setDetailModel(true)
      })
    }).catch(() => {
      setInvitationMessageBool(false)
      setInvitationMessage('')
      setToastMessage('系统异常')
      setToastShow(true);
      setTimeout(() => {
        setToastShow(false);
      }, 2000)
    })
  }
  const closeDetial = () => {
    setDetailModel(false)
  }
  // 绑定邀请码
  const [invitationInput, setInvitationInput] = createSignal(false)
  const [invitationCode, setInvitationCode] = createSignal('')
  const bindingButton = () => {
    setActionName('bindingInvitation')
    clearValideFun()
  }
  const handleInputInvitation = (event: Event) => {
    const target = event.target as HTMLInputElement;
    let value = target.value
    setInvitationCode(value)
  }
  const bindingInvitationCode = () => {
    if (!invitationInput()) {
      setInvitationInput(true)
      return
    }
    if (verifyInvitation(true)) {
      return
    }
    fetch("/app/invitationCode/bindingCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        account: formData().userAccount,
        password: formData().password,
        key: formData().imgKey,
        value: formData().imgVerificationCode.toLocaleLowerCase(),
        bindingInvitationCode: invitationCode()
      })
    }).then((res) => {
      console.log(res)
      res.json().then((resp) => {
        setToastMessage(resp.message)
        setToastShow(true);
        setTimeout(() => {
          setToastShow(false);
        }, 2000)
      })
    }).catch(() => {
      setToastMessage('系统异常')
      setToastShow(true);
      setTimeout(() => {
        setToastShow(false);
      }, 2000)
    })
  }
  // 查询绑定用户
  const [unbindModel, setUnbindModel] = createSignal(false)
  const [userInvitationCode, setUserInvitationCode] = createSignal('')
  const [userInvitationAccount, setUserInvitationAccount] = createSignal('')
  const [invitationId, setInvitationId] = createSignal('')
  const unbindButton = () => {
    setActionName('queryBinding')
    clearValideFun()
  }
  const unbindInvitationCode = () => {
    if (verifyInvitation()) {
      return
    }
    // setUnbindModel(true)
    fetch("/app/invitationCode/acquiresTheBoundUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        account: formData().userAccount,
        password: formData().password,
        key: formData().imgKey,
        value: formData().imgVerificationCode.toLocaleLowerCase()
      })
    }).then((res) => {
      console.log(res)
      res.json().then((resp) => {
        if (resp.status === 200) {
          setUserInvitationCode(resp.data.invitationCode)
          setUserInvitationAccount(resp.data.account)
          setInvitationId(resp.data.id)
          setUnbindModel(true)
        } else {
          setToastMessage(resp.message ? resp.message : '暂无数据')
          setToastShow(true);
          setTimeout(() => {
            setToastShow(false);
          }, 2000)
        }
      })
    }).catch(() => {
      setUnbindModel(false)
      setToastMessage('系统异常')
      setToastShow(true);
      setTimeout(() => {
        setToastShow(false);
      }, 2000)
    })
  }
  const closeUnbindTip = () => {
    setTipModel(true)
    setUnbindModel(false)
  }
  const closeUnbind = () => {
    if (verifyInvitation()) {
      return
    }
    fetch("/app/invitationCode/untie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        account: formData().userAccount,
        password: formData().password,
        id: invitationId()
      })
    }).then((res) => {
      console.log(res)
      setUnbindModel(false)
      setTipModel(false)
      res.json().then((resp) => {
        let message
        if (resp.status === 200) {
          message = "解绑成功"
        } else {
          message = resp.message
        }
        setToastMessage(message)
        setToastShow(true);
        setTimeout(() => {
          setToastShow(false);
        }, 2000)
      })
    }).catch(() => {
      setUnbindModel(false)
      setToastMessage('系统异常')
      setToastShow(true);
      setTimeout(() => {
        setToastShow(false);
      }, 2000)
    })
  }
  // 查询邀请用户
  const [userListModel, setUserListModel] = createSignal(false)
  const [userList, setUserList] = createSignal([
    {
      account: '',
      invitationCode: ''
    }
  ])
  // 获取邀请列表
  const userListButton = () => {
    setActionName('queryInvitation')
    clearValideFun()
  }
  const getUserList = () => {
    return new Promise((resolve: any, reject: any) => {
      fetch("app/invitationCode/getInvitedUsers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          account: formData().userAccount,
          password: formData().password,
          key: formData().imgKey,
          value: formData().imgVerificationCode.toLocaleLowerCase()
        })
      })
        .then(res => {
          res.json().then(resp => {
            if (resp.status === 200) {
              // resolve(resp)
              setUserList(resp.data)
              resolve(resp.data)
            } else {
              reject(resp)
            }
          })
        })
        .catch(() => {
          reject({message: '系统异常'})
        })
    })
  }
  const invitationUserList = () => {
    if (verifyInvitation()) {
      return
    }
    getUserList().then(() => {
      setUserListModel(true)
    }).catch((error) => {
      setToastMessage(error.message)
      setToastShow(true);
      setTimeout(() => {
        setToastShow(false);
      }, 2000)
    })
  }
  const [deleteCode, setDeleteCode] = createSignal([])
  const closeUserListTip = () => {
    console.log(deleteCode())
    if (deleteCode().length > 0) {
      setTipModel(true)
      setUserListModel(false)
    } else {
      setToastMessage('请勾选选项')
      setToastShow(true);
      setTimeout(() => {
        setToastShow(false);
      }, 2000)
      return
    }
  }
  const closeUserList = () => {
    fetch("/app/invitationCode/deleteInvite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        account: formData().userAccount,
        password: formData().password,
        deleteCode: deleteCode()
      })
    }).then((res) => {
      res.json().then((resp) => {
        if (resp.status === 200) {
          setUserListModel(false)
          setTipModel(false)
        }
        setToastMessage(resp.message)
        setToastShow(true);
        setTimeout(() => {
          setToastShow(false);
        }, 2000)
      })
    }).catch(() => {
      setUnbindModel(false)
      setToastMessage('系统异常')
      setToastShow(true);
      setTimeout(() => {
        setToastShow(false);
      }, 2000)
    })
  }
  const handleCheck = (e: any, item: any, i: any) => {
    const rel = deleteCode()
    const index = rel.indexOf(item.invitationCode)
    console.log('index', index)
    if (e.target.checked) {
      rel.push(item.invitationCode)
      setDeleteCode(rel)
    } else {
      rel.splice(index, 1)
      setDeleteCode(rel)
    }
    console.log(deleteCode())
  }
  // 确认
  const handleFun = () => {
    switch (actionName()) {
      case 'detailInvitation':
        queryInvitationCode()
        break;
      case 'bindingInvitation':
        bindingInvitationCode()
        break;
      case 'queryBinding':
        unbindInvitationCode()
        break;
      case 'queryInvitation':
        invitationUserList()
        break;
      default:
        break;
    }
  }
  // 取消
  const cancleFun = () => {
    setActionName('registration')
    setFormData({
      userAccount: '',
      password: '',
      confirmPassword: '',
      verificationCode: '',
      // phoneNumber: '',
      imgVerificationCode: '',
      imgKey: formData().imgKey,
      activationCode: '',
    })
    clearFormData(formData())
    clearValideFun()
  }
  // 提示弹框
  const [tipModel, setTipModel] = createSignal(false)
  // 提示确认
  const handleOk = () => {
    switch (actionName()) {
      case 'queryBinding':
        closeUnbind()
        break;
      case 'queryInvitation':
        closeUserList()
        break;
      default:
        break;
    }
  }
  // 提示取消
  const handleCancle = () => {
    switch (actionName()) {
      case 'queryBinding':
        setUnbindModel(true)
        setTipModel(false)
        break;
      case 'queryInvitation':
        setUserListModel(true)
        setTipModel(false)
        setDeleteCode([])
        break;
      default:
        break;
    }
  }

  // 首次进入弹框
  const [firstModel, setFirstModel] = createSignal(true)

  return (
    
    <div>
      <div class='registration-warp'>
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
              <div class="success-middle-message">
                这是您的邀请码，请注意保存：<span>{overCode()}</span>
              </div>
            </div>
            <div class="success-bottom">
              <span onClick={goBack}>返回登录</span>
            </div>
          </div> :
          <form class="registration-form">
            <h2>{titleName()[actionName()]}</h2>
            <div class={"toast" + (toastShow() ? " show" : "")}>{toastMessage()}</div>
            <div class="form-group">
              <label for="userAccount">账号:</label>
              <input type="text" name="userAccount" id="userAccount" placeholder="请输入账号" onInput={handleInputChange} onBlur={handleOnChange} />
              <Show
                when={actionName() === 'registration'}
              >
                <img class="account-icon" src={light()} alt="" srcset="" />
              </Show>
              <div>
                {vaildDataShow().userAccount && <span class="error-message">{vaildDataRequired().userAccount}</span>}
              </div>
              <div class='form-account-tip'>请用QQ号作为账号</div>
            </div>
            <div class="form-group">
              <label for="password">密码:</label>
              <input type={isOpenEye() ? "text" : "password"} name="password" id="password" placeholder="请输入密码" onInput={handleInputChange} onBlur={makeSurePassWord} />
              <img class="account-icon" src={isOpenEye() ? openEye : closeEye} alt="" srcset="" onClick={openEyeFun} />
              <div>
                {vaildDataShow().password && <span class="error-message">{vaildDataRequired().password}</span>}
              </div>
            </div>
            <Show
              when={actionName() === 'registration'}
            >
              <div class="form-group">
                <div>
                  <label for="confirm-password">确认密码:</label>
                  <input type={isOpenConfirmEye() ? "text" : "password"} name="confirmPassword" id="confirmPassword" placeholder="请确认密码" onInput={handleInputChange} onBlur={makeConfirmPassword} />
                  <img class="account-icon" src={isOpenConfirmEye() ? openEye : closeEye} alt="" srcset="" onClick={openConfirmEyeFun} />
                </div>
                <div>
                  {vaildDataShow().confirmPassword && <span class="error-message">{vaildDataRequired().confirmPassword}</span>}
                </div>
              </div>
              <div class="form-group">
                <label for="activation-code">激活码:</label>
                <div class='flex'>
                  <input type="text" disabled={isCodeSent()} name="activationCode" id="activationCode" placeholder="请输入激活码" onInput={handleInputChange} />
                </div>
                <div>
                  {vaildDataShow().activationCode && <span class="error-message">{vaildDataRequired().activationCode}</span>}
                </div>
              </div>
              {/* <div class="form-group">
                <label for="phone-number">手机号码:</label>
                <div class='flex'>
                  <input type="text" disabled={isCodeSent()} name="phoneNumber" id="phoneNumber" placeholder="请输入手机号码" onInput={handleInputChange} />
                </div>
                <div>
                  {vaildDataShow().phoneNumber && <span class="error-message">{vaildDataRequired().phoneNumber}</span>}
                </div>
              </div> */}
            </Show>
            {/* <button class="send-code-button" type="button" disabled={isSubmitting()} onClick={handleDebouncedSubmit}>
              测试
            </button> */}
            {
              !isCodeSent() ? <div class="form-group">
                <Show when={actionName() !== 'registration'}>
                  <label for="phone-number">图片验证码:</label>
                  <div class='flex'>
                    <input type="text" name="imgVerificationCode" id="imgVerificationCode" placeholder="请输入图片验证码" onInput={handleInputChange} />
                    <img style={{ cursor: "pointer" }} onClick={createImg} src={validImgUrl()} alt="验证码" />
                  </div>
                  <div class='marbottom'>
                    {vaildDataShow().imgVerificationCode && <span>{vaildDataRequired().imgVerificationCode}</span>}
                  </div>
                </Show>
                <Show
                  when={actionName() === 'registration'}
                >
                  {/* <button class="send-code-button" type="button" disabled={isSendingCode()} onClick={sendVerificationCode}>
                    {isSendingCode() ? '发送中...' : '发送短信'}
                  </button> */}
                  <button class="send-code-button" type="button" disabled={isSubmitting()} onClick={handleDebouncedSubmit}>
                    {isSubmitting() ? '添加中...' : '添加账号'}
                  </button>
                </Show>
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
            <Show
              when={actionName() === 'bindingInvitation'}
            >
              <div class="form-group">
                <label for="invitationCode">邀请码:</label>
                <input type="text" name="invitationCode" id="invitationCode" placeholder="请输入邀请码" onInput={handleInputInvitation} />
                <div>
                  {vaildDataShow().invitationCode && <span class="error-message">{vaildDataRequired().invitationCode}</span>}
                </div>
              </div>
            </Show>
            <Show
              when={actionName() !== 'registration'}
            >
              <div class='invitation-button'>
                <button class="invitation-button-handle" type="button" onClick={handleFun}>
                  确认
                </button>
                <button class="invitation-button-cancle" type="button" onClick={cancleFun}>
                  取消
                </button>
              </div>
            </Show>
          </form>
        }
        <Show
          when={!isAddOver()}
        >
          <div class='invitation-code'>
            <div class='invitation-code-link'>
              <a href="https://www.bilibili.com/video/BV17X4y1h7cN/?vd_source=be13a062b0f347d3c237cc1a4b7e5a16" target="_blank" rel="noopener noreferrer">
              邀请系统各项功能介绍<img src={linkIcon} alt="" srcset="" />
              </a>
              <a href="https://www.bilibili.com/video/BV1X24y1N7Hx/?vd_source=be13a062b0f347d3c237cc1a4b7e5a16" target="_blank" rel="noopener noreferrer">
              分成比例和注意事项介绍<img src={linkIcon} alt="" srcset="" />
              </a>
            </div>
            <div class='invitation-code-button'>
              <button class="send-code-button" type="button" onClick={queryButton}>
                查询邀请码
              </button>
              <button class="send-code-button" type="button" onClick={bindingButton}>
                绑定邀请码
              </button>
              <button class="send-code-button" type="button" onClick={unbindButton}>
                查询绑定用户
              </button>
              <button class="send-code-button" type="button" onClick={userListButton}>
                查询邀请用户
              </button>
            </div>
          </div>
        </Show>
      </div>
      {/* 首次进入提示 */}
      {
        firstModel() ?
          <Model title={"提示"}>
            <div class='first-model-children'>
              <div class='model-children-message'>
                如果您有志同道合的朋友，想邀请来一起玩 右方的邀请功能福利介绍，一定要看看！能让您白嫖和成为大佬
              </div>
              <button class="model-children-button" type="button" onClick={() => setFirstModel(false)}>
                关闭
              </button>
            </div>
          </Model>
        : ''
      }
      {/* 查看邀请码 */}
      {
        detailModel() ?
          <Model title={"查看邀请码"}>
            <div class='model-detail-children'>
              <div class='detail-children-message'>
              <Show
                when={invitationMessageBool()}
                fallback={<span>{invitationMessage()}</span>}
              >
                您的邀请码是：<span style={{color:'#e90000'}}>{invitationMessage()}</span>
              </Show>
              </div>
              <button class="detail-children-button" type="button" onClick={closeDetial}>
                关闭
              </button>
            </div>
          </Model>
        : ''
      }
      {/* 查询绑定用户 */}
      {
        unbindModel() ?
          <Model title={"查询绑定用户"}>
            {/* <div class='model-unbind-children'>
              <button class="unbind-children-button" type="button" onClick={closeUnbind}>
                解绑验证码
              </button>
            </div> */}
            <div class='model-detail-children'>
              <div class='detail-children-message'>
                账号：<span>{userInvitationAccount()}</span>
              </div>
              <div class='detail-children-message'>
                邀请码：<span style={{color: '#e90000'}}>{userInvitationCode()}</span>
              </div>
              <button class="detail-children-button" type="button" onClick={closeUnbindTip}>
                解绑邀请码
              </button>
              <button class="detail-children-button detail-children-close" type="button" onClick={() => setUnbindModel(false)}>
                关闭
              </button>
            </div>
          </Model>
        : ''
      }
      {/* 查询邀请用户 */}
      {
        userListModel() ?
          <Model title={"查询邀请用户"}>
            <div class='model-detail-children'>
              <div class='detail-children-list'>
                <table border="1" cellpadding="0" cellspacing="0">
                  <thead>
                    <tr>
                      <th>选项</th>
                      <th>账号</th>
                      <th>邀请码</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={userList()}>{(item, i) =>
                      <tr>
                        <td>
                          <input type="checkbox" onChange={(e) => handleCheck(e, item, i)} />
                        </td>
                        <td>{item.account}</td>
                        <td>{item.invitationCode}</td>
                        {/* <td>
                          <span onClick={deleteLi(item)}>删除邀请</span>
                        </td> */}
                      </tr>
                    }</For>
                  </tbody>
                </table>
                
              </div>
              <button class="detail-children-button" type="button" onClick={closeUserListTip}>
                删除邀请
              </button>
              <button class="detail-children-button detail-children-close" type="button" onClick={() => setUserListModel(false)}>
                关闭
              </button>
            </div>
          </Model>
        : ''
      }
      {/* 解绑、删除提示 */}
      {
        tipModel() ?
          <Model title={"提示"}>
            <div class='model-detail-children'>
              <div class='detail-children-message'>
                { actionName() === 'queryBinding' ? '您正在进行解绑邀请码，是否继续' : (actionName() === 'queryInvitation' ? '您正在进行删除，是否继续' : '操作有误') }
              </div>
              <button class="detail-children-button" type="button" onClick={handleOk}>
                确认
              </button>
              <button class="detail-children-button detail-children-close" type="button" onClick={handleCancle}>
                取消
              </button>
            </div>
          </Model>
        : ''
      }
    </div>
  );
}
