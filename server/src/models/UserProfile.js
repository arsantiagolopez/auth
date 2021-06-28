export default (sequelize, DataTypes) => {
  // Model definition
  const UserProfile = sequelize.define("UserProfile", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      isUnique: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
    },
    bio: {
      type: DataTypes.STRING(140),
    },
    picture: {
      type: DataTypes.TEXT,
    },
  });

  // Model associations
  UserProfile.associate = (models) => {};

  return UserProfile;
};
