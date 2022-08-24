
const userModel = require('../model/userModel')


const allUsers = (req, res) => {
    const promise = userModel.aggregate([
        {
            $lookup: {
                from: 'postschemas',
                localField: '_id',
                foreignField: 'directorId',
                as: 'output'
            }
        },
        {
            $unwind: {
                path: '$output',
                preserveNullAndEmptyArrays: true,
            }
        },
        {
            //bütün kayıtlar ayrı ayrı gözükmemesi için grupluyoruz
            $group: {
                _id: {
                    _id: '$_id',
                    name: '$name',
                    surname: '$surname',
                    userName: '$userName',
                    password: '$password',
                },
                output: {
                    $push: '$output',
                }
            }
        },
        {
            $project: {
                _id: '$_id._id',
                name: '$_id.name',
                surname: '$_id.surname',
                userName: '$_id.userName',
                password: '$_id.password',
                output: '$output',
            }
        }
    ]);
    promise.then((user) => {
        res.json(user);
    }).catch((err) => {
        console.log("can't find user", err);
    })
}

const singleUser = (req, res) => {
    const promise = userModel.aggregate([
        {
            $match: {
                'userName': req.params.userName,
            }
        },
        {
            $lookup: {
                from: 'postschemas',
                localField: '_id',
                foreignField: 'directorId',
                as: 'output',
            }
        },
        {
            $unwind: {
                path: '$output',
                preserveNullAndEmptyArrays: true,
            }
        },
        {
            $group: {
                _id: {
                    _id: '$_id',
                    name: '$name',
                    surname: '$surname',
                    userName: '$userName',
                    password: '$password',
                },
                output: {
                    $push: '$output',
                }
            }
        },
        {
            $project: {
                _id: '$_id._id',
                name: '$_id.name',
                surname: '$_id.surname',
                userName: '$_id.userName',
                password: '$_id.password',
                output: '$output',
            }
        },
    ]);
    promise.then((data) => {
        res.json(data)
    }).catch((err) => {
        console.log("can't resolve" + err);
    })
}

const addUser = (req, res) => {
    const user = new userModel(req.body);
    const promise = user.save();
    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        console.log("save error ...", err);
    });
}

const updateUser = (req, res, next) => {
    const promise = userModel.findByIdAndUpdate(
        req.params.userId,
        req.body,
        {
            new: true,
        }    
    );
    promise.then((user) => {
        if(!user){
            next({message: 'The user wwas not found.'})
        }
        res.json(user);
    }).catch((err) => {
        console.log(err);
    })
}

const deleteUser = (req, res, next) => {
    const promise = userModel.findByIdAndDelete(req.params.userId)

    promise.then((user) => {
        if(!user)
            next({message: 'The user was not found'});
        res.json(user);
    }).catch((err) => {
        console.log(err);
    })
}



module.exports = {
    allUsers,
    singleUser,
    addUser,
    updateUser,
    deleteUser,
}