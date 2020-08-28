import connection from '../database/connection'
import * as jwt from '../setup/jwt'
import Util from '../helpers/Util'
import Mailer from '../helpers/mailer'
import argon2, { hash } from 'argon2' //algoritmo de hash

import AdminController from './AdminController'

import UserModel from '../models/UserModel'

const { handleError, clearString, isAdmin } = new Util()
const mailer = new Mailer()
const user_m = new UserModel()


export default {
    async login(req, res){    
        try{
            //confirmando admin
            const [hashTyp, hash] = req.headers.authorization.split(' ') //Basic Authenticate. Formato: Basic HASH
            const [email, password] = Buffer.from(hash, 'base64').toString().split(':') //Buffer - descriptografa um hash -> separado por :

            if( !isAdmin(email, password) ) return handleError(res, 401, 'Não autorizado!')
        
            const adminToken = jwt.generateToken({admin_id: process.env.ADMIN_ID_PAYLOAD_JWT})

            return res.json({
                name:'Admin',
                mail:process.env.ADMIN_USER,
                token_admin: adminToken,
                isAdmin:true
            });

        }catch(e){
            handleError(res, 400, e)
        }

    },

    


}