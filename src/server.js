import express from "express";
import morgan from "morgan"; // MiddleWare. Logger.

const PORT = 4000;

const app = express();
const logger = morgan("dev"); // more options like common, combined, etc
app.use(logger);

const globalRouter = express.Router();
const handleHome = (req, res) => res.send("Home");
globalRouter.get("/", handleHome);

const userRouter = express.Router();
const handleEditUser = (req, res) => res.send("Edit User");
userRouter.get("/edit", handleEditUser);

const videoRouter = express.Router();
const handleWatchVideo = (req, res) => res.send("Watch Video")
videoRouter.get("/watch", handleWatchVideo);

app.use("/", globalRouter);
app.use("videos", videoRouter);
app.use("/users", userRouter);

const handleListening = () => console.log(`🚦 Server listening on http://localhost:${PORT} 😃`);

app.listen(PORT, handleListening);