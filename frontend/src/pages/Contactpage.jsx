
import Navbar from '../components/Navbar';
import '../cssfolder/Contactpage.css';
import dustbinImage from '../assets/dustbin.png';
import Footer from '../components/Footer';


export default function Contactpage(){
    return (<>
    
<Navbar/>   
    <div class="eco-universe">
    {/* 🏔️ The Majestic Mountain Peak  */}

    {/* 🎭 The Grand Theater Stage  */}
    <main class="grand-theater">
        {/* 🦸 The Champion's Podium  */}
        <section class="champion-spotlight">
            <div class="natures-badge">🌱</div>
            <div class="epic-scroll">
                <h1>Waste Collection<br/>Made Easy</h1>
                <p>Schedule a pickup for your waste</p>
                <button class="magic-trigger">Request Pickup</button>
            </div>
        </section>

        {/* 💎 The Crystal Palace  */}
        <section class="crystal-palace">
            <h2>Contact</h2>
            
            <div class="communication-ring">
                <div class="mystical-orb whatsapp-emerald">📱</div>
                <div class="megaphone-message">+977 9742869215</div>
            </div>
            
            <div class="communication-ring">
                <div class="mystical-orb viber-amethyst">📞</div>
                <div class="megaphone-message">+977 9742869215</div>
            </div>
            
            <div class="communication-ring">
                <div class="mystical-orb gmail-rainbow">📧</div>
                <div class="megaphone-message">rahulraazrs123@gmail.com</div>
            </div>
        </section>

        {/* 🎨 The Masterpiece Canvas  */}
        <section class="masterpiece-canvas">
            <div class="drama-stage">
                <div class="movie-scene">
                    <div class="circus-announcement">Got TRASH</div>
                    <div class="symphony-button">▶</div>
                </div>
                <div class="finale-curtain">
                    <div class="champion-title">Be a Proud Recycler</div>
                    <div class="honor-ribbon"><strong>Request pickup</strong> now</div>
                </div>
                 <div > <img id="dustbin" src={dustbinImage} alt="dustbin image"  /> </div>
                
                {/* <div class="treasure-chest">🗑️</div> */}


            </div>
        </section>
    </main>

    <Footer/>
  
</div>
    
    </>);
}