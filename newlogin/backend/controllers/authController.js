const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  petname: String
});

const User = mongoose.model('User', userSchema);

// Secret key for JWT (keep this safe in .env in real apps)
const SECRET = "mySecretKey";  // <- move to .env later

const signupUser = async (req, res) => {
  const { username, password, petname } = req.body;

  try {
    const user = new User({ username, password, petname });
    await user.save();

    // Generate JWT
    const token = jwt.sign({ username: user.username }, SECRET, { expiresIn: '1h' });

    res.json({ message: "User signed up successfully!", token });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { signupUser };
