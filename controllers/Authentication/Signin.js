const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../../models/users'); 

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("userer",user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = hashPassword(password);

    if (hashedPassword != user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: '1h' } 
    );

    res.json({
      token,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
