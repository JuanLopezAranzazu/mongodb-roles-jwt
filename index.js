const express = require("express");
const app = express();
require("./mongo");
const { config } = require("./config");
const { logErrors, errorHandler } = require("./middlewares/error");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// initial
const Role = require("./models/Role");

const createRoles = async () => {
  try {
    // Count Documents
    const count = await Role.estimatedDocumentCount();

    // check for existing roles
    if (count > 0) return;

    // Create default Roles
    const values = await Promise.all([
      new Role({ name: "admin" }).save(),
      new Role({ name: "user" }).save(),
    ]);

    console.log(values);
  } catch (error) {
    console.error(error);
  }
};
createRoles();

// routes
const userRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const blogRouter = require("./routes/Blog");
const commentRouter = require("./routes/Comment");

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/blog", blogRouter);
app.use("/comment", commentRouter);

app.use(logErrors);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log("SERVER RUNNING IN PORT", config.port);
});
