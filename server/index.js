const express = require("express");
const cors = require("cors");
const path = require("path");
const { connecttomongoose } = require("./connect");
const { constants } = require("../CommonPart/constant");
const userCreateRoute = require("./Route/userCreateRoute");
const bedRoutes = require("./Route/bedRoutes/bedRoutes");
const seedRooms = require("./Route/seedRooms.js/seedRooms");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json())

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "SSR"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", userCreateRoute);
app.use("/api/admin", bedRoutes);

app.get("/", (req, res) => res.render("fileUpload"));

async function startServer() {
  try {
    await connecttomongoose();
    await seedRooms();
    app.listen(constants.PORT, () =>
      console.log(`server connected ${constants.PORT}`),
    );
  } catch (error) {
    console.error("Failed to connect to MongoDB or initialize rooms:", error);
    process.exitCode = 1;
  }
}

startServer();