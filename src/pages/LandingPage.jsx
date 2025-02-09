import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <Hero />
      <div className="mt-8">
        <Link
          to="/login"
          className="mr-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Get Started
        </Link>
        <Link
          to="/learn-more"
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;