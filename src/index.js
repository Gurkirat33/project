import dotenv from "dotenv";
import { connectDb } from "./database/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

const PORT = process.env.PORT || 8000;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at Port : ${PORT}`);
    });
  })
  .catch((error) => console.log("MongoDb connection failed", error));
