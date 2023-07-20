const express = require("express")
const {engine} = require("express-handlebars")
const myconnection = require("express-myconnection")
const bodyParser = require("body-parser")
const mysql = require("mysql")
const app = express()
const productsRoutes = require('./routes/products');
const ticketsRoutes = require('./routes/tickets')


app.set("port", 5000)
app.listen(app.get("port"), ()=>{
    console.log("Listening in port", app.get("port"))
})

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('/', express.static('src'))

app.use(bodyParser.json());

app.set("views", __dirname + "/views")

app.engine(".hbs", engine({
    extname: '.hbs'
}))

app.set("view engine", "hbs")

app.use(myconnection(mysql, {
    connectionLimit: 100,
    host: 'db4free.net',
    user: 'user6to',
    password: '12345678',
    port: 3306,
    database: 'app6to'
}))

app.get("/", (req, res)=>{
    res.render('inicio')
})

app.use('/', productsRoutes)
app.use('/', ticketsRoutes)

console.clear()
