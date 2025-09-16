import { DataTypes } from "sequelize";  
import sequelize from "./Sequelize.js";

import { emailRegexp } from "../constants/auth-constants.js";

const User = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: emailRegexp,
      },
      unique: { args: true, msg: "Email address already in use!" },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subscription: {
      type: DataTypes.ENUM,
      values: ["starter", "pro", "business"],
      defaultValue: "starter",
    },
    token: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

User.sync({ alter: true });
export default User;

