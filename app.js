// const path= require('path');
// const publicPath = path.join(__dirname,'../public');
const express=require('express');
const  app=express();
const bodyParser=require('body-parser');
const formRouter=require('./routes/formRouter');
var cors = require('cors');
const loginRouter=require('./routes/loginRoute');
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
var json2xls = require('json2xls');
// app.use(express.static(publicPath));
app.use(cors());
app.use(function(req,res,next){
	res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Expose-Headers', 'x-auth , token , username');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With,content-type, Accept , x-auth , username , token');
  
	next();
});
//app.use(json2xls.middleware);
app.get('/',(req,res)=>{
res.send("Welcome");
})
app.use('/api/user',loginRouter);
app.use('/api/form',formRouter);
module.exports=app;
