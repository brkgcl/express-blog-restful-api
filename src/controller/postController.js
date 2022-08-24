const postModel = require('../model/postModel');
const slugify = require('slugify');

const allPost = async (req, res) => {
    const promise = postModel.aggregate([
            {
                $lookup: {
                    from: "newuserschemas",
                    localField: "directorId",
                    foreignField: "_id",
                    as: "output",
                }
            },
            {
                $unwind: {
                    path: "$output",
                }
            },
            {
                $group: {
                    _id: {
                        _id: '$_id',
                        title: '$title',
                        content: '$content',
                        url: '$url',
                        // directorId: '$directorId'
                    },
                    output: {
                        $push: '$output',
                    }
                }
            },
            {
                $project: {
                    _id: '$_id._id',
                    title: '$_id.title',
                    content: '$_id.title',
                    url: '$_id.url',
                    // directorId: '_id.directorId',
                    director: '$output',
                    
                }
            }
    ]);


    // const promise = postModel.find();
    promise.then((data) => {
        console.log(data);
        res.json(data)
    }).catch((err) => {
        console.log("bulunamadı ...", err);
    })
}

const singlePost = async (req, res) => {
    // const promise = postModel.findOne({url: `${req.params.url}`});
    const promise = postModel.aggregate([
        {
            $match: {
                'url': `${req.params.url}`,
            }
        },
        {
            $lookup: {
                from: "userschemas",
                localField: "directorId",
                foreignField: "_id",
                as: "output",
            }
        },
        {
            $unwind: {
                path: "$output",
            }
        },
        {
            $group: {
                _id: {
                    _id: '$_id',
                    title: '$title',
                    content: '$content',
                    url: '$url',
                    directorId: '$directorId'
                },
                output: {
                    $push: '$output',
                }
            }
        },
        {
            $project: {
                _id: '$_id._id',
                title: '$_id.title',
                content: '$_id.title',
                url: '$_id.url',
                directorId: '_id.directorId',
                director: '$output',
                
            }
        }
    ]);

    promise.then((data) => {
        res.json(data)
    }).catch((err) => {
        console.log("bulunamadı ...", err);
    })
}

const addPost = async (req, res) => {
    const newPost = new postModel({
        title: req.body.title,
        content: req.body.content,
        directorId: req.body.directorId,
        url: slugify(req.body.title), 
        // url tutmamın sebebi turkce karakterler
    });
    const promise = newPost.save();
    promise.then((data) => {
        console.log(data);
        res.json(data);
    }).catch((err) => {
        console.log("blog oluşturulmadı ...", err);
    })
}

const updatePost = (req, res, next) => {
    const promise = postModel.findByIdAndUpdate(
        req.params.postId,
        req.body,
        {
            new: true,
        }    
    );
    promise.then((user) => {
        if(!user){
            next({message: 'The post wwas not found.'})
        }
        res.json(user);
    }).catch((err) => {
        console.log(err);
    })
}

const deletePost = (req, res, next) => {
    const promise = postModel.findByIdAndDelete(req.params.postId)

    promise.then((post) => {
        if(!post)
            next({message: 'The post was not found'});
        res.json(post);
    }).catch((err) => {
        console.log(err);
    })
}


module.exports = {
    allPost,
    addPost,
    singlePost,
    updatePost,
    deletePost,
}