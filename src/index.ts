import server from "./server";
import colors from "colors";

const PORT = process.env.PORT || 3000; // Set the port to the environment variable PORT or 3000 if the environment variable is not set.

server.listen(PORT, () => {
  console.log(colors.bgGreen.white(`Server is running on port ${PORT}`));
});
