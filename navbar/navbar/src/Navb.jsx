import './index.css'
import {Link} from 'react-router-dom'


function Navb() {
    return (
        <>
            <body>

                <header>
                    <div class="container">
                        <div id="logo">GFG</div>
                        <nav>
                            <ul class="nav-links">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/about">About</Link></li>
                                <li><Link to="/services">Services</Link></li>
                                <li><Link to="/home">Contact</Link></li>
                            </ul>
                        </nav>
                    </div>
                </header>

                <section class="content">
                    <div class="container">
                        <h1>Welcome to Our Website!</h1>
                        <p>
                            Get plenty of knowledge by our
                            wonderful courses.
                        </p>
                    </div>
                </section>

            </body>

        </>

    );
}

export default Navb;