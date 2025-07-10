import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <nav className="flex flex-col md:flex-row justify-between items-center list-none py-4 px-6 md:pr-10 bg-green-500 text-black shadow-lg sticky top-0 z-50 min-h-16 md:min-h-15">
      {/* Logo */}
      <div 
        className={` mx-12 text-4xl font-black text-green-800 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 mb-3 md:mb-0 ${
          location.pathname === '/' ? 'text-green-900 scale-105' : ''
        }`}
        onClick={() => navigate('/')}
      >
        EcoSajha Recycle
      </div>
      
      {/* Navigation Links */}
      <div className=" flex flex-col md:flex-row items-center gap-2 md:gap-4">
    
        <div 
          className={`text-lg md:text-2xl font-medium cursor-pointer transition-all duration-300 ease-in-out hover:text-blue-700 hover:font-bold hover:border-b-2 hover:border-white px-2 py-1 text-center ${
            location.pathname === '/about' ? 'text-blue-700 font-bold border-b-2 border-white' : ''
          }`}
          onClick={() => navigate('/about')}
        >
          About
        </div>
        <div 
          className={`text-lg md:text-2xl font-medium cursor-pointer transition-all duration-300 ease-in-out hover:text-blue-700 hover:font-bold hover:border-b-2 hover:border-white px-2 py-1 text-center ${
            location.pathname === '/contact' ? 'text-blue-700 font-bold border-b-2 border-white' : ''
          }`}
          onClick={() => navigate('/contact')}
        >
          Contact
        </div>
        <div 
          className={`text-lg md:text-2xl font-medium cursor-pointer transition-all duration-300 ease-in-out hover:text-blue-700 hover:font-bold hover:border-b-2 hover:border-white px-2 py-1 text-center ${
            location.pathname === '/login' ? 'text-blue-700 font-bold border-b-2 border-white' : ''
          }`}
          onClick={() => navigate('/login')}
        >
          Login
        </div>
        <div 
          className={`text-lg md:text-2xl font-medium cursor-pointer transition-all duration-300 ease-in-out hover:text-blue-700 hover:font-bold hover:border-b-2 hover:border-white px-2 py-1 text-center ${
            location.pathname === '/register' ? 'text-blue-700 font-bold border-b-2 border-white' : ''
          }`}
          onClick={() => navigate('/register')}
        >
          Register
        </div>
      </div>
    </nav>
  );
}