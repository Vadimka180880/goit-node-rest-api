import { Sequelize } from "sequelize";
import path from "path";

const storage = path.resolve("data.sqlite");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage,
  logging: false,
});

export default sequelize;
