const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// const DB = "mongodb://localhost:27017/univast"


const connectWithRetry = () => {
  mongoose
    .connect(DB, {
      serverSelectionTimeoutMS: 4000,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`App running on port ${port}`)
      })
    })
    .catch((error) => {
      console.error("DB connection failed:", error);
      console.log("Retrying connection...");
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();