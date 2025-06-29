import Navbar from "../components/Navbar";
import '../cssfolder/Login.css';
import loginImage from '../assets/login.png';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

export default function Login() {
    const navigate = useNavigate();
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data) => {
        try {
            console.log('Login data:', data);
        const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const response = await res.json()

      if(response.success && response.data.token){
        localStorage.setItem("token", response.data.token)
        navigate("/dashboard")
      }else {
        alert("password is invalid")
      }
            // navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            // Handle login error (show toast, set error message, etc.)
        }
    };

    const handleResetPassword = () => {
        // Add your reset password logic here
        console.log('Reset password clicked');
        // navigate('/reset-password');
    };

    return (
        <>
            <div className="ecosajha-login-body">
                <Navbar/>
                
                {/* Main Content */}
                <main className="ecosajha-login-main-container">
                    <div className="ecosajha-login-content-wrapper">
                        {/* Left Side - Illustration */}
                        <div className="ecosajha-login-illustration-container">
                            <div className="ecosajha-login-illustration-placeholder">
                                <div>
                                    <img id="login" src={loginImage} alt="login image" />
                                </div>
                            </div>
                        </div>
                        
                        {/* Right Side - Login Form */}
                        <div className="ecosajha-login-form-container">
                            <div className="ecosajha-login-form-card">
                                <h2 className="ecosajha-login-form-title">Log In</h2>
                                
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="ecosajha-login-form-group">
                                        <label htmlFor="email" className="ecosajha-login-form-label">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            {...register('email', {
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Invalid email address'
                                                }
                                            })}
                                            className={`ecosajha-login-form-input ${errors.email ? 'error' : ''}`}
                                            placeholder="Enter your email"
                                        />
                                        {errors.email && (
                                            <span className="ecosajha-login-error-message">
                                                {errors.email.message}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="ecosajha-login-form-group">
                                        <label htmlFor="password" className="ecosajha-login-form-label">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            {...register('password', {
                                                required: 'Password is required',
                                                minLength: {
                                                    value: 6,
                                                    message: 'Password must be at least 6 characters'
                                                }
                                            })}
                                            className={`ecosajha-login-form-input ${errors.password ? 'error' : ''}`}
                                            placeholder="Enter your password"
                                        />
                                        {errors.password && (
                                            <span className="ecosajha-login-error-message">
                                                {errors.password.message}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <p className="ecosajha-login-register-text">
                                        Don't have an account? 
                                        <a 
                                            className="ecosajha-login-register-link" 
                                            onClick={() => navigate('/register')}
                                        >
                                            register now
                                        </a>
                                    </p>
                                    
                                    <div className="ecosajha-login-button-group">
                                        <button 
                                            type="submit"
                                            className="ecosajha-login-btn ecosajha-login-btn-primary"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Logging in...' : 'Log In'}
                                        </button>
                                        <button 
                                            type="button"
                                            className="ecosajha-login-btn ecosajha-login-btn-secondary"
                                            onClick={handleResetPassword}
                                        >
                                            Reset Password
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}