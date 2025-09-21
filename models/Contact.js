import { DataTypes } from "sequelize";
import sequelize from "../db/Sequelize.js";
import User from "../db/User.js";

const Contact = sequelize.define(
  "Contact",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    favorite: { type: DataTypes.BOOLEAN, defaultValue: false },
    owner: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: "contacts",
    timestamps: true,
  }
);

Contact.belongsTo(User, { foreignKey: "owner" });

export default Contact;