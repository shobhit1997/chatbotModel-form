const mongoose=require('mongoose');
var randomstring = require("randomstring");
// const jwt = require('jsonwebtoken');
// const _ = require('lodash');
// const bcrypt = require('bcryptjs');
// const config=require('../../server/config/config');
// const moment=require('moment');
var Schema=mongoose.Schema;

var questionSchema = new Schema({
	type : {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	options :[String],
	validation:String,
	required : Boolean
});

var FormSchema = new Schema({
	name : {
		type : String,
		required:true,
		minlength : 1,
		trim : true
	},
	description:{
		type : String,
		trim : true
	},
	questions: [questionSchema],
	responses:[Schema.Types.Mixed],
	shortUrl: {
		type: String,
		unique: true
	},
	creatorUsername:{
		type: String
	}
});

// UserSchema.methods.generateAuthToken=function(){
// 	var user=this;
// 	var access='auth';
// 	var token = jwt.sign({_id:user._id.toHexString(),access},process.env.JWT_SECRET).toString();
// 	user.tokens.push({access,token});
// 	return user.save().then(function(){
// 		return token;
// 	});
// };

// UserSchema.methods.toJSON=function(){
// 	var user=this;
// 	var userObject=user.toObject();
// 	return _.pick(userObject,['_id','name','phone','gender','lastSeen','status','images','profilePhoto','about_me','lives_in','company_name','job_title','age','height','education','gender','body_type','car_model','display_name','display_name_as']);	
// };

// UserSchema.methods.removeToken=function(token){
// 	var user=this;
// 	return user.update({
// 		$pull: {
// 			tokens:{token}
// 		},
// 		firebase_token:''
// 	});
// };

// UserSchema.statics.findByCredentials=function(phone,password){
// var User=this;
// return User.findOne({phone}).select('+password').then(function(user){
// 	if(!user){
// 		return Promise.reject();
// 	}
// 	return new Promise(function(resolve,reject){
// 		bcrypt.compare(password,user.password,function(err,res){
// 			if(res){
// 				resolve(user);
// 			}
// 			else{
// 				reject();
// 			}
// 		});
// 	});
// });
// };

// UserSchema.statics.findByGender=function(gender,liked_disliked){
// var User=this;
// return User.find({gender, _id: { $nin: liked_disliked }}).then(function(users){
// 	if(!users){
// 		return Promise.reject();
// 	}
// 	else{
// 		return Promise.resolve(users);
// 	}
// });
// };

// UserSchema.statics.findByToken = function(token){
// 	var User =this;
// 	var decoded;

// 	try{

// 		decoded= jwt.verify(token,process.env.JWT_SECRET);

// 	}catch(e){

// 		return new Promise(function(resolve,reject){
// 			reject();
// 		});

// 	}
// 	// console.log(decoded);
// 	return User.findOne({
// 		_id : decoded._id,
// 		'tokens.token' : token,
// 		'tokens.access' : 'auth'
// 	});
// };


// // UserSchema.pre('save',function(next){
// // var user = this;
// // if(user.isModified('password'))
// // {
// // 	bcrypt.genSalt(10,function(err,salt){
// // 		bcrypt.hash(user.password,salt,function(err,hash){
// // 			user.password=hash;
// // 			next();
// // 		});
// // 	});
// // }
// // else
// // {
// // 	next();
// // }
// // });



module.exports=mongoose.model('Form',FormSchema);

