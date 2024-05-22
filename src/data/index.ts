import { exit } from "node:process";
import db from "../config/db";

const clearDB = async () => {
  try {
    await db.sync({ force: true });
    console.log("Database cleared successfully");
    exit(0);
  } catch (error) {
    console.error(`Error clearing the database: ${error}`);
    exit(1);
  }
};

// argv[2] is the first argument passed to the script
if (process.argv[2] === "--clear") {
  clearDB();
}
