const jwt = require('jsonwebtoken')
exports.auth = async (req,res,next) =>{
    
    const authHeader = req.header("Authorization")
    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
        
        return res.status(401).send({
            message:'Access is Denied'
        })
    }
    
    try {
        const verified = jwt.verify(token, process.env.TOKEN_KEY)
        console.log('success');
        req.user = verified
        next()
    } catch (error) {
        
    }
}