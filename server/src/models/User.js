export default (sequelize, DataTypes) => {
  // Model definition
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
        isUnique: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(50),
        unique: true,
        validate: { isEmail: true },
      },
      // Hashed password roughly doubles in size
      // So only allow 50 character passwords in
      // the frontend
      password: {
        type: DataTypes.STRING(100),
        validate: {
          len: {
            args: [5, 100],
            msg: "Password must be between 5 and 100 characters long.",
          },
        },
      },
      provider: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
    },
    {
      indexes: [{ fields: ["id", "email"] }],
    }
  );

  // Model associations
  User.associate = (models) => {
    User.hasOne(models.UserProfile, {
      foreignKey: "userId",
    });
  };

  return User;
};
