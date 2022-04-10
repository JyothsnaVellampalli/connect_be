const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId : {
        type : String,
        required : true
    },
    postId :{
        type : String,
        required : true
    },
    description :{
        type : String,
        max : 300
    },
    image :{
        type : String,
        default:''
    },
    likes:{
        type : Array,
        default :[]
    },
    comments:{
        type: Array,
        default :[]
    },
    thumsup:{
        type: Array,
        default :[]
    },
    createdAt :{
        type : Date,
        required :true
    }
},
    {timeStamps : true}
);

module.exports = mongoose.model('Post',PostSchema);

