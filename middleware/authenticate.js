const jwt=require('jsonwebtoken');
var authenticate = function(req,res,next){
	// console.log(req.header);
	var xAuth = req.header('x-auth');
	var username=req.header('username');
	var token=req.header('token');
	console.log(xAuth);
	var decoded;
	try{

		decoded= jwt.verify(xAuth,process.env.JWT_SECRET);
		console.log(decoded);
		if(decoded.username==username && decoded.token==token && decoded.key==process.env.KEY){
			req.username=username;
			next();
		}
		else{
			res.status(401).send();
		}

	}catch(e){
		res.status(401).send();
	}
};
module.exports=authenticate;