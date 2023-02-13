const Menu=require('../../models/menu')
function homeController(){
    //Facotry function
    return{
        async index(req,resp){
            const pizzas=await Menu.find()
            return  resp.render('home',{pizzas:pizzas})  
        }
    }
}

module.exports=homeController;