import express from "express";
import morgan from "morgan"; // MiddleWare. Logger.
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const PORT = 4000;

const app = express();
const logger = morgan("dev"); // more options like common, combined, etc
app.use(logger);

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

const handleListening = () => console.log(`🚦 Server listening on http://localhost:${PORT} 😃`);

app.listen(PORT, handleListening);