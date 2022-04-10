const router = require('express').Router();
const User = require('../models/User');
const {MongoClient,dburl,mongodb} = require('../dbSchema');
const bcrypt = require('bcrypt');


// router.get('/', (req, res) => {
//     res.send('This is user Route')
// })

//update
router.put('/:id', async (req, res) => {
    console.log("yes1");

    if(req.body.userId === req.params.id || req.user.isAdmin) {
        console.log("yes2");

        try{
            const client= await MongoClient.connect(dburl);
            const db = await client.db('social');
            
            if(req.body.password){
                console.log("yessss");
                const salt = await bcrypt.genSalt(10);
                console.log(req.body.password);
                req.body.password = await bcrypt.hash(req.body.password,salt);
                console.log(req.body.password);
            }

            const finduser = await db.collection('users').findOne({token : req.body.userId});

            if(finduser){

            req.body.updatedAt = new Date();
            const {userId,...other} = req.body;
            const user = await db.collection('users').updateOne({token: req.params.id},{$set : other});
            console.log(user);
            res.json({
                status:200,
                message:" update success"
            });
            } else {
                res.json({
                    status:404,
                    message : "Invalid id"
                })
            }
        }catch(err) {
            res.json({
                status:500,
                message:" update error"
            })
        }

    }else{
        res.json({
            status: 403,
            message : 'You can update only your account'
        })
    }
})

router.delete('/:id',async (req, res)=>{

    if(req.body.userId === req.params.id || req.user.isAdmin) {
        
        try{
            const client= await MongoClient.connect(dburl);
            const db = await client.db('social');
            const user = await db.collection('users').deleteOne({token: req.params.id});
        
            res.json({
                status:200,
                message:"Delete success"
            });

        }catch(err) {
            res.json({
                status:500,
                message:"Delete error"
            })
        }

    } else {
        res.json({
            status: 403,
            message : 'You can delete only your account'
        })
    }
})

//get user
router.get('/', async function (req, res) {
    const userId = req.query.id;
    const username = req.query.username;
    try{
        const client= await MongoClient.connect(dburl);
        const db = await client.db('social');
        let user;
        if(userId){
        user = await db.collection('users').findOne({token: userId});
        }
        else if(username){
            console.log({username})
        user = await db.collection('users').findOne({username: username});   
        }

        if(user){
            const {password,...other} = user
            res.json({
                status : 200,
                message : "success",
                data : other
            })
        } else {
            res.json({
                status : 404,
                message : "invalid details"
            })
        }
    }catch(err){
        res.json({
            status : 500,
            message : "Internal Server Error"
        })
    }
})

//follow user 
router.put('/:id/follow', async (req, res) => {
    if(req.body.userId!==req.params.id){
        const client= await MongoClient.connect(dburl);
        const db = await client.db('social');
        const user = await db.collection('users').findOne({token : req.params.id});
        const currentUser = await db.collection('users').findOne({token : req.body.userId});
        if(user.followers.includes(req.body.userId)){
            res.json({
                status : 404,
                message : "You already following this user"
            })
         } else{
            await db.collection('users').updateOne({token:req.params.id},{$push : {followers : req.body.userId}});
            await db.collection('users').updateOne({token:req.body.userId},{$push : {followings : req.params.id}});
            res.json({
                status : 200,
                message : `started following ${user.username}`
            })

         }

    }else( res.json({
        status : 403,
        message : "You can not follow yourself"
    }))

})

//unfollow
router.put('/:id/unfollow', async (req, res) => {
    if(req.body.userId!==req.params.id){
        const client= await MongoClient.connect(dburl);
        const db = await client.db('social');
        const user = await db.collection('users').findOne({token : req.params.id});
        const currentUser = await db.collection('users').findOne({token : req.body.userId});
        if(!user.followers.includes(req.body.userId)){
            res.json({
                status : 404,
                message : "You donot follow this user"
            })
         } else{
            await db.collection('users').updateOne({token:req.params.id},{$pull : {followers : req.body.userId}});
            await db.collection('users').updateOne({token:req.body.userId},{$pull : {followings : req.params.id}});
            res.json({
                status : 200,
                message : `started unfollowing ${user.username}`
            })

         }

    }else( res.json({
        status : 403,
        message : "You can not unfollow yourself"
    }))

})

//get followings
router.get('/followings/:id', async (req, res) => {
    console.log(req.params.id);
    const client= await MongoClient.connect(dburl);
    const db = await client.db('social');
    const user = await db.collection('users').findOne({token : req.params.id});
    try{
    if(user){
    const followings = await Promise.all(
       user.followings.map(async (id)=>{
           let res = await db.collection('users').findOne({token : id});
           return res;
       })
    );
    let followingsList = [];
    followings.map((following)=>{
        const {token,username,profilePicture} = following;
        followingsList.push({token,username,profilePicture});
    });
    res.json({
        status : 200,
        data : followingsList
    })
    } else{
        res.json({status:404, message:'Invalid userId'})
    }
    }catch(err){
        res.json({status:500,message:'Internal server error'})
    } 

})
//get followers 
router.get('/followers/:id', async (req, res) => {
    console.log(req.params.id);
    const client= await MongoClient.connect(dburl);
    const db = await client.db('social');
    const user = await db.collection('users').findOne({token : req.params.id});
    try{
    if(user){
    const followers = await Promise.all(
       user.followers.map(async (id)=>{
           let res = await db.collection('users').findOne({token : id});
           return res;
       })
    );
    let followersList = [];
    followers.map((follower)=>{
        const {token,username,profilePicture} = follower;
        followersList.push({token,username,profilePicture});
    });
    res.json({
        status : 200,
        data : followersList
    })
    } else{
        res.json({status:404, message:'Invalid userId'})
    }
    }catch(err){
        res.json({status:500,message:'Internal server error'})
    } 

})



module.exports = router;