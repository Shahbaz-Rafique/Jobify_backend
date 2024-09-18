const User = require('../../models/users');
const redisClient = require('../../utils/redis');

exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.query; 
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== id) {
      return res.status(400).json({ message: 'Email is already in use by another admin' });
    }

    const updatedAdmin = await User.findByIdAndUpdate(id, { name, email }, { new: true });
    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const keys = await redisClient.keys('admins:*');
    for (let key of keys) {
      await redisClient.del(key);
    }

    res.status(200).json({ message: 'success' });
  } catch (err) {
    console.error('Error updating admin:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
