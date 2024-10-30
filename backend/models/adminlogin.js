const mongoose=require('mongoose');
//now we defie schemas in mongo db
const userschema=mongoose.Schema({
 
    firstname:{
        type:String,
    },

    lastname:{
        type:String,
    },

    email:{
        type:String,
        
    },
    cnic:{

        type:Number,
        
    },
    password:{

        type:String,
        
    }
    
    
    
    

});//here we create the schema 


const adminlogin=mongoose.model("adminlogin",userschema);//hew2re a collection create in mongodb by model.the function of mongoose

module.exports=adminlogin;