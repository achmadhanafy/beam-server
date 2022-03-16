//Model
const {user} = require('../../models')

//import package
const Joi = require('joi')
const bcrypt = require('bcryptjs')

exports.register = async (req,res) =>{

    const schema = Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().min(8).required(),
        fullName:Joi.string().required(),
    })

    const {error} = schema.validate (req.body)

    if (error) {
        return res.send({
            status:"Bad Request",
            message:error.details[0].message
        })
    }
    
    try {

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        const getEmail = await user.findOne({
            where:{
                email:req.body.email
            }
        })

        if(getEmail) {
            return res.status(400).send({
                status:'failed',
                messages:'Email has used'
            })
        } else {
            const {email,fullName} = req.body
            const newUser = await user.create({
                email,
                password: hashedPassword,
                fullName,
            })

            
            return res.status(200).send({
                status:'success',
                messages:'Register success'
            })

        }

       
    } catch (error) {
        console.log(error)
        res.status(400).send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}