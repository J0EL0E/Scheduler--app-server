function errorHandler(err, req, res, next){
    const error = new Error(err);
    res.json({error: error});
};

module.exports = errorHandler;