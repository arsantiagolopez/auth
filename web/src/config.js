// Web config file

// NextJS comes with env file support

// All values here are PUBLIC

export default {
  // API info
  api: {
    // Server URL
    serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  },

  // Portfolio info
  portfolio: {
    // Profile picture
    picture: process.env.NEXT_PUBLIC_PORTFOLIO_PICTURE,
    // Personal website
    website: process.env.NEXT_PUBLIC_PORTFOLIO_WEBSITE,
  },

  // Github info
  github: {
    // Username
    username: process.env.NEXT_PUBLIC_GITHUB_USERNAME,
    // Link
    link: process.env.NEXT_PUBLIC_GITHUB_LINK,
  },
};
