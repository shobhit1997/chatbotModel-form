const express=require('express');
var router=express.Router();
var Form=require('../models/form');
var authenticate=require('../middleware/authenticate');
const randomstring = require("randomstring");
var json2xls = require('json2xls');
var _ = require('lodash');

router.route('/createForm').
post(authenticate,async function(req,res){
	var form=new Form(req.body);
	form.shortUrl=randomstring.generate(3);
	form.creatorUsername=req.username;
	var form1 = await form.save();
	if(form1){
		res.send(form1);
	}
	else{
		res.status(400).send();
	}

});
router.route('/myforms').
get(authenticate, async function(req,res){
	try{
		var forms=await Form.find({creatorUsername:req.username});
		if(forms){
			var obj=forms.map((form)=>{
				var body={
					name:form.name,
					responses:form.responses.length,
					shortUrl:form.shortUrl
				};
				return body;
			});
			res.send(obj);
		}
		else{
			res.status(404).send({message:"NOT FOUND"});
		}
	}
	catch(e){
		res.status(400).send({message:"BAD REQUEST\n"+e});
	}

});
router.route('/:id').
get(async function(req,res){
	var shortUrl=req.params.id;
	console.log(shortUrl);
	try{
		var form=await Form.findOne({shortUrl:shortUrl});
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
router.route('/submit').
post(async function(req,res){
	console.log(req.body);
	var form_id=req.body._id;
	try{
		var form=await Form.findById(form_id);
		// console.log(form);
		if(form){
			form.responses.push(req.body.response);
			await form.save();
			res.send({message:"Successful"});
		}
		else{
			res.status(404).send({message:"NOT FOUND"});
		}
	}
	catch(e){
		res.status(400).send({message:"BAD REQUEST"+e});
	}

});

router.route('/getResponse/:id').
get(authenticate, async function(req,res){
	var shortUrl=req.params.id;
	try{
		var form=await Form.findOne({shortUrl:shortUrl,creatorUsername:req.username});
		if(form){
			res.xls('data.xlsx', form.responses);
		}
		else{
			res.status(404).send({message:"NOT FOUND"});
		}
	}
	catch(e){
		res.status(400).send({message:"BAD REQUEST\n"+e});
	}

});

module.exports=router;