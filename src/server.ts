import express from "express";
import router from "./routes";
import db from "./config/db";
import colors from "colors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec, { swaggerUiOptions } from "./config/swagger";

// Connect to the DB
export async function connectToDB() {
  try {
    await db.authenticate();
    db.sync();
    // console.log(
    //   colors.bgGreen.white("Connection has been established successfully.")
    // );
  } catch (error) {
    console.error(colors.bgRed.white("Unable to connect to the database:"));
  }
}

connectToDB();

// Create an instance of the express server
const server = express();

// Read the body of the request
server.use(express.json());

// Middleware
server.use("/api/products", router); // Mount the router at the root path of the server. All the requests will be handled by the router.

// Docs
server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

export default server;
