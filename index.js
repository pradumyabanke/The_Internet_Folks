const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = require("./src/Routes/route");
const Middleware = require("./src/Middleware/auth");

const port = process.env.PORT || 5000;

app.use(cors());

app.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("strictQuery", false);



module.exports = router;

//==================[ Database Connection ]============//

mongoose
    .connect(
        "mongodb+srv://pradumgurjar2:suNkqKHC6Jpgdi7c@cluster0.reyqyak.mongodb.net/"
    )
    .then(() => console.log("Database Is Connected Successfully.."))
    .catch((Err) => console.log(Err));

app.use("/", router);

app.listen(port, function () {
    console.log(`Server is connected on Port ${port} ✅✅✅`);
});

// pass = suNkqKHC6Jpgdi7c
// mongodb+srv://pradumgurjar2:suNkqKHC6Jpgdi7c@cluster0.reyqyak.mongodb.net/