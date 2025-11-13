import React from 'react';
import './LoadingScreen.css';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <h2 className="loading-title">Generating Your Portfolio...</h2>
      <p className="loading-text">
        Please wait a moment. We're saving your configuration and preparing your
        new portfolio.
      </p>
    </div>
  );
};