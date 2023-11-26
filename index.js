const express = require("express");
const app = express();
const port = 4000 | process.env.PORT;
const expressHbs = require("express-handlebars");
const { createPagination } = require('express-handlebars-paginate')

app.use(express.static(__dirname + "/html"));
app.engine(
  // set engine
  "hbs",
  expressHbs.engine({
    // handlebars engine
    layoutsDir: __dirname + "/views/layouts", // layout folder
    partialsDir: __dirname + "/views/partials", // partials folder
    defaultLayout: "layout", // default layout
    extname: "hbs", // extension name
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
    helpers: {
      showDate: (date) => {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
      createPagination
    },
  })
);
app.set("view engine", "hbs"); // set view engine

app.get("/", (req, res) => {
  res.redirect("/blogs");
});
app.get("/", (req, res) => {
  res.redirect("./routes/blogRouter");
});
app.use("/blogs", require("./routes/blogRouter"));
app.get("/createTables", (req, res) => {
  let models = require("./models");
  models.sequelize.sync().then(() => {
    res.send("tables created");
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
