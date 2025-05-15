import jwt  from "jsonwebtoken";
import env from "dotenv";

env.config();

const verifyToken = (req, res, next) =>{

   const token = req.cookies.accessToken;
    
    if(!token){
        return res.status(401).json({message: "Token mungon!"});
    }

    jwt.verify(token, process.env.SECRET_TOKEN, (err, user) =>{

        if(err) {
            return res.status(403).json({message: "Token i pavlefshëm"});
        }
        req.user = user;
        next();
    })
}

const verifyRefreshToken = (req, res, next) =>{

    const token = req.cookies.refreshToken;

    if(!token){
        return res.status(401).json({message: 'Refresh token mungon'});
    }

    jwt.verify(token, process.env.REFRESH_TOKEN, (err, user) =>{

        if(err){
            return res.status(403).json({message: 'Refresh token i pavlefshëm'})
        }

        req.user = user;
        next();
    })
}

const eshteAdmin = (req, res, next) =>{

    if(req.user.role !== 'admin' &&  req.user.role !== 'superadmin'){
        return res.status(403).json({message: "Nuk keni autorizim si admin!"})
    }
    next();
}

const eshteSuperAdmin = (req, res, next) =>{

    if(req.user.role !== 'superadmin' ){
        return res.status(403).json({message: "Vetem superadmini ka akses!"})
    }
    next();
}

export default {verifyToken, verifyRefreshToken, eshteAdmin, eshteSuperAdmin};