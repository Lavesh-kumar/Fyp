const mongoose=require('mongoose');
const Schema = mongoose.Schema;

//now we defie schemas in mongo db
const transectionschema=mongoose.Schema({

    userid: {
      type:Schema.Types.ObjectId,
        ref: 'user',
        required: true
      },
      
    campaignid: {
        type: Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true
      },

    donarname:{
        type:String,
    },

    amount:{
        type:Number,
    }, 

    transactionDate: {
        type: Date,
        default: Date.now // Sets the date to the current date by default
      }

},{timestamps:true});//here we create the schema 



const transections=mongoose.model("transection",transectionschema);//hew2re a collection create in mongodb by model.the function of mongoose
module.exports=transections;