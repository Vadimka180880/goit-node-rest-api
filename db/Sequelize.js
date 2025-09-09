// db/Sequelize.js
import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize({
  dialect: process.env.DATABASE_DIALECT,      
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT) || 5432,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }, 
  },
  logging: false,
});

export default sequelize;
