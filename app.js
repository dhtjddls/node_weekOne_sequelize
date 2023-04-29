const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");
const errorHandler = require("./middlewares/errorHandler");
require("dotenv").config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Router
const indexRouter = require("./routes/index");
const postsRouter = require("./routes/posts.routes");
const authRouter = require("./routes/auth.routes");
const commentRouter = require("./routes/comment.routes");
const likeRouter = require("./routes/like.routes");

// localhost:3000/ -> indexRouter
app.use("/", [indexRouter, authRouter]);
app.use("/posts/like", [likeRouter]);
// localhost:3000/posts -> postsRouter, commentsRouter
app.use("/posts", [postsRouter, commentRouter]);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`running http://localhost:${port}`);
});

module.exports = app;
