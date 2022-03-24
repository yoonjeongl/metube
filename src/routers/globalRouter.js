import express from "express";
import { join, login } from "../controllers/userController";
import { home, getEdit, postEdt, getUpload, postUpload, search } from "../controllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/join", join);
globalRouter.get("/login", login);

export default globalRouter;