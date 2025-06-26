import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import registerImage from '../assets/register.png';
import '../cssfolder/Register.css';

export default function Register() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert('Registration successful!');
        reset();
        navigate('/login');
      } else {
        alert('Registration failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="ecosajha-container">
        <div className="ecosajha-flex">
          <img src={registerImage} alt="register" className="ecosajha-image" />

          <div className="ecosajha-registration-card">
            <div className="ecosajha-card-header">
              <div className="ecosajha-recycle-icon">♻️</div>
              <h1>Join EcoSajha</h1>
              <p>Be part of Nepal's recycling revolution</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="ecosajha-form-group">
                <label>Full Name *</label>
                <input {...register("fullName", { required: true })} placeholder="Enter your full name" />
              </div>
              <div className="ecosajha-form-group">
                <label>Email Address *</label>
                <input type="email" {...register("email", { required: true })} placeholder="your.email@example.com" />
              </div>
              <div className="ecosajha-form-group">
                <label>Password *</label>
                <input type="password" {...register("password", { required: true })} placeholder="choose password" />
              </div>
              <div className="ecosajha-form-group">
                <label>Phone Number *</label>
                <input type="tel" {...register("phone", { required: true })} placeholder="+977 98xxxxxxxx" />
              </div>
              <div className="ecosajha-form-group">
                <label>Address *</label>
                <input {...register("address", { required: true })} placeholder="Street, Ward, District" />
              </div>
              <div className="ecosajha-form-group">
                <label>Primary Waste Type *</label>
                <select {...register("wasteType", { required: true })}>
                  <option value="">Select waste type</option>
                  <option value="paper">Paper & Cardboard</option>
                  <option value="plastic">Glass & Plastic</option>
                  <option value="metal">Metal & Steel</option>
                  <option value="electronic">E-waste</option>
                  <option value="mixed">Mixed Recyclables</option>
                  <option value="organic">Organic Waste</option>
                </select>
              </div>
              <button type="submit" className="ecosajha-register-btn">Create Account</button>
            </form>

            <div className="ecosajha-login-link">
              Already have an account? <a onClick={() => navigate('/login')}>Login here</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
