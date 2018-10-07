const express=require('express');
var router=express.Router();
var Form=require('../models/form');
var authenticate=require('../middleware/authenticate');
const randomstring = require("randomstring");

router.route('/createForm').
post(authenticate,async function(req,res){
	var form=new Form(req.body);
	form.shortUrl=randomstring.generate(3);
	var form1 = await form.save();
	if(form1){
		res.send(form1);
	}
	else{
		res.status(400).send();
	}

});

router.route('/:id').
get(authenticate,async function(req,res){
	var shortUrl=req.params.id;
	console.log(shortUrl);
	try{
		var form=await Form.find({shortUrl:shortUrl});
		if(form){
			res.send(form);
		}
		else{
			res.status(404).send({message:"NOT FOUND"});
		}
	}
	catch(e){
		res.status(400).send({message:"BAD REQUEST"});
	}

});

module.exports=router;