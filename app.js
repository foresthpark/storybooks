const express = require("express");
const app = express();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// load config
require("dotenv").config({ path: "./config/config.env" });

// Passport config
require("./config/passport")(passport);

connectDB();

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const {
  formatDate,
  truncate,
  stripTags,
  editIcon,
  select,
} = require("./helpers/hbs.js");

// Load handlebars
app.engine(
  ".hbs",
  exphbs({
    helpers: {
      formatDate,
      truncate,
      stripTags,
      editIcon,
      select,
    },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// Express-session middleware
app.use(
  session({
    secret: "asecrettext",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global Variable
app.use(function (req, res, next) {
  res.locals.user = req.user || null;

  next();
});

// Statis folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/index"));
app.use("/stories", require("./routes/stories"));
app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT, () =>
  console.log(
    `Server Running on http://localhost:${PORT} in ${process.env.NODE_ENV}`
  )
);
