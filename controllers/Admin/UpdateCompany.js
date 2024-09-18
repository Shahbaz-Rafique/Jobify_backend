const Company = require('../../models/Company'); 
const redisClient = require('../../utils/redis'); 

exports.updateCompany = async (req, res) => {
  try {
    const { id } = req.query; 
    const { name, location, logo } = req.body;

    if (!name || !location) {
      return res.status(400).json({ message: 'Name and location are required' });
    }

    const existingCompany = await Company.findById(id);
    if (!existingCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const updatedCompany = await Company.findByIdAndUpdate(id, { name, location, logo }, { new: true });
    if (!updatedCompany) {
      return res.status(404).json({ message: 'Company update failed' });
    }

    const keys = await redisClient.keys('companies:*');
    for (let key of keys) {
      await redisClient.del(key);
    }

    res.status(200).json({ message: 'Company updated successfully', data: updatedCompany });
  } catch (err) {
    console.error('Error updating company:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
