const Register = `
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      errors {
        field
        message
      }
      profile {
        id
        email
        name
        picture
        bio
        createdAt
        provider
      }
    }
  }
`;

const Login = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      errors {
        field
        message
      }
      user {
        id
      } 
    }
  }
`;

const Logout = `
  mutation Logout {
    logout
  }
`;

const ChangePassword = `
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      errors {
        field
        message
      }
      success
    }
  }
`;

const UpdateProfile = `
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      errors {
        field
        message
      }
      profile {
        id
        email
        name
        picture
        bio
        createdAt
        provider
      }
    }
  }
`;

const ChangeEmail = `
  mutation ChangeEmail($input: ChangeEmailInput!) {
    changeEmail(input: $input) {
      errors {
        field
        message
      }
      success
    }
  }
`;

const ForgotPassword = `
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      errors {
        field
        message
      }
      success
    }
  }
`;

const ResetPassword = `
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      errors {
        field
        message
      }
      user {
        id
      }
    }
  }
`;

export {
  Register,
  Login,
  Logout,
  ChangePassword,
  UpdateProfile,
  ChangeEmail,
  ForgotPassword,
  ResetPassword,
};
