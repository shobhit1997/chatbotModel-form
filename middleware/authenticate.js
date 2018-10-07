const jwt=require('jsonwebtoken');
var authenticate = function(req,res,next){
	var xAuth = req.header('x-auth');
	var username=req.header('username');
	var token=req.header('token');
	var decoded;
	try{

		decoded= jwt.verify(xAuth,process.env.JWT_SECRET);
		if(decoded.username==username && decoded.token==token && decoded.key==process.env.KEY){
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