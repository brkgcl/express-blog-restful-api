// const { Router } = require('express');
const express = require('express');
const rooter = express.Router();

//controller
const postController = require('../controller/postController');


//----------------------ROOTEER ---------------------------
//allPost
rooter.get('/', postController.allPost)
//addPost
rooter.post('/', postController.addPost) 
//singlePost
rooter.get('/:url', postController.singlePost)
//updatePost
rooter.put('/:postId', postController.updatePost)
//   !!not: updatePost da post update olunca url de değişecek

//deletePost
rooter.delete('/:postId', postController.deletePost)




module.exports = rooter;