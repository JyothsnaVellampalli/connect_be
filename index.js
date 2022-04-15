const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth'); 
const postsRoute = require('./routes/posts');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
// const { use } = require('bcrypt/promises');

dotenv.config();

mongoose.connect('mongodb+srv://Jyothsna:Jyothsna123@cluster0.b0dyt.mongodb.net/test', {useNewUrlParser: true}, ()=>{
    console.log('connected to MongoDB');
});

app.use('/images',express.static(path.join(__dirname,'public/images')))

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.get('/', async (req, res) => {
    res.send('Welcome');
});


const storage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, 'public/images');
    },
    filename : (req, file, cb)=>{
        console.log(req.body);
        cb(null, file.originalname);
    },
});

const upload = multer({storage});
app.post('/upload', upload.single("file"), (req,res)=>{
    try{
        res.json({
            status: 200,
            message : 'file uploaded successfully'
        })
        
    }catch(err){
        res.json({
            status: 400,
            message : 'Error'
        })
    }
});

app.use(cors());
app.use('/users', usersRoute);
app.use('/auth', authRoute);
app.use('/posts', postsRoute);




app.listen(process.env.PORT || 4000,()=>{console.log('server is running!');})
