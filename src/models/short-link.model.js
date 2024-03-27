const Sequelize = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./src/models/db.sqlite3",
});

class Url extends Sequelize.Model {}
Url.init(
  {
    id: {
      type: Sequelize.TEXT,
      allowNull: false,
      primaryKey: true,
    },
    originalUrl: {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: true,
    },
    shortUrl: {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: true,
    },
    visited: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    created: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },

  {
    sequelize,
    modelName: "urls",
  }
);

module.exports = {
  sequelize,
  Url,
};
