import Navbar from "../components/Navbar";
import '../cssfolder/Homepage.css'
import { useNavigate } from "react-router-dom";


import houseImage from '../assets/house.png';
import savinghandsImage from '../assets/savinghands.png';
import recycleImage from '../assets/recycleimage.png';
import dustbinImage from '../assets/dustbin.png';
import infoImage from '../assets/info.png';
import newspaperImage from '../assets/newspaper.jpg';
import magazineImage from '../assets/magazine.jpg';
import booksmagImage from '../assets/booksmagazine.jpg';
import cardboardImage from '../assets/cardboard.jpg';
import copyImage from '../assets/copy.jpg';
import invitationImage from '../assets/invitationcard.jpg';
import eggImage from '../assets/eggcrates.jpg';
import cartoonImage from '../assets/cartoon.jpg';
import confidentalImage from '../assets/confidental.jpg';
import bottlesImage from '../assets/bottles.png';
import Footer from "../components/Footer";


export default function Homepage(){
    const navigate = useNavigate()
    return (
        <>
            <div>
                <Navbar/>

                <section className="hero">
                    <div className="hero-content">
                        <h1>Waste Collection Made Easy</h1>
                        <p>Schedule a pickup for your waste</p>
                        <button className="request-btn">Request Pickup</button>
                    </div>
                    <div className="hero-icons">
                         
                    <div> <img src={houseImage} alt="house image"/> </div>
                    <div> <img src={savinghandsImage} alt="savinghands image"/> </div>
                    <div> <img id="recycle" src={recycleImage} alt="recycle image"  /> </div>

                    </div>
                </section>

                {/* Video Section */}
                <section className="video-section">
                    <h2 className="trash">Got TRASH</h2>
                    <div className="play-btn">▶</div>
                    <div className="video-text">
                        <p><strong>Be a Proud Recycler</strong></p>
                        <p>Request pickup now</p>
                    </div>
                    <div > <img id="dustbin" src={dustbinImage} alt="dustbin image"  /> </div>
                    
                </section>
                    <div > <img id="bottles" src={bottlesImage} alt="bottles image"  /> </div>

                {/* About Section */}
                <section className="about-section">
                    <div className="about-content">
                        <div className="about-text">
                            <h2>Why EcoSajha?</h2>
                   <div > <img id="infoimage" src={infoImage} alt="info image"  /> </div>
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="categories-section">
                    <h2 className="categories-title">WHAT WE BUY?</h2>
                    
                    <div className="categories-nav">
                        <button className="category-tab active">Paper</button>
                        <button className="category-tab">Glass and Plastic</button>
                        <button className="category-tab">Metal & Steel</button>
                        <button className="category-tab">E-waste</button>
                        <button className="category-tab">Others</button>
                        <button className="category-tab">Brass</button>
                    </div>

                    <div style={{textAlign: "center", marginBottom: "30px"}}>
                        <button className="category-tab">PET bottle</button>
                    </div>

                    {/* Items Grid */}
                    <div className="items-grid">
                        {/* Row 1 */}
                        <div className="item-card">
                            <div > <img className="news" src={newspaperImage} alt="newspaper image"  /> </div>
                            <h3>Newspaper</h3>
                            <p className="item-price">Est. Rs.9/Kgs</p>
                            <p className="item-description">What are you going to do with old news anyway</p>
                        </div>

                        <div className="item-card">
                            <div > <img className="news" src={magazineImage} alt="magazine image"  /> </div>
                            <h3>Magazines</h3>
                            <p className="item-price">Est. Rs.7/Kgs</p>
                            <p className="item-description">Even guests prefer new issues</p>
                        </div>

                        <div className="item-card">
                            <div > <img className="news" src={booksmagImage} alt="books and magazine image"  /> </div>
                            <h3>Books & Magazine</h3>
                            <p className="item-price">Est. Rs.8/Kgs</p>
                            <p className="item-description">Give your book a new life</p>
                        </div>

                        {/* Row 2 */}
                        <div className="item-card">
                          <div > <img className="news" src={cardboardImage} alt="cardboard image"  /> </div>

                            <h3>Cardboard</h3>
                            <p className="item-price">Est. Rs.9/Kgs</p>
                            <p className="item-description">Don't hoard the board</p>
                        </div>

                        <div className="item-card">
                      <div > <img className="news" src={copyImage} alt="copy image"  /> </div>
                            <h3>Copy</h3>
                            <p className="item-price">Est. Rs.12/Kgs</p>
                            <p className="item-description">Copy, paste, recycle</p>
                        </div>

                        <div className="item-card">
                             <div > <img className="news" src={eggImage} alt="eggcrates image"  /> </div>
                            <h3>Egg crates</h3>
                            <p className="item-price">Est. Rs.5/Kgs</p>
                            <p className="item-description">Create new crates</p>
                        </div>

                        {/* Row 3 */}
                        <div className="item-card">
                            <div > <img className="news" src={invitationImage} alt="invitation card image"  /> </div>
                            <h3>Invitation cards</h3>
                            <p className="item-price">Est. Rs.6/Kgs</p>
                            <p className="item-description">You are invited to recycle</p>
                        </div>

                        <div className="item-card">
                         <div > <img className="news" src={cartoonImage} alt="cartoonimage"  /> </div>
                            <h3>Carton</h3>
                            <p className="item-price">Est. Rs.8/Kgs</p>
                            <p className="item-description">carton</p>
                        </div>

                        <div className="item-card">
                       <div > <img className="news" src={confidentalImage} alt="confidental document image"  /> </div>

                            <h3>Confidential Documents</h3>
                            <p className="item-price">Est. Rs.7/Kgs</p>
                            <p className="item-description"></p>
                        </div>
                    </div>
                </section>
               
                

                {/* Footer Info */}
                <footer className="footer-info">
                    <div className="footer-content">
                        <div className="footer-title">Conditions Apply</div>
                        <ul>
                            <li>• All rates are estimates</li>
                            <li>• Sometimes rates are mutually decided at the venue</li>
                            <li>• Not everything listed here as examples might be accepted by all Khalistist friends</li>
                            <li>• Broken glass items are not accepted</li>
                        </ul>
                    </div>
                </footer>

              <Footer/>
             
            </div>
        </>
    );
}





