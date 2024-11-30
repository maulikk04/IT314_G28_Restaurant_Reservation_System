import React, { useState, useEffect } from 'react';
import styles from './BecomeMember.module.css';
import SlidingBanner from '../UserDashboard/SlidingBanner';

const Membership = () => {
  const membershipPlans = [
    {
      tier: "Silver",
      price: "₹999/year", 
      color: "#C0C0C0",
      benefits: [
        "Priority table reservations",
        "10% discount on dining",
        
      ]
    },
    {
      tier: "Gold",
      price: "₹1999/year",
      color: "#FFD700", 
      benefits: [
        "VIP table reservations",
        "15% discount on dining",
        "24/7 priority support"
      ]
    },
    {
      tier: "Platinum",
      price: "₹3999/year",
      color: "#E5E4E2",
      benefits: [
        "Instant table reservations",
        "25% discount on dining", 
        "Dedicated concierge service",
        "Table bookings on festivals"
      ]
    }
  ];

  const handleSubscribe = (tier) => {
    // Handle subscription logic
    console.log(`Subscribing to ${tier} membership`);
  };

  return (
    <div className={styles.membershipContainer}>
      {/* Using the existing SlidingBanner component */}
      <SlidingBanner />

      {/* Membership Plans */}
      <div className={styles.plansContainer}>
        <h2>Choose Your Membership Plan</h2>
        <div className={styles.plansGrid}>
          {membershipPlans.map((plan) => (
            <div 
              key={plan.tier} 
              className={styles.planCard}
              style={{ borderColor: plan.color }}
            >
              <div 
                className={styles.planHeader}
                style={{ backgroundColor: plan.color }}
              >
                <h3>{plan.tier}</h3>
                <p className={styles.price}>{plan.price}</p>
              </div>
              <div className={styles.planBenefits}>
                <ul>
                  {plan.benefits.map((benefit, index) => (
                    <li key={index}> {benefit}</li>
                  ))}
                </ul>
              </div>
              <button 
                className={styles.subscribeBtn}
                onClick={() => handleSubscribe(plan.tier)}
                style={{ backgroundColor: plan.color }}
              >
                Subscribe Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Membership;