import express from "express";
import morgan from "morgan"; // MiddleWare. Logger.
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev"); // more options like common, combined, etc

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
//    cookie: {
//        maxAge: 20000,
//    },
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    })
);

app.use((req,res,next) => {
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    next();  
});
app.use(flash());
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;