const router = require('express').Router();
const Post = require('../models/Post');

const {MongoClient,dburl,mongodb} = require('../dbSchema');
const {nanoid} = require('nanoid');
// let username ="hhjjkiuhagv";
// username = nanoid(10) ;
// console.log(username);

router.get('/',(req, res) => {
    res.send('This is posts Route');
});

router.post('/', async (req, res) => {
    console.log(req.body.userId);
    req.body.postId = nanoid(10) ;
    req.body.createdAt = new Date();
    const newPost = new Post(req.body) ;
     console.log(newPost,'newPost');
    try{
        const client= await MongoClient.connect(dburl);
        const db = await client.db('social');
        const addpost = await db.collection('posts').insertOne(newPost); 
        console.log(addpost,'added post');
        res.json({
            status : 200,
            message : "added post"
        })
    }catch(err){
        res.json({
            status:500,
            message:"Internal server error"
        })
    }
})

//update post
router.put('/:id', async(req, res)=>{
    const client= await MongoClient.connect(dburl);
    const db = await client.db('social');
    const post = await db.collection('posts').findOne({postId:req.params.id});
    console.log(post.userId);
    if(post){
        //token
        console.log(req.body.userId);
        if(req.body.userId === post.userId){
            const updatepost = await db.collection('posts').updateOne({postId:req.params.id}, {$set : req.body});
            res.json({
                status : 200,
                message : "Post updated"
            })
        } else{
            res.json({
                status: 403,
                message: "you can update only your post"
            })
        }

    }else {
        res.json({
            status : 404,
            message:"Invalid post Id" 
        })
    }

})

//delete post
router.delete('/:id', async(req, res)=>{
    const client= await MongoClient.connect(dburl);
    const db = await client.db('social');
    const post = await db.collection('posts').findOne({postId:req.params.id});
    console.log(post.userId);
    if(post){
        //token
        console.log(req.body.userId);
        if(req.body.userId === post.userId){
            const deleetpost = await db.collection('posts').deleteOne({postId:req.params.id});
            res.json({
                status : 200,
                message : "Post deleted"
            })
        } else{
            res.json({
                status: 403,
                message: "you can delete only your post"
            })
        }

    }else {
        res.json({
            status : 404,
            message:"Invalid post Id" 
        })
    }
})

//like post
router.put('/:id/like', async (req, res)=>{
    try{
        const client= await MongoClient.connect(dburl);
    const db = await client.db('social');
    console.log(req.params.id,'postid');
    console.log(req.body,'token');
    const post = await db.collection('posts').findOne({postId:req.params.id});
    if(post){
        if(post.likes.includes(req.body.userId)){
            const dislikepost = await db.collection('posts').updateOne({postId:req.params.id}, {$pull:{likes:req.body.userId}});
            res.json({
                status : 201,
                message : "Post is now dislliked by you"
            })

        }else{
            const likepost = await db.collection('posts').updateOne({postId:req.params.id}, {$push:{likes:req.body.userId}});
            res.json({
                status:200,
                message : "you liked this post"
            })
        }

    }else {
        res.json({
            status: 404,
            message: "Invalid post Id"
        })
    }
    }catch(err){
        res.json({
            status : 500
        })
    }
})

//get post
router.get('/:id', async (req,res) => {
    const client= await MongoClient.connect(dburl);
    const db = await client.db('social');
    try{
    const post = await db.collection('posts').findOne({postId:req.params.id});
    if(post){
        res.json({
            status : 200,
            post : post
        })
    } else {
        res.json({
            status : 404,
            message : "Invalid post Id"
        })
    }
    }catch(err){
        res.json({
            status : 500,
            message :"Internal server error"
        })
    }

})
//timeline 
router.get("/timeline/:id", async (req, res) => {
    const client= await MongoClient.connect(dburl);
    const db = await client.db('social');
    try {
      const currentUser = await db.collection('users').findOne({token : req.params.id});
      const userPosts = await db.collection('posts').find({userId : req.params.id}).toArray();
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
        return db.collection('posts').find({userId: friendId}).toArray();
        })
      );
    //   res.json(userPosts.concat(...friendPosts))
    res.json({
       timeline :  userPosts.concat(...friendPosts)
    })
    } catch (err) {
      res.status(500).json(err);
    }
  });
  //get users userPosts
  router.get('/profile/:username', async(req,res)=>{
    const client= await MongoClient.connect(dburl);
    const db = await client.db('social');
    const user = await db.collection('users').findOne({username:req.params.username});
    
    let token = user.token;
    const posts = await db.collection('posts').find({userId : token}).toArray();
    
    res.json({
        status:200,
        posts : posts
    })
      
})
module.exports = router;