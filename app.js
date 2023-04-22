const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Router
const indexRouter = require("./routes/index");
const postsRouter = require("./routes/posts");
const authRouter = require("./routes/auth");
const commentRouter = require("./routes/comment");
const likeRouter = require("./routes/like");

// localhost:3000/ -> indexRouter
app.use("/", [indexRouter, authRouter]);
// localhost:3000/posts -> postsRouter, commentsRouter
app.use("/posts/like", [likeRouter]);
app.use("/posts", [postsRouter, commentRouter]);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`running http://localhost:${port}`);
});
