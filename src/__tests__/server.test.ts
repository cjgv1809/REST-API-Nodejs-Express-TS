import request from "supertest";
import server, { connectToDB } from "../server";
import db from "../config/db";

// simulate a database connection error by mocking the authenticate method
jest.mock("../config/db");

describe("should handle database connection error", () => {
  it("should return an error message", async () => {
    jest
      .spyOn(db, "authenticate")
      .mockRejectedValueOnce(new Error("Unable to connect to the database:"));
    const consoleSpy = jest.spyOn(console, "error");

    await connectToDB();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Unable to connect to the database:")
    );
  });
});
