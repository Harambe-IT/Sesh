const LoginReducer = (prevState, action) => {
  switch (action.type) {
    case 'AUTH_CHANGED':
      return {
        ...prevState,
        user: action.user,
        isLoading: false,
      };
    case 'LOGIN_ERROR':
      if (action.errorMessage === 'Canceled') {
        return {...prevState};
      } else {
        return {
          ...prevState,
          loginError: action.errorMessage,
        };
      }
    case 'REGISTER_ERROR':
      return {
        ...prevState,
        registerError: action.errorMessage,
      };
    case 'PASSWORD_RESET_ERROR':
      return {
        ...prevState,
        resetPasswordError: action.errorMessage,
        resetPasswordConfirmation: null,
      };
    case 'PASSWORD_RESET_SUCCESSFUL':
      return {
        ...prevState,
        resetPasswordConfirmation: action.confirmation,
        resetPasswordError: null,
      };
  }
};

export default LoginReducer;
