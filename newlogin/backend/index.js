const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const { signupUser } = require('./controllers/authController');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// testing the backend api code
app.post('/test', (req, res) => {
  res.send("Test route hit!");
});


app.post('/signup', signupUser);

const PORT = 5050;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
