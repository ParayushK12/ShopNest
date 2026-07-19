import jwt from 'jsonwebtoken'
import User from '../model/User.js'

const protect = async(req,res,next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select('-password')
            next();
        } catch (error) {
            return res.status(401).json({message: 'Your session is invalid or has expired. Please sign in again.'})
        }
    }
    if(!token){
        return res.status(401).json({message: 'Please sign in to continue.'})
    }
}

export default protect;
