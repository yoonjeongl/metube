import express from "express";
import morgan from "morgan"; // MiddleWare. Logger.

const PORT = 4000;

const app = express();
const logger = morgan("dev"); // more options like common, combined, etc

const handleHome = (req,resp) => {
    return resp.send("<H1>This is home</H1>");
};

const handleLogin = (req, resp) => {
    return resp.send("<H1>Please enter your ID/PW</H1>")
}

app.use(logger);
app.get("/", handleHome);
app.get("/login", handleLogin);

const handleListening = () => console.log(`🚦 Server listening on http://localhost:${PORT} 😃`);

app.listen(PORT, handleListening);