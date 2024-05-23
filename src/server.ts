import express from "express";
import router from "./routes";
import db from "./config/db";
import colors from "colors";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
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

// Allow CORS only from the frontend URL
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

server.use(cors(corsOptions));

// Read the body of the request
server.use(express.json());

// Middleware for logging the requests to the console
server.use(morgan("dev"));

// Middleware
server.use("/api/products", router); // Mount the router at the root path of the server. All the requests will be handled by the router.

// Docs
server.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

export default server;
