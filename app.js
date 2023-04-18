const express = require("express");
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Router
const indexRouter = require("./routes/index");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const authRouter = require("./routes/auth");

// DB or MODEL
const connect = require("./schemas");
connect();

// localhost:3000/ -> indexRouter
app.use("/", [indexRouter, authRouter]);
// localhost:3000/posts -> postsRouter, commentsRouter
app.use("/posts", [postsRouter, commentsRouter]);

app.listen(port, () => {
  console.log(`running http://localhost:${port}`);
});
