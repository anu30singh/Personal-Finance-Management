const usersService = require('./users.service');
const { hashPassword } = require('../../utils/hash');

async function createUser(req, res) {
    const {name,email,password} = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    } 

    const existingUser = await usersService.findUserByEmail(email); //using 409 status code for conflict
    if (existingUser) {
        return res.status(409).json({ error: 'User with this email already exists' }); // Conflict
    } 
      const passwordHash = await hashPassword(password);

      const user = await usersService.createUser({
                 name,
                 email,
                 passwordHash,
                 authProvider: 'local',
    });
  res.status(201).json(user);
}
module.exports = {
  createUser,
};
