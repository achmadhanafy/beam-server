//import Model
const {user,userIsLogin} = require('../../models')

//import package
const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.login = async (req,res) =>{

    const schema = Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().min(8).required()
    })

    const {error} = schema.validate(req.body)

    if(error){
        return res.send({
            error:{
                message: error.details[0].message
            },
            status:'failed validation'
        })
    }

    try {

        const userIs = await user.findOne({
            where:{
                email:req.body.email
            },

            attributes:{
                exclude:['createdAt','updatedAt'],
            }
        })
        if (userIs === null){
            return res.send({
                status:'failed',
                message:'Email or Password Doesnt Match'
            })
        }
        const userValid = await bcrypt.compare(req.body.password,userIs.password)

        if(!userValid){
            return res.send({
                status:"failed",
                message: "Email or Password doesnt match"
            })
        }

        const dataToken = {
            id: userIs.id,
        }

        const SECRET_KEY = process.env.TOKEN_KEY
        const token = jwt.sign(dataToken, SECRET_KEY)
        const tokenParse = parseJwt(token)

        const isLogin = await userIsLogin.create({
            iat:tokenParse.iat,
            userId:userIs.id
        })


        return res.status(200).send({
            status:'success',
            data:{
                token: token
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




exports.logout = async (req,res) =>{
    console.log('success');
    try {

        const authHeader = req.header("Authorization")
        const token = authHeader && authHeader.split(' ')[1]
        const tokenParse = parseJwt(token)
        console.log(tokenParse.iat);

        await userIsLogin.destroy({
            where:{
                iat: tokenParse.iat.toString()
            }
        })
        
        res.send({
            status:'success',
            message:'Logout success'
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