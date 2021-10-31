import axios from "axios";
import * as actions from "./logoutAction";
export const loginUser = (email, password) => {
  return function (dispatch) {
    dispatch(loginUserStart());

    const data = {
      email,
      password,
      returnSecureToken: true,
    };

    axios
      .post(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAs35ADQd-WDsacfuzRt5pjIHEniQ3K4yA",
        data
      )
      .then((result) => {
        const token = result.data.idToken;
        const userId = result.data.localId;
        const expiresIn = result.data.expiresIn;
        const expireDate = Date(new Date().getTime + expiresIn * 1000);
        const refreshToken = result.data.refreshToken;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("expireDate", expireDate);
        localStorage.setItem("refreshToken", refreshToken);
        dispatch(loginUserSuccess(token, userId));
        dispatch(actions.autoLogout(expiresIn * 1000));
      })
      .catch((err) => {
        dispatch(loginUserError(err));
      });
  };
};

export const loginUserStart = () => {
  return {
    type: "login_USER_START",
  };
};

export const loginUserSuccess = (token, userId) => {
  return {
    type: "login_USER_SUCCESS",
    token,
    userId,
  };
};

export const loginUserError = (error) => {
  return {
    type: "login_USER_ERROR",
    error,
  };
};
