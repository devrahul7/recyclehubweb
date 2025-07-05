// ... other imports remain the same
import Navbar from "../components/Navbar";
import '../cssfolder/Login.css';
import loginImage from '../assets/login.png';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

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

            const response = await res.json();

            if (response.success && response.data.token) {
                localStorage.setItem("token", response.data.token);
                navigate("/dashboard");
            } else {
                alert("password is invalid");
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleForgotPassword = () => {
        console.log('Forgot password clicked');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <div className="ecosajha-login-body">
                <Navbar />
                <main className="ecosajha-login-main-container">
                    <div className="ecosajha-login-content-wrapper">
                        <div className="ecosajha-login-illustration-container">
                            <div className="ecosajha-login-illustration-placeholder">
                                <div>
                                    <img id="login" src={loginImage} alt="login image" />
                                </div>
                            </div>
                        </div>

                        <div className="ecosajha-login-form-container">
                            <div className="ecosajha-login-form-card">
                                <h2 className="ecosajha-login-form-title">Log In to Access Dashboard</h2>

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
                                        <div className="ecosajha-login-password-container">
                                            <input
                                                type={showPassword ? "text" : "password"}
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
                                            <button
                                                type="button"
                                                className="ecosajha-login-password-toggle"
                                                onClick={togglePasswordVisibility}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M10.7302 5.07319C11.1448 5.02485 11.5684 5 12 5C16.6639 5 20.3998 7.90264 21.9999 12C21.1789 14.2847 19.7729 16.2793 17.9261 17.7136M14.1213 14.1213C13.6642 14.5784 13.048 14.8284 12.3702 14.8284C11.6924 14.8284 11.0762 14.5784 10.6191 14.1213C10.1620 13.6642 9.91203 13.048 9.91203 12.3702C9.91203 11.6924 10.1620 11.0762 10.6191 10.6191M14.1213 14.1213L10.6191 10.6191M14.1213 14.1213L17.7136 17.7136M10.6191 10.6191C10.1620 11.0762 9.91203 11.6924 9.91203 12.3702C9.91203 13.048 10.1620 13.6642 10.6191 14.1213M10.6191 10.6191L6.28636 6.28636M17.7136 17.7136C16.0778 18.9059 14.1235 19.5 12 19.5C7.33611 19.5 3.60018 16.5974 2 12C3.24389 9.19371 5.24931 6.86080 7.71364 5.28636M17.7136 17.7136L7.71364 5.28636" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                ) : (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
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
                                            onClick={() => {
                                                handleForgotPassword();
                                                navigate('/forgotpassword');
                                            }}
                                        >
                                            Forgot Password
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