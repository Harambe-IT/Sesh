const LoginReducer = (prevState, action) => {
  switch (action.type) {
    case 'AUTH_CHANGED':
      return {
        ...prevState,
        user: action.user,
        isLoading: false,
      };
    case 'LOGIN_ERROR':
      return {
        ...prevState,
        loginError: action.errorMessage,
      };
    case 'REGISTER_ERROR':
      return {
        ...prevState,
        registerError: action.errorMessage,
      };
  }
};

export default LoginReducer;
