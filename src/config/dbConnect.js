const { Sequelize } = require("sequelize");
const database = process.env.DATABASE || "test";
const username = process.env.USER || "test_user";
const password = process.env.PASSWORD || "password";
const dialect = process.env.DIALECT || "postgres";
const host = process.env.HOST || "localhost";
console.log({ database, username, password, host, dialect });

// const sequelize = new Sequelize(process.env.URI);
const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  pool: {
    max: 20,
    min: 5,
    acquire: 60000,
    idle: 10000,
    evict: 15000,
  },
  login: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
// const sequelize = new Sequelize({
//   dialect: "sqlite",
//   storage: "../employee.db",
// });

module.exports = {
  connectDatabase: async () => {
    try {
      sequelize.sync();
      // sequelize.sync({ force: true });
      // await sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  },
  db: sequelize,
};
