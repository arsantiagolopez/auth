import Sequelize from "sequelize";
import Config from "../config";
import User from "./User";
import UserProfile from "./UserProfile";

const DATABASE_URL = Config.databaseUrl;

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: console.log,
  define: {
    underscored: true,
  },
});

const models = {
  User: User(sequelize, Sequelize.DataTypes),
  UserProfile: UserProfile(sequelize, Sequelize.DataTypes),
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
