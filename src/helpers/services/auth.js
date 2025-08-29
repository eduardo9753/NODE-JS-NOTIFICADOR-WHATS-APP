import jwt from 'jsonwebtoken';

function generateAccessToken(user) {
    return jwt.sign(user, process.env.SECRET, { expiresIn: '5m' });
}

function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/"); //login
    }
    next();
}


export { generateAccessToken, requireLogin }