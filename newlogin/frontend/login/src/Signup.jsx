import { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [petname, setPetname] = useState("");

  async function handleSubmit() {
    try {
      const res = await axios.post("http://localhost:5050/signup", {
        username,
        password,
        petname
      });
      alert(res.data.message); // "User signed up successfully!"
    } catch (err) {
      console.error(err);
      alert("Signup failed.");
    }
  }

  return (
    <div>
      <h2>Signup</h2>
      <p>Username</p>
      <input type="text" placeholder="enter username" onChange={(e) => setUsername(e.target.value)} />

      <p>Password</p>
      <input type="password" placeholder="enter password" onChange={(e) => setPassword(e.target.value)} />

      <p>Pet Name</p>
      <input type="text" placeholder="enter petname" onChange={(e) => setPetname(e.target.value)} />

      <br /><br />
      <button onClick={handleSubmit}>ENTER</button>
    </div>
  );
}

export default Signup;
