const express=require('express');
const axios=require('axios');
const router=express.Router();
const randomstring = require("randomstring");
const request = require('request');
const jwt=require('jsonwebtoken');
router.route('/login').
post(async function(req,res){

	 var values = {
      username: `${req.body.username}`,
      password: `${req.body.password}`
    }
    request.post(
      'http://210.212.85.155/api/profiles/login/',
      { json: true,
        body: values },
      function (error, response, body) {
      	if(!error && response.statusCode==200){
      		var token = jwt.sign({username:body.username,group:body.group,token:body.token,key:process.env.KEY},process.env.JWT_SECRET).toString();
      		res.header('x-auth',token).send(body);
      	}
      	else if(!error && response.statusCode==406){
      		res.status(406).send({message:"Incorrect Credentials"});
      	}
      	else{
      		res.status(400).send({message:"Bad Request"});
      	}
      }
    );



});

module.exports=router;