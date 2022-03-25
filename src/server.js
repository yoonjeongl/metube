import express from "express";
import morgan from "morgan"; // MiddleWare. Logger.
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import session from "express-session";

const app = express();
const logger = morgan("dev"); // more options like common, combined, etc

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: "Hello!",
    resave: true,
    saveUninitialized: true,
    })
);

app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;