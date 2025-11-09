import React, { useState, useEffect } from 'react';
import GroundCard from './GroundCard';
import './GroundsList.css';

const GroundsList = () => {
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch grounds from your API
    fetchGrounds();
  }, []);

  const fetchGrounds = async () => {
    try {
      // TODO: Replace with your actual API endpoint
      // const response = await fetch('/api/grounds');
      // const data = await response.json();
      // setGrounds(data);

      // MOCK DATA - Replace this with your API call
      const mockData = [
        {
          id: 1,
          name: 'Arena Sports Complex',
          location: 'F-7 Markaz, Islamabad',
          duration: 90,
          price: 3000,
          image: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=800&q=80',
          isAvailable: true
        },
        {
          id: 2,
          name: 'Green Field Football Club',
          location: 'G-9 Sector, Islamabad',
          duration: 90,
          price: 2500,
          image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80',
          isAvailable: true
        },
        {
          id: 3,
          name: 'Champions Ground',
          location: 'G-11 Markaz, Islamabad',
          duration: 90,
          price: 3500,
          image: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=800&q=80',
          isAvailable: true
        },
        {
          id: 4,
          name: 'Victory Sports Arena',
          location: 'F-10 Sector, Islamabad',
          duration: 90,
          price: 2800,
          image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
          isAvailable: true
        }
      ];

      setGrounds(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching grounds:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grounds-loading">
        <div className="loading-spinner"></div>
        <p>Loading grounds...</p>
      </div>
    );
  }

  return (
    <div className="grounds-list-container">
      <div className="grounds-header">
        <h1>Choose from 8 premium football grounds in Islamabad</h1>
        <p>Book your favorite sports ground in just a few clicks</p>
      </div>

      <div className="grounds-grid">
        {grounds.map((ground) => (
          <GroundCard key={ground.id} ground={ground} />
        ))}
      </div>
    </div>
  );
};

export default GroundsList;