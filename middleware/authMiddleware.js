import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js"

const checkAuth = async (req,res,next) => {
    let token;
    // console.log('desde el middleware'); 
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        // console.log('Con bearer');
        try {
            token = req.headers.authorization.split(' ')[1]
            console.log(token);
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado");

        //    console.log(veterinario );
            return next()
        } catch (error) {
            const errorr = new Error('Token no Válido e inexistente')
            res.status(403).json({msg: errorr.message})
            next();
        }

    }

    if(!token){
        const error = new Error('Token no Válido e inexistente')
       return res.status(403).json({msg: error.message})
    }
    next();
}

export default checkAuth