const usersService = require('../users/users.service');
const { comparePassword } = require('../../utils/hash');
const { generateToken } = require('../../utils/jwt');

async function login (req, res) {
     const { email, password } = req.body;
       if (!email || !password) {
          return res.status(400).json({
          message: 'Email and password are required',
        });
  }
   const user = await usersService.findUserByEmail(email);
   if (!user) {
    return res.status(401).json({
      message: 'Invalid credentials',
    });
  }
  const isValid = await comparePassword(password, user.password_hash);

  if (!isValid) {
    return res.status(401).json({
      message: 'Invalid credentials',
    });
  }
   
    const token = generateToken({
    userId: user.id,
    email: user.email,
  });

    return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  }); 


}

module.exports = {
  login,
};
