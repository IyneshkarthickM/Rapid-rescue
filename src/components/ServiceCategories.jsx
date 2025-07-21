import React from 'react';
import './ServiceCategories.css';

const ServiceCategories = () => {
  const categories = [
    {
      title: 'Individual',
      description: 'Anyone can book ambulance through website and mobile app.',
      icon: 'person'
    },
    {
      title: 'Hospital',
      description: 'We manage the end-to-end operations of the ambulance fleet of the hospital.',
      icon: 'hospital'
    },
    {
      title: 'Enterprise',
      description: 'Medulance is working with different corporate and providing ambulance for them.',
      icon: 'enterprise'
    },
    {
      title: 'Government',
      description: 'Medulance is working with the Government on a Public Private Partnership and PSU.',
      icon: 'government'
    }
  ];

  return (
    <div className="service-categories-container">
      <div className="categories-grid">
        {categories.map((category, index) => (
          <div key={index} className="category-card">
            <div className={`category-icon ${category.icon}-icon`}></div>
            <h3 className="category-title">{category.title}</h3>
            <p className="category-description">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCategories;