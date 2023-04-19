const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Router
const indexRouter = require("./routes/index");
const postsRouter = require("./routes/posts");
const authRouter = require("./routes/auth");

// localhost:3000/ -> indexRouter
app.use("/", [indexRouter, authRouter]);
// localhost:3000/posts -> postsRouter, commentsRouter
app.use("/posts", [postsRouter]);

app.listen(port, () => {
  console.log(`running http://localhost:${port}`);
});
