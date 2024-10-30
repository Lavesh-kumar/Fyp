const express=require("express");
const Router=express.Router();
const users=require('../../models/users')
const adminuser=require('../../models/adminlogin')
const {check,validationResult, cookie}=require('express-validator')
const campaign=require('../../models/chamaign')
const bcrypt=require("bcrypt")
const jwt=require('jsonwebtoken');
const multer=require('multer')
const transections=require('../../models/transection');
const Notification=require('../../models/notification');

require('dotenv').config();

//register validator
const uservalidations=[
    check('registerData.firstname').isLength({min:5}).withMessage("name should be 5 characters"),
    check('registerData.lastname').isLength({min:5}).withMessage("last name should atleast 5 characters"),
    check('registerData.email').isEmail().withMessage("please enter valid email address"),
    check('registerData.cnic').isLength({min:13}).withMessage("Please enter valid cnic number"),
    check('registerData.password').isLength({min:10}).withMessage("password must contain 10 characters")

];    

const loginvalidations=[

   check('logindata.email').isEmail().normalizeEmail().trim().withMessage("pleas enter valid email address"),
   check('logindata.password').isLength({min:5}).withMessage("password must contain 10 characters"),
  
]

const adminvalidations=[

   check('logindata.email').isEmail().normalizeEmail().trim().withMessage("pleas enter valid email address"),
   check('logindata.password').isLength({min:5}).withMessage("password must contain 10 characters"),
  
]

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
     cb(null, 'uploads/');
   },
   filename: (req, file, cb) => {
     cb(null, `${Date.now()}_${file.originalname}`);
   }
 });
 
 const upload = multer({ storage: storage });



Router.post('/register',uservalidations,async(req,res)=>{






const firstname =req.body.registerData.firstname;
const lastname =req.body.registerData.lastname;
const email =req.body.registerData.email;
const password =req.body.registerData.password;
const cnic=req.body.registerData.cnic

//express validations

const errors = validationResult(req);


if(!errors.isEmpty()){
    res.status(400).send({"errors":errors.array()})
   console.log(errors)

}
 else{
 
 try{
 
 const emailcheck= await users.findOne({email:email})
 const cniccheck= await users.findOne({cnic:cnic})

 if(emailcheck==null && cniccheck==null){
 //send data to database if email does not exist
 const salt =await bcrypt.genSalt(10);
 const hashedpassword=await bcrypt.hash(password,salt);
 
const userdata=await users.create({
firstname:firstname,
lastname:lastname,
email:email,
cnic:cnic,
password:hashedpassword

})


console.log("user"+userdata)

const token=jwt.sign({id:users._id,name:users.name},process.env.JWT_KEY,{expiresIn:'7d'});




res.status(201).send({"msg":"user created successfully",token})

}else{
    //if email exist then again render the resister wit error message
    
   if(emailcheck != null){
res.status(401).send({errors:[{dublicateemail:`${email}email alredy exists`}]})    
   }
   
   else if(cniccheck != null){
    res.status(401).send({errors:[{dublicatecnic:`${cnic} email alredy exists`}]})    
 
       }
    
}
 
 }catch(err){
    console.log(err)
    res.status(500).send({errors:[{msg:"Internal server error"}]}) 

 
 }
 
 }//else
 




}) //end

Router.post("/login",loginvalidations,async(req,res)=>{

const errors=validationResult(req);

if (errors.isEmpty()){


   
try{
   const email =req.body.logindata.email;
   const password =req.body.logindata.password;

   const user= await users.findOne({email});
   console.log(user)
   
   if(user != null){

 // DECODE PASSWORD AND COMPARE PASSWORD
const passwordcomapre=await bcrypt.compare(password,user.password);

if(passwordcomapre){
   const token=jwt.sign({id:user._id,name:user.name},process.env.JWT_KEY,{expiresIn:'7d'});

res.status(201).json({token})


}else{


   res.status(401).json({errors:[{"wrongpassword":"wrong passworsd"}]})
}


}else{
   
   res.status(401).json({errors:[{"emailnotexist":"email does not exist"}]})
   
   }



}
catch(err) {
   res.status(500).send({errors:[{msg:"Internal server error"}]})   
   console.log(err);
   


}


}
else{

res.status(400).json({"errors":errors.array()})


}



})





Router.post('/createcampaign',upload.fields([
   { name: 'cnicDoc', maxCount: 1 },
   { name: 'profileDoc', maxCount: 1 },
   { name: 'B_formDoc', maxCount: 1 },
   { name: 'E_billDoc', maxCount: 1 },
   { name: 'profilephoto', maxCount: 1 }
 ]),async(req,res)=>{
console.log('Form Fields:');

// code here to store the data to databases


  const formData=req.body;
  const files=req.files;




const campaignData = {
   userId: formData.userId,
   Campaigntitle: formData.Campaigntitle,
   Campaignamount: formData.Campaignamount,
   Campaigncategory: formData.Campaigncategory,
   Campaignduration: formData.Campaignduration,
   Campaigndescription: formData.Campaigndescription,
   firstname: formData.firstname,
   lastname: formData.lastname,
   emailaddress: formData.emailaddress,
   phonenumber: formData.phonenumber,
   cnic: formData.cnic,
   address: formData.address,
   city: formData.city,
   provience: formData.provience,
   postalcode: formData.postalcode,
   country: formData.country,

   userfiles: {
     cnicDoc: files.cnicDoc ? files.cnicDoc[0].path : '',
     profileDoc: files.profileDoc ? files.profileDoc[0].path : '',
     B_formDoc: files.B_formDoc ? files.B_formDoc[0].path : '',
     E_billDoc: files.E_billDoc ? files.E_billDoc[0].path : ''
   },
   banner: files.profilephoto ? files.profilephoto[0].path : ''
 };

try{

   const lauch_campaign=await campaign.create(campaignData);


   if(lauch_campaign){

      console.log("campaign launched successufully",lauch_campaign);
   
      
     const notificationData={
    user_id:formData.userId,
         message:`Congrates! Campiagn created named as ${formData.Campaigntitle}`,
         type:'success'
         
      }


      const Sendnotification=await Notification.create(notificationData);

      res.status(200).json("Campaign Created Successfully")

console.log("Sent notification",Sendnotification);
   }
   
}catch(error){

   res.status(400).json("Campaign Creation Failed",error)

}

})


Router.get('/users',async(req,res)=>{

   try{
const id=req.query.userid;

console.log("iddd",id);
const loggeduser=await users.findOne({_id:id});
if(loggeduser){
   res.json(loggeduser)
   console.log(loggeduser)
   
}
else{
   res.status(404).json({"message":"user not exist"})
}


}catch(error){
   res.status(500).json({"message":"Internal server error"})
}
})





Router.get('/campaigns',async(req,res)=>{

   try{
const id=req.query.userid;

const mycampaigns=await campaign.find({userId:id});


if(mycampaigns && mycampaigns.length>0){
   res.status(200).json(mycampaigns)
   console.log(mycampaigns)
   
}
else{
   res.status(404).json({"message":"user not exist"})
}


}catch(error){
   res.status(500).json({"message":"Internal server error"})

   }

})







Router.get('/medical',async(req,res)=>{
   try{
const medicalcampaigns=await campaign.find({Campaigncategory:'medical',Approved:true});
if(medicalcampaigns && medicalcampaigns.length>0){
   res.status(200).json(medicalcampaigns)
   console.log(medicalcampaigns)
}
else{
   res.status(404).json({"message":"Campaign not exist"})
}
}catch(error){
   res.status(500).json({"message":"Internal server error"})  
}
})




Router.get('/educational',async(req,res)=>{
   try{
const educationalcampaigns=await campaign.find({Campaigncategory:'educational',Approved:true});
if(educationalcampaigns && educationalcampaigns.length>0){
   res.status(200).json(educationalcampaigns)
   console.log(educationalcampaigns)
}
else{
   res.status(404).json({"message":"Campaign not exist"})
}
}catch(error){
   res.status(500).json({"message":"Internal server error"})  
}
})





Router.get('/emergency',async(req,res)=>{
   try{
const emergencycampaigns=await campaign.find({Campaigncategory:'emergency',Approved:true});
if(emergencycampaigns && emergencycampaigns.length>0){
   res.status(200).json(emergencycampaigns)
   console.log(emergencycampaigns)
}
else{
   res.status(404).json({"message":"Campaign not exist"})
}
}catch(error){
   res.status(500).json({"message":"Internal server error"})  
}
})





Router.get('/publiccampagin/:id',async(req,res)=>{


const id =req.params.id;
console.log("campaign id ",id);

try{
const campaigndetails=await campaign.findOne({_id:id})
console.log("campaignid",campaigndetails)
res.status(200).json(campaigndetails)
}catch(err){

   res.status(400).json("Campaign not found, Campaign does not Exist now ")
}
})













//this is just fake payment So you need to replace once you use real time payment gateway like googlepay or apple pay 
Router.post('/transection',async(req,res)=>{
const {userid,campaignid,name,DonationAmount}=req.body;

const campaigntransection={
userid:userid,
campaignid:campaignid,
donarname:name,
amount:DonationAmount
}

const transection_success=await transections.create(campaigntransection);

res.status(200).json(transection_success)
console.log(transection_success);

})

Router.get('/transection/:campaignid/campaign',async(req,res)=>{

const campaignid=req.params.campaignid;


try{
   const transectionhostory= await transections.find({campaignid:campaignid});
   res.status(200).json(transectionhostory);
   
}catch(error){
   res.status(401).json("error fetching transections");
   

}


}
)






















Router.get('/Admincampaigns',async(req,res)=>{


   try{
   const unapprovedcampaigns=await campaign.find({Approved: false,Rejectionmessage:null})
   console.log("campaignunapproved",unapprovedcampaigns)
   res.status(200).json(unapprovedcampaigns)
   
   
   }catch(err){
   
   }
   })









   Router.post("/adminlogin",adminvalidations,async(req,res)=>{
console.log("admin-login here")

const errors=validationResult(req);
      
      if (errors.isEmpty()){
      
      
         
      try{
         const email =req.body.logindata.email;
         const password =req.body.logindata.password;
      
console.log(email)
console.log(password)

         const user= await adminuser.findOne({email});
         console.log('user',user)
         
         if(user != null){
      
       // DECODE PASSWORD AND COMPARE PASSWORD
      
      
      if(String(password) === String(user.password)){

         const token=jwt.sign({id:user._id,name:user.name},process.env.JWT_KEY,{expiresIn:'7d'});
         res.status(201).json({token})
      
      console.log(token);
      }else{
      
      
         res.status(401).json({errors:[{"wrongpassword":"wrong passworsd"}]})
      
         
      
      }
      
      
      }else{
         
         res.status(401).json({errors:[{"emailnotexist":"email does not exist"}]})
         
         }
      
      
      
      }
      catch(err) {
         res.status(500).send({errors:[{msg:"Internal server error"}]})   
         console.log(err);
         
      
      
      }
      
      
      }
      else{
      
      res.status(400).json({"errors":errors.array()})
      
      
      }
      
      
      
      })
      





Router.post('/approvereject',async(req,res)=>{

const reject=req.body.rejectionmessage;
const approve=req.body.approve;
const id=req.body.camp_id;

if(id){
   console.log('camp_id ',id)
}


if(reject){

   campaign.updateOne({ _id: id }, { $set: { Rejectionmessage: reject } })
   .then(() =>{
      console.log('Document updated') 
      res.status(200).json('Rejected');
   } 
 )
   .catch(err => console.error(err));
 
}
if(approve){
   campaign.findByIdAndUpdate(id ,{ $set: { Approved: true } })
   .then(() =>{
      console.log('Document updated') 
      res.status(200).json('Campaign Approved');
   } 
 ).catch(err => console.error(err));
   

}



})
   



//notification Routes


Router.get('/notification',async(req,res)=>{

   const userid=req.query.userid;
   console.log("notification of user",userid);
   
   
   try{
      const GetNotifications= await Notification.find({"user_id":userid});
      if (GetNotifications.length>0){

         res.status(200).json(GetNotifications);
      
      }
      else
      {
         res.status(200).json("Notification Does not Exist!");
      }
      
   }catch(error){
      res.status(401).json("error fetching transections");
      
   }
   
   
   }
   )
   
   
   
   
   
   Router.put('/notification/:id/mark-as-read', async (req, res) => {
      const notificationId = req.params.id; // Get the notification ID from the URL params
      console.log("Specific notification id for mark-as-read:", notificationId);
      
      try {
          // Update the notification to mark it as read by its ID
          const markRead = await Notification.findByIdAndUpdate(
              notificationId, // Use the notification ID
              { is_read: true }, // Set is_read to true
              { new: true } // Return the updated document
          );

  
          // Check if the notification was found and updated
          if (!markRead) {
              return res.status(404).json("Notification not found");
          }

          
          res.status(200).json("Notification has been marked as read");
      } catch (error) {
          console.error(error); // Log the error for debugging
          res.status(500).json("Operation failed for mark-as-read");
      }
  });
      




// Chat App Api









module.exports=Router;