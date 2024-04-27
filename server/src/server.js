import express from "express";
import env from "dotenv";
import cors from "cors";
import routes from "./routes/index.js";

env.config();

const app = express();

app.use(cors());
app.use(routes);

app.listen(process.env.SERVER_PORT, () => {
    console.log("Server is now running!");
});