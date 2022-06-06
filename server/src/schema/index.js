export default `
  type User {
    id: String!
    email: String
    provider: String!
    createdAt: String!
  }

  type UserProfile {
    id: String!
    email: String
    name: String
    picture: String
    bio: String
    createdAt: String!
    provider: String
    userId: String
  }

  type Error {
    field: String
    message: String
  }

  type GeneralResponse {
    errors: [Error!]
    success: Boolean
  }

  type AuthResponse {
    errors: [Error!]
    user: User
  }

  type UpdateProfileResponse { 
    errors: [Error!]
    profile: UserProfile
  }

  input RegisterInput {
    email: String!
    password: String!
    picture: String!
    name: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    name: String
    picture: String
    bio: String
  }

  input ChangePasswordInput {
    password: String!
    newPassword: String!
  }

  input ChangeEmailInput {
    email: String!
    password: String!
  }

  input ResetPasswordInput {
    token: String!
    password: String!
  }

  type Query {
    me: User
    myProfile: UserProfile
    myProfilePicture: String
    allUserProfiles: [UserProfile]!
    allUserProfileIds: [String]!
    getUserProfile(id: String!): UserProfile
    checkEmailAvailability(email: String!): Boolean!
  }

  type Mutation {
    register(input: RegisterInput!): UpdateProfileResponse!
    login(input: LoginInput!): AuthResponse!
    logout: Boolean!
    updateProfile(input: UpdateProfileInput!): UpdateProfileResponse!
    changePassword(input: ChangePasswordInput!): GeneralResponse!
    changeEmail(input: ChangeEmailInput!): GeneralResponse!
    forgotPassword(email: String!): GeneralResponse!
    resetPassword(input: ResetPasswordInput!): AuthResponse!
  }
`;
