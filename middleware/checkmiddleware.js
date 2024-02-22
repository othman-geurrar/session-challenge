const checkAuth = (req, res,next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send('You have not authenticated');
    }
}

module.exports = checkAuth;