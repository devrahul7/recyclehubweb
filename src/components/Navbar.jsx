
import { useNavigate } from 'react-router-dom'; 
import '../cssfolder/Navbar.css';

export default function Navbar(){

      const navigate = useNavigate()
    return (<>

            <ul id="navbar">   
            <p id='logo' onClick={() => navigate('/')}>EcoSajha Recycle</p>

               <li onClick={() => navigate('/')}>Home</li>
               <li onClick={() => navigate('/about')}>About</li>
               <li onClick={() => navigate('/contact')}>Contact</li>
               <li onClick={() => navigate('/login')}>Login</li>
               <li onClick={() => navigate('/register')}>Register</li>

            </ul>


    </>);

} 