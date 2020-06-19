const moment = require('moment');
const jwt = require('jwt-simple');
const config = require('../config');

module.exports = function usersController(usersRepository) {

  async function login(req, res) {
    try {
      const { username , password } = req.body
  
      const user = await usersRepository.login(username, password);
  
      if (user) {
        const expires = moment().add( 1, 'years').valueOf();
        const secret = config.jwtSecret;
        const token = jwt.encode({
          id: user.id,
          exp: expires,
          cc: user.country
        }, secret);
  
        res.json({
          success: true,
          token: token,
        });
  
      } else {
        res.status(401)
        .json({
          success: false,
          msg: "Wrong username or password"
        });
      }
    } catch (error) {
      catchError(res, error);
    }
  }

  return {
    login
  }
  
}