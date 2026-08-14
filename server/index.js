const express = require("express")
const { connecttomongoose } = require("./connect")
const userCreateRoute = require("./Route/userCreateRoute")

const app = express()
const port = 8081

connecttomongoose()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api", userCreateRoute)

app.get('/', (req, res) => res.send('ok'))

app.listen(port, () => console.log(`server connected ${port}`))