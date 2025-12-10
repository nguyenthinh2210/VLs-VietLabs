import { Button, Checkbox, Form, Image, Input } from "antd";
import imgLogo from "../../assets/FVH-Logo.png";
import { useEffect } from "react";
import { useUI } from "../../common/UIProvider";
import config from "../../common/config";
import { getAuth, loginService } from "../../common/services";
import { useNavigate } from "react-router-dom";
import { LOGIN_TYPES } from "../../common/constant";
import { useForm } from "antd/es/form/Form";
import { LoginOutlined } from "@ant-design/icons";
import { handleError } from "../../common/helpers";

function LoginForm() {
  const ui = useUI();
  const [form] = useForm();
  const navigate = useNavigate();
  const returnUrl = location.state?.returnUrl || "/";

  useEffect(() => {
    const savedUsername = localStorage.getItem(config.LOCAL_USERNAME);
    if (savedUsername) {
      form.setFieldsValue({ userName: savedUsername, remember: true });
    }
  }, [form]);

  //Function
  const handleSubmit = async () => {
    try {
      await form.validateFields();
    } catch (error) {
      return;
    }
    const values = form.getFieldsValue();
    //console.log("🔍 Giá trị nhập vào:", values);
    ui.setLoading(true);

    try {
      const loginRes = await loginService(values.userName, values.password);
      //console.log("✅ API Response:", loginRes);
      localStorage.setItem(
        config.LOCAL_ACCESS_TOKEN,
        loginRes.token.accessToken
      );
      localStorage.setItem(
        config.LOCAL_REFRESH_TOKEN,
        loginRes.token.refreshToken
      );
      localStorage.setItem(
        config.LOCAL_AUTHENTICATED,
        JSON.stringify(loginRes)
      );
      localStorage.setItem(
        config.LOCAL_LOGIN_TYPE,
        JSON.stringify(LOGIN_TYPES.MANUAL)
      );
      localStorage.setItem(
        config.LOCAL_PROFILE,
        JSON.stringify(await getAuth())
      );

      if (values.remember) {
        localStorage.setItem(config.LOCAL_USERNAME, values.userName);
      } else {
        localStorage.removeItem(config.LOCAL_USERNAME);
      }

      if (returnUrl === "/login") {
        navigate("/", { replace: true });
      } else {
        navigate(returnUrl, { replace: true });
      }
    } catch (error) {
      const message = handleError(error);
      if (message.indexOf("Incorrect") > -1) {
        ui.notiError("Thông tin đăng nhập chưa chính xác!");
      } else {
        ui.notiError("Lỗi hệ thống, vui lòng thử lại trong giây lát!");
      }
    }

    ui.setLoading(false);
  };

  return (
    <div>
      <div className="login-page">
        <div className="login-page-container">
          <div className="container">
            <div className="flex flex-row justify-center items-center gap-2">
              <Image width={80} src={imgLogo} alt="" preview={false} />
              <div>
                <div className="font-bold">Welcome FV Hospital </div>
                <div>LOGIN</div>
              </div>
            </div>
            <div className="row mt-4">
              <Form form={form} layout="vertical">
                <Form.Item
                  label="Username"
                  name="userName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter username!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter password!",
                    },
                  ]}
                >
                  <Input.Password onPressEnter={handleSubmit} />
                </Form.Item>

                {/* <Form.Item
                  initialValue={"checked"}
                  name="remember"
                  valuePropName="checked"
                >
                  <Checkbox>Remember login</Checkbox>
                </Form.Item> */}
                <div className="flex justify-center">
                  <Button
                    icon={<LoginOutlined />}
                    loading={ui.loading}
                    onClick={handleSubmit}
                    type="primary"
                  >
                    Login
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
