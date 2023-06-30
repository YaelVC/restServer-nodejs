const { response } = require("express");

const login = (req, res = response) => {
    try {
        const { email, password } = req.body;
        
        res.json({
            msg: 'Login OK'
        })
    } catch (error) {
        console.log('error');
    }

}

module.exports = {
    login
}