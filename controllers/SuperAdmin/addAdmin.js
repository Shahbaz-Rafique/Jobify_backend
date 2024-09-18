const User = require('../../models/users');
const crypto = require('crypto');
const { transporter } = require('../../utils/nodemailer');
const redisClient = require('../../utils/redis');

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

const generatePassword = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
};

const sendPasswordEmail = async (email, password) => {
  const mailOptions = {
    from: `Jobify <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Admin Account Credentials',
    text: `Hello,\n\nYour admin account has been created. Your login credentials are:\n\nEmail: ${email}\nPassword: ${password}.\n\nThank you!`,
  };

  await transporter.sendMail(mailOptions);
};

exports.addAdmin = async (req, res) => {
  try {
    const { name, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    const generatedPassword = generatePassword();
    const hashedPassword = hashPassword(generatedPassword);

    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    await newAdmin.save();
    await sendPasswordEmail(email, generatedPassword);

    const keys = await redisClient.keys('admins:*'); 
    for (let key of keys) {
      await redisClient.del(key);
    }

    res.status(201).json({ message: 'success' });
  } catch (err) {
    console.error('Error adding admin:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
