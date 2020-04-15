const express=require('express');
var router=express.Router();
var Form=require('../models/form');
var {authenticate,authenticate2}=require('../middleware/authenticate');
const randomstring = require("randomstring");
var {parse} = require('json2csv');
var _ = require('lodash');
var fs= require('fs');

router.route('/createForm').
post(authenticate2,async function(req,res){
	var form=new Form(req.body);
	form.shortUrl=randomstring.generate(3);
	form.creatorUsername=req.user.name;
	form.creatorId=req.user._id;
	var form1 = await form.save();
	if(form1){
		res.send(form1);
	}
	else{
		res.status(400).send();
	}

});
router.route('/myforms').
get(authenticate2, async function(req,res){
	console.log(req.user);
	try{
		var forms=await Form.find({creatorId:req.user._id});
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
			res.send(_.pick(form,['_id','name','description','questions','creatorUsername','shortUrl']));
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
get(authenticate2, async function(req,res){
	var shortUrl=req.params.id;
	try{
		var form=await Form.findOne({shortUrl:shortUrl,creatorId:req.user._id});
		if(form){
			var fields =Object.keys(form.responses[0])
                  	var csv = parse(form.responses,{ fields: fields });
                  	var path='./'+Date.now()+'.csv'; 
                   	fs.writeFile(path, csv, function(err,data) {
                    		if (err) {
					console.log(err)
					throw err;
				}
                    		else{ 
                      			res.download(path); // This is what you need
                    		}
                	}); 
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
