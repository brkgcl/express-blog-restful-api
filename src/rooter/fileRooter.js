const singleFileUpload = require('../controller/singleFileUpload');

const fileRouter = (req, res, next) => {
    try {
        singleFileUpload(req, res, function(error) {
        if (error) {
        console.log("err",error)
        } else {
        res.json(req.file).status(200)
        }
        })
        } catch (error) {
        console.log("error",error)
        }        
}

module.exports = fileRouter;

