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
      details: "Dhirubhai Ambani Institute of Information and Communication Technology, Gandhinagar, India"
    }
  ];

  const developingTeam = [
    {
      name: "Maulik Kansara",
      role: "Full-Stack Developer",
      image: require("./profileLogo.png")
    },
    {
      name: "Vraj Gandhi",
      role: "Full-Stack Contributor",
      image: require("./profileLogo.png")
    },
    {
      name: "Dev Vyas",
      role: "Frontend Developer",
      image: require("./profileLogo.png")
    }
  ];

  const testingTeam = [
    {
      name: "Rakshit Pandhi",
      role: "",
      image: require("./profileLogo.png")
    },
    {
      name: "Rit Tambodia",
      role: "",
      image: require("./profileLogo.png")
    },
    {
      name: "Ridham Patel",
      role: "",
      image: require("./profileLogo.png")
    },
    {
      name: "Nisarg Parmar",
      role: "",
      image: require("./profileLogo.png")
    }
  ];

  const systemDesigningTeam = [
    // Add system designing team members here
    {
      name: "Stuti Pandya",
      role: "",
      image: require("./profileLogo.png")
    },
    {
      name: "Harshil Parmar",
      role: "",
      image: require("./profileLogo.png")
    },
    {
      name: "Mausam Kamdar",
      role: "",
      image: require("./profileLogo.png")
    }
  ];

  return (
    <div className={styles.aboutContainer}>
      <SlidingBanner />
      
      {/* Contact Section */}
      <section className={styles.contactSection}>
        <h2> <center> Get in Touch </center> </h2>
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
        <h2> <center> Our Story </center></h2>
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
        <h2> <center> Fun Facts </center></h2>
        <div className={styles.factsList}>
          <div className={styles.factCard}>
            <h3>💻 Lines of Code Written</h3>
            <p>45000 (and countless cups of coffee)</p>
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
        <h1> Backed By </h1>
        <h2> Developing Team: </h2>
        <div className={styles.developerGrid}>
          {developingTeam.map((dev, index) => (
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

      <section className={styles.developerSection}>
        <h2>Testing Team:</h2>
        <div className={styles.developerGrid}>
          {testingTeam.map((dev, index) => (
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

      <section className={styles.developerSection}>
        <h2>System Designing Team:</h2>
        <div className={styles.developerGrid}>
          {systemDesigningTeam.map((dev, index) => (
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
