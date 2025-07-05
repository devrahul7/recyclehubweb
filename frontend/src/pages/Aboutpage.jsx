import React from 'react';
import Navbar from '../components/Navbar';

import dustbinImage from '../assets/dustbin.png';
import houseImage from '../assets/house.png';
import savinghandsImage from '../assets/savinghands.png';
import recycleImage from '../assets/recycleimage.png';
import Footer from '../components/Footer';

const Aboutpage = () => {
  const navigate = (path) => {
    // Navigation logic would be handled by your router
    console.log('Navigate to:', path);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: 'Arial, sans-serif'
    },
    navbar: {
      backgroundColor: '#10b981',
      padding: '1rem 1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    navContainer: {
      maxWidth: '1280px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    navLogo: {
      color: 'white',
      fontSize: '1.25rem',
      fontWeight: 'bold'
    },
    navLinks: {
      display: 'flex',
      gap: '2rem'
    },
    navButton: {
      color: 'white',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'color 0.3s',
      fontSize: '1rem'
    },
    navButtonActive: {
      color: '#fca5a5'
    },
    heroSection: {
      backgroundColor: '#e9f5e9',
      padding: '5rem 1.5rem'
    },
    heroContainer: {
      maxWidth: '1280px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center'
    },
    heroContent: {
      flex: 1
    },
    heroIcon: {
      width: '4rem',
      height: '4rem',
      backgroundColor: '#dcfce7',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1rem'
    },
    heroTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '1rem',
      lineHeight: '1.2'
    },
    heroSubtitle: {
      fontSize: '1.25rem',
      color: '#6b7280',
      marginBottom: '2rem'
    },
    primaryButton: {
      backgroundColor: '#10b981',
      color: 'white',
      padding: '0.75rem 2rem',
      borderRadius: '0.5rem',
      fontSize: '1.125rem',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    videoSection: {
      backgroundColor: '#f3f4f6',
      padding: '5rem 1.5rem'
    },
    videoContainer: {
      maxWidth: '1280px',
      margin: '0 auto'
    },
    videoContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem'
    },
    videoLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    videoTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    playButton: {
      width: '4rem',
      height: '4rem',
      backgroundColor: '#3b82f6',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      border: 'none'
    },
    videoCenter: {
      textAlign: 'center'
    },
    videoText: {
      fontSize: '1.25rem',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    videoSubtext: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#1f2937'
    },
    recycleIcon: {
      width: '8rem',
      height: '8rem',
      backgroundColor: '#10b981',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2.5rem'
    },
    whySection: {
      backgroundColor: 'white',
      padding: '5rem 1.5rem'
    },
    sectionContainer: {
      maxWidth: '1280px',
      margin: '0 auto',
      textAlign: 'center'
    },
    sectionTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '4rem'
    },
    benefitsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem'
    },
    benefitCard: {
      textAlign: 'center'
    },
    benefitIcon: {
      width: '4rem',
      height: '4rem',
      backgroundColor: '#dcfce7',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem'
    },
    benefitTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    benefitText: {
      color: '#6b7280'
    },
    howItWorksSection: {
      backgroundColor: '#f3f4f6',
      padding: '5rem 1.5rem'
    },
    stepsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem'
    },
    stepCard: {
      backgroundColor: '#10b981',
      borderRadius: '0.5rem',
      padding: '2rem',
      color: 'white',
      textAlign: 'center'
    },
    stepIconContainer: {
      marginBottom: '1.5rem'
    },
    stepIcon: {
      width: '6rem',
      height: '4rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      margin: '0 auto 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem'
    },
    stepPersons: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.5rem'
    },
    stepPerson: {
      width: '3rem',
      height: '3rem',
      backgroundColor: '#065f46',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    stepSinglePerson: {
      width: '3rem',
      height: '3rem',
      backgroundColor: '#065f46',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto'
    },
    stepTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    stepDescription: {
      color: '#bbf7d0'
    },
    footer: {
      backgroundColor: '#1f2937',
      color: 'white',
      padding: '3rem 1.5rem'
    },
    footerContainer: {
      maxWidth: '1280px',
      margin: '0 auto'
    },
    footerGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem'
    },
    footerSection: {
      
    },
    footerTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '1rem'
    },
    footerSubtitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      marginBottom: '1rem'
    },
    footerText: {
      color: '#9ca3af'
    },
    footerList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    footerListItem: {
      marginBottom: '0.5rem'
    },
    footerLink: {
      color: '#9ca3af',
      textDecoration: 'none',
      transition: 'color 0.3s'
    }
  };

  return (<>
    <Navbar/>
    <div style={styles.container}>
    

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
      <section style={styles.videoSection}>
        <div style={styles.videoContainer}>
          <div style={styles.videoContent}>
            <div style={styles.videoLeft}>
              <h2 style={styles.videoTitle}>Got TRASH</h2>
              <button 
                style={styles.playButton}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
              >
                <span style={{color: 'white', fontSize: '1.5rem'}}>▶</span>
              </button>
                   <div > <img id="dustbin" src={dustbinImage} alt="dustbin image"  /> </div>
            </div>
            <div style={styles.videoCenter}>
              <p style={styles.videoText}>Be a Proud Recycler</p>
              <p style={styles.videoSubtext}>
                <span style={{fontWeight: 'bold'}}>Request pickup</span> now
              </p>
            </div>
            <div style={styles.recycleIcon}>
              <div style={{color: 'white'}}>♻️</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why EcoSajha Section */}
      <section style={styles.whySection}>
        <div style={styles.sectionContainer}>
          <h2 style={styles.sectionTitle}>
            Why EcoSajha?
          </h2>
          <div style={styles.benefitsGrid}>
            <div style={styles.benefitCard}>
              <div style={styles.benefitIcon}>
                <span style={{fontSize: '1.5rem'}}>🌍</span>
              </div>
              <h3 style={styles.benefitTitle}>Eco-Friendly</h3>
              <p style={styles.benefitText}>
                Help reduce environmental impact through proper waste management
              </p>
            </div>
            <div style={styles.benefitCard}>
              <div style={styles.benefitIcon}>
                <span style={{fontSize: '1.5rem'}}>🚚</span>
              </div>
              <h3 style={styles.benefitTitle}>Convenient</h3>
              <p style={styles.benefitText}>
                Schedule pickups at your convenience from your doorstep
              </p>
            </div>
            <div style={styles.benefitCard}>
              <div style={styles.benefitIcon}>
                <span style={{fontSize: '1.5rem'}}>💰</span>
              </div>
              <h3 style={styles.benefitTitle}>Earn Money</h3>
              <p style={styles.benefitText}>
                Get paid for your recyclable waste materials
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section style={styles.howItWorksSection}>
        <div style={styles.sectionContainer}>
          <h2 style={styles.sectionTitle}>
            How it works
          </h2>
          <div style={styles.stepsGrid}>
            {/* Step 1 */}
            <div style={styles.stepCard}>
              <div style={styles.stepIconContainer}>
                <div style={styles.stepIcon}>
                  <span>📅</span>
                </div>
                <div style={styles.stepSinglePerson}>
                  <span style={{color: 'white', fontSize: '1.25rem'}}>👤</span>
                </div>
              </div>
              <h3 style={styles.stepTitle}>Schedule a pickup</h3>
              <p style={styles.stepDescription}>
                Choose your preferred date and time for waste collection
              </p>
            </div>

            {/* Step 2 */}
            <div style={styles.stepCard}>
              <div style={styles.stepIconContainer}>
                <div style={styles.stepIcon}>
                  <span>🚛</span>
                </div>
                <div style={styles.stepPersons}>
                  <div style={styles.stepPerson}>
                    <span style={{color: 'white', fontSize: '0.875rem'}}>👤</span>
                  </div>
                  <div style={styles.stepPerson}>
                    <span style={{color: 'white', fontSize: '0.875rem'}}>👤</span>
                  </div>
                </div>
              </div>
              <h3 style={styles.stepTitle}>Pickup at your address</h3>
              <p style={styles.stepDescription}>
                Our team will collect your waste from your doorstep
              </p>
            </div>

            {/* Step 3 */}
            <div style={styles.stepCard}>
              <div style={styles.stepIconContainer}>
                <div style={styles.stepIcon}>
                  <span>💳</span>
                </div>
                <div style={styles.stepSinglePerson}>
                  <span style={{color: 'white', fontSize: '1.25rem'}}>💰</span>
                </div>
              </div>
              <h3 style={styles.stepTitle}>Receive payment</h3>
              <p style={styles.stepDescription}>
                Get paid instantly for your recyclable materials
              </p>
            </div>
          </div>
        </div>
      </section>

<Footer/>
     
    </div>
 </> );
};

export default Aboutpage;