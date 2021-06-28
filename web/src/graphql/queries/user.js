const Me = `
  query Me {
    me {
      id
      email
      provider
      createdAt
    }
  }
`;

const MyProfile = `
  query MyProfile {
    myProfile {
      id
      email
      name
      picture
      bio
      createdAt
      userId
    }
  }
`;

const MyProfilePicture = `
  query MyProfilePicture {
    myProfilePicture
  }
`;

const AllUserProfiles = `
  query AllUserProfiles {
    allUserProfiles {
      id
      email
      name
      picture
      bio
      createdAt
      provider
      userId
    }
  }
`;

const AllUserProfileIds = `
  query AllUserProfileIds {
    allUserProfileIds
  }
`;

const GetUserProfile = `
  query GetUserProfile($id: String!) {
    getUserProfile(id: $id) {
      id
      email
      name
      picture
      bio
      createdAt
      provider
    }
  }
`;

const CheckEmailAvailability = `
  query CheckEmailAvailability($email: String!) {
    checkEmailAvailability(email: $email)
  }
`;

export {
  Me,
  MyProfile,
  MyProfilePicture,
  AllUserProfiles,
  AllUserProfileIds,
  GetUserProfile,
  CheckEmailAvailability,
};
