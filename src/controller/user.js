const {user,userIsLogin} = require('../../models')

exports.getUser = async (req,res) =>{
    try {

        const authHeader = req.header("Authorization")
        const token = authHeader && authHeader.split(' ')[1]
        const tokenParse = parseJwt(token)

        const userLogin = await userIsLogin.findOne({
            where:{
                iat: tokenParse.iat.toString()
            }
        })

        if(userLogin === null){
            return res.status(400).send({
                status:'failed',
                messages:'User is Not login'
            })
        }

        const userIs = await user.findOne({
            where:{
                id: tokenParse.id
            },
            attributes:{
                exclude:['password','createdAt','updatedAt']
            }
        })

        res.status(200).send({
            status:'success',
            data:{
                user: userIs
            }
        })
        
    } catch (error) {
        console.log(error)
        res.status(400).send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};