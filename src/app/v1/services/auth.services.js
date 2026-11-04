class AuthServices {  
    async register(userData) {
        return {message: 'User registered successfully', data: userData};
    }
}
module.exports = new AuthServices();