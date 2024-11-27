import React from 'react';
import styles from './AboutUs.module.css';
import SlidingBanner from '../UserDashboard/SlidingBanner';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaGithub, FaLinkedin } from 'react-icons/fa';

const AboutUs = () => {
  const contactInfo = [
    {
      icon: <FaPhone />,
      title: "Phone",
      details: "+91 98765 43210"
    },
    {
      icon: <FaEnvelope />,
      title: "Email",
      details: "support@forkandfeast.com"
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Address",
      details: "Mumbai Institute of Technology, Mumbai, India"
    }
  ];

  const developers = [
    {
      name: "Student 1",
      role: "Frontend Developer",
      image: "/images/dev1.jpg"
    },
    {
      name: "Student 2",
      role: "Backend Developer",
      image: "/images/dev2.jpg"
    },
    {
      name: "Student 3",
      role: "UI/UX Designer",
      image: "/images/dev3.jpg"
    }
  ];

  return (
    <div className={styles.aboutContainer}>
      <SlidingBanner />
      
      {/* Contact Section */}
      <section className={styles.contactSection}>
        <h2>Get in Touch</h2>
        <div className={styles.contactGrid}>
          {contactInfo.map((info, index) => (
            <div key={index} className={styles.contactCard}>
              <div className={styles.iconWrapper}>{info.icon}</div>
              <h3>{info.title}</h3>
              <p>{info.details}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section className={styles.aboutSection}>
        <h2>Our Story</h2>
        <div className={styles.storyContent}>
          <p>
            Born from a midnight craving and a college deadline, Fork & Feast is what happens 
            when hungry engineering students decide to solve their dining dilemmas! 🍽️
          </p>
          <p>
            We're not just another food app – we're your culinary companion, born in the 
            hallowed halls of DA-IICT, where the only thing bigger than 
            our appetites was our determination to ace this project! 🎓
          </p>
          <p>
            Why "Fork & Feast"? Because "Hungry Students Making Food Apps" didn't sound as catchy! 
            Plus, we believe that every meal should be a feast, and every feast needs a good fork 
            (and maybe some code). 🍴
          </p>
          <p>
            Our mission? To make sure no student ever has to eat instant noodles when there's a 
            world of amazing restaurants out there! We're turning those "What should we eat?" 
            debates into "Where should we feast?" adventures! 🚀
          </p>
        </div>
      </section>

      {/* Fun Facts Section */}
      <section className={styles.funFactsSection}>
        <h2>Fun Facts</h2>
        <div className={styles.factsList}>
          <div className={styles.factCard}>
            <h3>💻 Lines of Code Written</h3>
            <p>42,000 (and countless cups of coffee)</p>
          </div>
          <div className={styles.factCard}>
            <h3>🍕 Pizza Consumed During Development</h3>
            <p>137 slices (we kept count!)</p>
          </div>
          <div className={styles.factCard}>
            <h3>⏰ All-Nighters Pulled</h3>
            <p>Too many to count</p>
          </div>
        </div>
      </section>

      {/* Developer Banner */}
      <section className={styles.developerSection}>
        <h2>Backed By</h2>
        <div className={styles.developerGrid}>
          {developers.map((dev, index) => (
            <div key={index} className={styles.developerCard}>
              <img src={dev.image} alt={dev.name} />
              <h3>{dev.name}</h3>
              <p>{dev.role}</p>
              <div className={styles.socialLinks}>
                <FaGithub />
                <FaLinkedin />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;