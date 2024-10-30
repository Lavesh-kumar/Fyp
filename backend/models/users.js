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
    ,verify:{

        type:String,
        
    }
    
    
    

},{timestamps:true});//here we create the schema 



const users=mongoose.model("user",userschema);//hew2re a collection create in mongodb by model.the function of mongoose
module.exports=users;