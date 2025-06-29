import Navbar from "../components/Navbar";
import '../cssfolder/Login.css';
import loginImage from '../../assets/login.png';
import { useNavigate } from 'react-router-dom'; 


export default function Login(){
          const navigate = useNavigate()

  return (<>


  <div class="ecosajha-login-body">
    
    
    <Navbar/>

    {/* Main Content */}
    <main class="ecosajha-login-main-container">
        <div class="ecosajha-login-content-wrapper">
            {/* Left Side - Illustration */}
            <div class="ecosajha-login-illustration-container">
                <div class="ecosajha-login-illustration-placeholder">
                    {/* <div class="ecosajha-login-earth-icon">🌍</div>
                    <p class="ecosajha-login-placeholder-text">Earth with People Illustration</p>
                    <p class="ecosajha-login-placeholder-subtext">Placeholder for eco-friendly image</p> */}
                    <div> <img id="login" src={loginImage} alt="login image"  /> </div>




                </div>
            </div>

            {/* Right Side - Login Form */}
            <div class="ecosajha-login-form-container">
                <div class="ecosajha-login-form-card">
                    <h2 class="ecosajha-login-form-title">Log In</h2>
                    
                    <div class="ecosajha-login-form-group">
                        <label for="ecosajha-login-email" class="ecosajha-login-form-label">Email</label>
                        <input type="email" id="ecosajha-login-email" class="ecosajha-login-form-input" placeholder="Enter your email"/>
                    </div>

                    <div class="ecosajha-login-form-group">
                        <label for="ecosajha-login-password" class="ecosajha-login-form-label">Password</label>
                        <input type="password" id="ecosajha-login-password" class="ecosajha-login-form-input" placeholder="Enter your password"/>
                    </div>

                    <p class="ecosajha-login-register-text">
                        Don't have an account? <a class="ecosajha-login-register-link" onClick={() => navigate('/register')} >register now</a>
                    </p>

                    <div class="ecosajha-login-button-group">
                        <button class="ecosajha-login-btn ecosajha-login-btn-primary" onclick="ecosajhaHandleLogin()">Log In</button>
                        <button class="ecosajha-login-btn ecosajha-login-btn-secondary" onclick="ecosajhaHandleResetPassword()">Reset Password</button>
                    </div>
                </div>
            </div>
        </div>
    </main>

</div>
  
  </>)
}