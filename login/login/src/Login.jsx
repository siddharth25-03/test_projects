import { UNSAFE_decodeViaTurboStream } from "react-router-dom";


function Login(){
    return (
        <div>
        <h2>Login</h2>
        <p>Username</p>
        <input type="text" placeholder="enter username"/>
        <p>Password</p>
        <input type="text" placeholder="enter password"/>
        <br />
        <br />
        <button>ENTER</button>
        </div>
    );
}

export default Login;