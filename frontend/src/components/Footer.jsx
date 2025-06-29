

import { useNavigate } from 'react-router-dom'; 

export default function Footer(){

     const navigate = useNavigate()
    return (<>
       <footer className="footer-bottom">
                    <div>@ecosajharecyclewala 2025</div>
                    <div className="footer-links">
                         <a onClick={() => navigate('/about')}>About</a>
                          <a onClick={() => navigate('/contact')}>Contact</a>
                    </div>
                </footer>
                </>);
}