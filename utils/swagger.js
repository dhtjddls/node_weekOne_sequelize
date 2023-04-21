const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "항해 14기 weekOne_Sequelize",
    description: "오성인",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];
swaggerAutogen(outputFile, endpointsFiles, doc);
