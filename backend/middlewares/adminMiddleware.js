const admin = async(req,res,next) => {
    if(req.user && req.user.role === 'admin') next();
    else return res.status(403).json({message: 'Administrator access is required.'})
}
export default admin;
