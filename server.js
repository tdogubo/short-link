const { createServer } = require("http");
const app = require("./src/app");
const { sequelize } = require("./src/models/short-link.model");

const server = createServer(app);

init();

async function init() {
  const PORT = 3001;
  try {
    await sequelize.authenticate();
    await sequelize.sync({force:true});
    server.listen(PORT, () => {
      console.log(`Server is on port ${PORT}`);
    });
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}
