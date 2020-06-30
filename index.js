const express = require('express')
const app = express()
const routes = require('./routes')
const methodOverRide = require('method-override')
const connection = require('./database/database')
const session = require('express-session')
const User = require('./models/user')
const Category = require('./models/Category')
const Article = require('./models/Article')



//database
connection
    .authenticate()
    .then(()=>{
        console.log('Conexão feita com sucesso')
    }).catch((err)=>{
        console.log(err)
    })

//session

//Redis

app.use(session({
        secret:'tuytgdusguit',
        cookie:{maxAge:3000000}
}))

app.set('view engine','ejs')

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(methodOverRide('_method'))
app.use(routes)

    



app.listen(3333,()=>{
    console.log("Server started")
})