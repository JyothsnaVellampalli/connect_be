const router = require('express').Router();
const User = require('../models/User');
const {MongoClient,dburl,mongodb} = require('../dbSchema');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');


router.get('/', (req, res) => {
    res.send('This is auth Route')
})

//register
router.post("/register", async (req, res) => {
    const client= await MongoClient.connect(dburl);
    const db = await client.db('social');

    try{
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.password,salt);
        // console.log(req.body,'register');
    //token
    const createtoken = await JWT.sign({email : req.body.email},'secret',{expiresIn:'10m'})
    // console.log(createtoken,'token');

    const user = await new User({
        username : req.body.username,
        email : req.body.email,
        password : hashedpassword,
        // profilePicture : req.body.profilePicture,
        // coverPicture : req.body.coverPicture,
        token : createtoken,

        createdAt : new Date()
        
    });
        
    const data = await db.collection('users').insertOne(user);

    res.json({ 
        status : 200,
        message : 'inserted'
    })
    }catch(err){
        res.json({
            status : 500,
            message : 'Internal Server Error'
        })
    }
});

//login
router.post('/login',async (req, res) => {

    const client= await MongoClient.connect(dburl);
    const db = await client.db('social');
    const user = await db.collection('users').findOne({email:req.body.email});
    console.log(user);
    try{
    if (user){
        const validpassword = await bcrypt.compare(req.body.password, user.password);
        if(validpassword){
            res.json({
                status : 200,
                message : 'login Successfully',
                data : user
            })
        }
        else{
            res.json({
                status : 400,
                message : 'Invalid Password'
            })
        }
    }   else {res.json({
        status : 404,
        message : 'Invalid User',
        
    })
    }

    }catch(err){
        res.json({
            status : 500,
            message : 'Internal Server Error'
        })
    }
});

module.exports = router;