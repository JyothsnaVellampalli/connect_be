const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    username:{
        type : String,
        require : true,
        min :3,
        max:20,
        unique : true
    },
    email: {
        type : String,
        require : true,
        max : 50,
        unique : true
    },
    password: {
        type : String,
        require : true,
        min : 5,
    },
    token:{
        type : String,
        require : true,
    },
    profilePicture:{
        type : String,
        default :""
    },
    coverPicture :{
        type : String,
        default :""
    },
    followers:{
        type : Array,
        default : []
    },
    followings:{
        type : Array,
        default : []  
    },
    
    description:{
        type : String,
        max : 100,
    },
    city:{
        type : String,
        max : 40,
    },
    form:{
        type : String,
        max :50
    },
    relationship:{
        type : Number,
        enum : [1,2, 3]
    },
    isAdmin :{
        type : Boolean,
        default : false
    },
    createdAt :{
        type : Date,
        required : true
    },
    updatedAt :{
        type : Date,
    }

},
{timeStamps : true}
);

module.exports = mongoose.model('User',UserSchema);