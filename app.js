const express=require('express');
const expressLayouts=require('express-ejs-layouts')
const app = express();
const index =require('./index.js');
const user =require('./user.js');
const mysql=require("mysql");
const bodyparser=require("body-parser");
const flash=require('connect-flash');
const session=require('express-session');
app.use(bodyparser.urlencoded({extended:false}));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

  //Connect flash

  app.use(flash());

  //Global Vars

  app.use((req,res,next)=>{
      res.locals.success_msg=req.flash('success_msg');
      res.locals.error_msg=req.flash('error_msg');
      next();
  })

app.use(bodyparser.json());
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use('/',index);
app.use('/users',user);
app.use(express.static(__dirname + '/public'));

const PORT=process.env.PORT||5000


const connection=mysql.createConnection({
    host:"b7xxx0u0g3ypuv8h1vgu-mysql.services.clever-cloud.com",
    database:"b7xxx0u0g3ypuv8h1vgu",
    user:"ulxy37pbb2b7njcu",
    password:"t8JlGQZ3l6CCuUsu8Kam"
})



app.listen(PORT,()=>{
    console.log(`Server started at port ${PORT}`);
})