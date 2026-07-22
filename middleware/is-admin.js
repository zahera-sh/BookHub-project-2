const User = require("../models/User");

const isAdmin = async (req, res, next) => {
    const user = await User.findById(req.session.user._id);

    if (!user.isAdmin) {
        return res.send("Unauthorized.");
    }

    next();

};

module.exports = isAdmin;