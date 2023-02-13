function geust(req,res,next){
       if(!req.isAuthenticated()){
        return  next()
       }
       return res.redirect('/')
}

export default  geust