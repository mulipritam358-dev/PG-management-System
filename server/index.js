const express = require("express");
const path = require("path");
const { connecttomongoose } = require("./connect");
const { constants } = require("../CommonPart/constant");
const userCreateRoute = require("./Route/userCreateRoute");

const app = express();

connecttomongoose();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "SSR"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", userCreateRoute);

app.get('/', (req, res) => res.render("fileUpload"));

app.listen(constants.PORT, () => console.log(`server connected ${constants.PORT}`));