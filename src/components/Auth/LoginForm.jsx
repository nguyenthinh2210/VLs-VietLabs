import { Button, Checkbox, Form, Image, Input } from "antd";
import imgLogo from "../../assets/LogoVLs.png";
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
    // ========== CODE CŨ: Validate form (đã comment) ==========
    // try {
    //   await form.validateFields();
    // } catch (error) {
    //   return;
    // }
    // ========== KẾT THÚC CODE CŨ ==========

    // ========== CODE MỚI: Bỏ qua validation - vào thẳng không cần nhập ==========
    // Không cần validate form, vào thẳng web
    // ========== KẾT THÚC CODE MỚI ==========
    
    const values = form.getFieldsValue();
    //console.log("🔍 Giá trị nhập vào:", values);
    ui.setLoading(true);

    try {
      // ========== CODE CŨ: Gọi API loginService (đã comment) ==========
      // const loginRes = await loginService(values.userName, values.password);
      // //console.log("✅ API Response:", loginRes);
      // localStorage.setItem(
      //   config.LOCAL_ACCESS_TOKEN,
      //   loginRes.token.accessToken
      // );
      // localStorage.setItem(
      //   config.LOCAL_REFRESH_TOKEN,
      //   loginRes.token.refreshToken
      // );
      // localStorage.setItem(
      //   config.LOCAL_AUTHENTICATED,
      //   JSON.stringify(loginRes)
      // );
      // localStorage.setItem(
      //   config.LOCAL_LOGIN_TYPE,
      //   JSON.stringify(LOGIN_TYPES.MANUAL)
      // );
      // localStorage.setItem(
      //   config.LOCAL_PROFILE,
      //   JSON.stringify(await getAuth())
      // );

      // if (values.remember) {
      //   localStorage.setItem(config.LOCAL_USERNAME, values.userName);
      // } else {
      //   localStorage.removeItem(config.LOCAL_USERNAME);
      // }

      // if (returnUrl === "/login") {
      //   navigate("/", { replace: true });
      // } else {
      //   navigate(returnUrl, { replace: true });
      // }
      // ========== KẾT THÚC CODE CŨ ==========

      // ========== CODE MỚI: Bỏ qua API loginService - vào thẳng web ==========
      // Tạo mock data để bỏ qua API và vào thẳng web
      const mockLoginRes = {
        token: {
          accessToken: "mock-access-token",
          refreshToken: "mock-refresh-token"
        }
      };
      
      const mockProfile = {
        authenticated: mockLoginRes,
        user: {
          id: 1,
          userName: values.userName || "guest",
          email: "guest@example.com"
        },
        account: {},
        permission: {}
      };

      localStorage.setItem(
        config.LOCAL_ACCESS_TOKEN,
        mockLoginRes.token.accessToken
      );
      localStorage.setItem(
        config.LOCAL_REFRESH_TOKEN,
        mockLoginRes.token.refreshToken
      );
      localStorage.setItem(
        config.LOCAL_AUTHENTICATED,
        JSON.stringify(mockLoginRes)
      );
      localStorage.setItem(
        config.LOCAL_LOGIN_TYPE,
        JSON.stringify(LOGIN_TYPES.MANUAL)
      );
      localStorage.setItem(
        config.LOCAL_PROFILE,
        JSON.stringify(mockProfile)
      );

      if (values.remember) {
        localStorage.setItem(config.LOCAL_USERNAME, values.userName);
      } else {
        localStorage.removeItem(config.LOCAL_USERNAME);
      }

      if (returnUrl === "/login") {
        navigate("/quotation-management", { replace: true });
      } else {
        navigate(returnUrl, { replace: true });
      }
      // ========== KẾT THÚC CODE MỚI ==========
    } catch (error) {
      // ========== CODE CŨ: Xử lý lỗi (đã comment) ==========
      // const message = handleError(error);
      // if (message.indexOf("Incorrect") > -1) {
      //   ui.notiError("Thông tin đăng nhập chưa chính xác!");
      // } else {
      //   ui.notiError("Lỗi hệ thống, vui lòng thử lại trong giây lát!");
      // }
      // ========== KẾT THÚC CODE CŨ ==========

      // ========== CODE MỚI: Xử lý lỗi ==========
      ui.notiError("Lỗi hệ thống, vui lòng thử lại trong giây lát!");
      // ========== KẾT THÚC CODE MỚI ==========
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
                <div className="font-bold">Welcome VietLabs </div>
                <div>LOGIN</div>
              </div>
            </div>
            <div className="row mt-4">
              <Form form={form} layout="vertical">
                <Form.Item
                  label="Tên đăng nhập"
                  name="userName"
                  // ========== CODE CŨ: Validation (đã comment) ==========
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please enter username!",
                  //   },
                  // ]}
                  // ========== KẾT THÚC CODE CŨ ==========
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  // ========== CODE CŨ: Validation (đã comment) ==========
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please enter password!",
                  //   },
                  // ]}
                  // ========== KẾT THÚC CODE CŨ ==========
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
                    Đăng nhập
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
