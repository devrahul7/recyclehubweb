import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import dustbinImage from '../assets/dustbin.png';
import Footer from '../components/Footer';
import '../cssfolder/Aboutpage.css';

const Aboutpage = () => {
  const navigate = useNavigate();

  // Enhanced benefits data
  const benefits = [
    {
      icon: '🌍',
      title: 'Eco-Friendly',
      description: 'Help reduce environmental impact through proper waste management and sustainable practices',
      color: '#4CAF50'
    },
    {
      icon: '🚚',
      title: 'Convenient',
      description: 'Schedule pickups at your convenience from your doorstep with flexible timing',
      color: '#2196F3'
    },
    {
      icon: '💰',
      title: 'Earn Money',
      description: 'Get paid competitive rates for your recyclable waste materials instantly',
      color: '#FF9800'
    },
    {
      icon: '⚡',
      title: 'Fast Service',
      description: 'Quick response time with same-day pickup available in most areas',
      color: '#9C27B0'
    },
    {
      icon: '🔒',
      title: 'Secure & Safe',
      description: 'Licensed professionals handle your waste responsibly with full insurance coverage',
      color: '#607D8B'
    },
    {
      icon: '📱',
      title: 'Smart Tracking',
      description: 'Track your pickup status and earnings in real-time through our mobile app',
      color: '#795548'
    }
  ];

  // Audio function for the play button
  const playWelcomeAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Welcome to EcoSajha recycling website. Lets Be a Proud Recycler. Recycle Now');
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        utterance.voice = voices[0];
      }
      
      speechSynthesis.speak(utterance);
    } else {
      console.log('Speech synthesis not supported');
      alert('Welcome to EcoSajha recycling website');
    }
  };

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationDelay = `${entry.target.dataset.delay}ms`;
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe benefit cards
    document.querySelectorAll('.benefit-card').forEach((card, index) => {
      card.dataset.delay = index * 150;
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: 'Arial, sans-serif'
  },
  howItWorksSection: {
    padding: '3rem 1rem',
    textAlign: 'center'
  },
  sectionContainer: {
    maxWidth: '1280px',
    margin: '0 auto'
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '2rem',
    background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  imagePlaceholder: {
    maxWidth: '1190px',
    margin: '0 auto',
    padding: '0 1rem'
  },
  imageStyle: {
    width: '100%',
    height: 'auto',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    border: '2px solid #e8f5e8',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  }
};

  return (
    <>
      <Navbar/>
      <div style={styles.container}>
        
        {/* Enhanced Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>Waste Collection Made Easy</h1>
            <p>Schedule a pickup for your waste</p>
            
            <div className="hero-buttons">
              <button 
                onClick={() => navigate('/login')} 
                className="request-btn"
              >
                Request Pickup
              </button>
              <button 
                className="what-we-buy-btn" 
               onClick={() => { navigate('/')}}
              >
                What We Buy
              </button>
            </div>
           <div className="service-highlights">
              <div className="highlight-card">
                <div className="highlight-icon">
                  <span>📞</span>
                </div>
                <h3>Quick Booking</h3>
                <p>Schedule in 2 minutes</p>
              </div>
              <div className="highlight-card">
                <div className="highlight-icon">
                  <span>🚚</span>
                </div>
                <h3>Free Pickup</h3>
                <p>No hidden charges</p>
              </div>
              <div className="highlight-card">
                <div className="highlight-icon">
                  <span>💰</span>
                </div>
                <h3>Instant Payment</h3>
                <p>Get paid immediately</p>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Video Section */}
        <section className="video-section">
          <div className="video-content">
            <h2 className="trash">Got TRASH</h2>
            <div className="play-btn" onClick={playWelcomeAudio}>▶</div>
            <div className="video-text">
              <p><strong>Be a Proud Recycler</strong></p>
              <p>Request pickup now</p>
            </div>
          </div>
          <div className="video-image">
            <img id="dustbin" src={dustbinImage} alt="dustbin image" /> 
          </div>
        </section>

{/* How it Works Section - Simplified with Image Placeholder */}
<section style={styles.howItWorksSection}>
  <div style={styles.sectionContainer}>
    <h2 style={styles.sectionTitle}>How it works</h2>
    <div style={styles.imagePlaceholder}>
      <img 
        src="/src/assets/ecosajhawork.png" 
        alt="How it works process" 
        style={styles.imageStyle} 
      />
    </div>
  </div>
</section>

        {/* Enhanced Why EcoSajha Section */}
        <section className="why-section">
          <div className="section-container">
            <h2 className="section-title">Why Choose EcoSajha?</h2>
            <p className="section-subtitle">
              Experience the difference with our comprehensive Recycling management solution
            </p>
            <div className="benefits-grid">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="benefit-card"
                  style={{ '--card-color': benefit.color }}
                >
                  <div className="benefit-icon">
                    <span>{benefit.icon}</span>
                  </div>
                  <h3 className="benefit-title">{benefit.title}</h3>
                  <p className="benefit-text">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

       
        <Footer/>
      </div>
    </>
  );
};

export default Aboutpage;
