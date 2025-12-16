import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { handleError } from "./helpers";
import { getAuth, refreshTokenService } from "./services";
import LoadingPage from "./components/LoadingPage";
import { useDispatch } from "react-redux";
import { commonActions } from "../store/common";
import config from "./config";
import { authActions } from "../store/auth";

const AuthContext = createContext(null);

const AuthProvider = () => {
  // state
  const [isGettingUser, setIsGettingUser] = useState(true);
  const [isRefreshPage, setIsRefreshPage] = useState(true);
  const [profile, setProfile] = useState(null);
  const [loginType, setLoginType] = useState(null);

  // load localStorage
  useEffect(() => {
    const storedProfile = localStorage.getItem(config.LOCAL_PROFILE);
    const storedLoginType = localStorage.getItem(config.LOCAL_LOGIN_TYPE);

    if (storedProfile) {
      try {
        setProfile(JSON.parse(storedProfile));
      } catch (error) {
        console.error("❌ Lỗi parse profile:", error);
      }
    }

    if (storedLoginType) {
      try {
        setLoginType(JSON.parse(storedLoginType));
      } catch (error) {
        console.error("❌ Lỗi parse loginType:", error);
      }
    }
  }, []);

  // hook
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = async () => {
    if (!navigator.onLine) {
      // Điều hướng đến trang No Internet
      navigate("/no-internet", {
        state: {
          message: "You are currently offline. Please check your connection.",
        },
      });
      return;
    }

    localStorage.removeItem(config.LOCAL_PROFILE);
    localStorage.removeItem(config.LOCAL_AUTHENTICATED);
    localStorage.removeItem(config.LOCAL_ACCESS_TOKEN);
    localStorage.removeItem(config.LOCAL_REFRESH_TOKEN);
    localStorage.removeItem(config.LOCAL_LOGIN_TYPE);

    setProfile(null); // Đặt rõ ràng profile thành null
    setLoginType(null);

    navigate("/login", {
      state: {
        returnUrl: location.pathname,
      },
    });

    window.location.reload();
  };

  const fetchUser = async () => {
    setIsGettingUser(true);

    // ========== CODE CŨ: Gọi API getAuth (đã comment) ==========
    // var tryTime = 3;
    // try {
    //   const newProfile = await getAuth();

    //   setProfile(newProfile);
    //   dispatch(authActions.setCurrentUser(newProfile.user));

    //   localStorage.setItem(config.LOCAL_PROFILE, JSON.stringify(newProfile));
    // } catch (error) {
    //   if (handleError(error) === '"401"' && tryTime >= 0) {
    //     try {
    //       tryTime--;

    //       await handleRefreshToken();
    //       await fetchUser();

    //       return;
    //     } catch (error) {
    //       logout();
    //     }
    //   } else {
    //     logout();
    //   }
    // }
    // ========== KẾT THÚC CODE CŨ ==========

    // ========== CODE MỚI: Bỏ qua API - chỉ dùng localStorage ==========
    try {
      const storedProfile = localStorage.getItem(config.LOCAL_PROFILE);
      if (storedProfile) {
        const newProfile = JSON.parse(storedProfile);
        setProfile(newProfile);
        if (newProfile.user) {
          dispatch(authActions.setCurrentUser(newProfile.user));
        }
      }
    } catch (error) {
      console.error("❌ Lỗi load profile từ localStorage:", error);
    }
    // ========== KẾT THÚC CODE MỚI ==========

    setIsGettingUser(false);
    setIsRefreshPage(false);
  };

  const getWorkLocationAndMapping = async () => {
    try {
      let workLocation = [];

      dispatch(commonActions.setWorkLocationList(workLocation));
    } catch (error) {
      handleError(error);
    }
  };

  const handleRefreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem(config.LOCAL_REFRESH_TOKEN);
      const accessToken = localStorage.getItem(config.LOCAL_ACCESS_TOKEN);
      const newToken = await refreshTokenService(accessToken, refreshToken);

      localStorage.setItem(config.LOCAL_ACCESS_TOKEN, newToken.accessToken);
      localStorage.setItem(config.LOCAL_REFRESH_TOKEN, newToken.refreshToken);

      return newToken;
    } catch (error) {
      logout();
    }
  };

  useEffect(() => {
    // ========== CODE CŨ: Gọi fetchUser và getWorkLocationAndMapping (đã comment) ==========
    // fetchUser();
    // getWorkLocationAndMapping();
    // ========== KẾT THÚC CODE CŨ ==========

    // ========== CODE MỚI: Chỉ load từ localStorage, không gọi API ==========
    // Load profile từ localStorage ngay lập tức
    const storedProfile = localStorage.getItem(config.LOCAL_PROFILE);
    if (storedProfile) {
      try {
        const profileData = JSON.parse(storedProfile);
        setProfile(profileData);
        if (profileData.user) {
          dispatch(authActions.setCurrentUser(profileData.user));
        }
        setIsGettingUser(false);
        setIsRefreshPage(false);
      } catch (error) {
        console.error("❌ Lỗi parse profile:", error);
        setIsGettingUser(false);
        setIsRefreshPage(false);
      }
    } else {
      setIsGettingUser(false);
      setIsRefreshPage(false);
    }
    // ========== KẾT THÚC CODE MỚI ==========
  }, []);

  if (isGettingUser && isRefreshPage) {
    return <LoadingPage open={true} />;
  }

  // if (
  //   profile &&
  //   !isRefreshPage &&
  //   location.pathname !== '/term' &&
  //   profile.account &&
  //   !profile.account.IsAcceptedTerm
  // ) {
  //   return <Navigate to="/term" state={{ returnUrl: location.pathname }} />
  // }

  if (profile && !isRefreshPage) {
    //console.log("🔐 AuthProvider profile:", profile);
    return (
      <AuthContext.Provider value={{ profile, logout, fetchUser, loginType }}>
        <Outlet />
      </AuthContext.Provider>
    );
  }

  if (!profile && !isGettingUser) {
    return <Navigate to="/login" state={{ returnUrl: location.pathname }} />;
  }
};

export function useAuth() {
  const { profile, logout, fetchUser, loginType } = useContext(AuthContext);
  return { profile, logout, fetchUser, loginType };
}

export default AuthProvider;
