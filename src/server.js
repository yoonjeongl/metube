import express from "express";

const PORT =4000;

const app = express();

const logger = (req, resp, next) =>{
    console.log(`${req.method} ${req.url}`);
    next();
};

const handleHome = (req,resp) => {
    return resp.end();
};

app.get("/", logger, handleHome);

const handleListening = () => console.log(`🚦 Server listening on http://localhost:${PORT} 😃`);

app.listen(PORT, handleListening);