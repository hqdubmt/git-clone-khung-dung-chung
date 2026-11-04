const { Ok } = require('../../../cors/sycessReponse.cors');
const AuthServices = require('../services/auth.services');

class AuthControllers {

    async registerUser(req, res) {
        new Ok({
            metadata: await AuthServices.register(req.body),
        }).send(res);
    }
}

module.exports = new AuthControllers;