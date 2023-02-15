
//const User=require('../../models/user')
import User from '../../models/user.js'

import bcrypt from 'bcrypt'
import passport from 'passport'

function authController(){

    const _getRedirectUrl=(req)=>{
       // return req.user.role==='admin'? '/admin/orders':'/customer/orders'
       return '/'
    }
    //Facotry function

    return{
        login(req,resp){
            resp.render('auth/login') 
        },
        postLogin(req,resp,next){

          passport.authenticate('local',(err,user,info)=>{

            if(err){
                req.flash('error',info.message)
                return next(err)
            }
            if(!user){
                req.flash('error',info.message)
                return resp.redirect('/login')
            }
           

            let cart =req.session.cart

            req.logIn(user,(err)=>{
                if(err){
                    req.flash('error',info.message)
                    return next(err)   
                }
             
                if(!cart)               
                return resp.redirect(_getRedirectUrl(req))
                else{
                    req.session.cart=cart
                    return resp.redirect('/cart')
                }
            })
            
          })(req,resp,next)  
            
        },
        register(req,resp){
            resp.render('auth/register') 
        },
        async postRegister(req,resp){
            const {name,email,password} = req.body 
            //validate  request
            if(!name ||!email ||!password){
                req.flash('error','All fields are require')
                req.flash('email',email)
                req.flash('name',name)
                return resp.redirect('/register')
            }
            //check if email exist
            User.exists({email:email}, (err,result)=>{
                if(result){
                    req.flash('error','User already register')
                    req.flash('name',name)
                    req.flash('email',email)
                    return resp.redirect('/register')
                }
               
            })

            //Hash password
            const hashPass=await bcrypt.hash(password,10)
            //create user
            const user=new User({name:name,email:email,password:hashPass})
            user.save().then((user)=>{
                //Login 

                //Redirect
                return resp.redirect('/')

            }).catch(err=>{
                req.flash('error','Something went wrong')
               // return resp.redirect('/register')
            })
        
        },
        logout(req,res){
            //console.log(req)
            req.logout(()=>{

            });
            return res.redirect('/login')

        }
    }
}

module.exports=authController;