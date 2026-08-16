import React, { useState, useEffect } from "react";
import { Plus, Minus } from 'lucide-react';
import { Link } from "react-router-dom";

function Header({visits}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [textSize, setTextSize] = useState(14); // base font size in px

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const increaseText = () => setTextSize((prev) => Math.min(prev + 2, 24));
  const decreaseText = () => setTextSize((prev) => Math.max(prev - 2, 10));

  const formattedDate = currentTime.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <div className="bg-green-800 text-white px-4 sm:px-6 py-2 text-sm">
      <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto gap-2 sm:gap-0">
        
        {/* Left: Date & Time */}
        <div className="flex items-center space-x-2 text-xs sm:text-sm">
          <span>{formattedDate} | {currentTime.toLocaleDateString('en-US', { weekday: 'short' })} | {formattedTime}</span>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap sm:flex-nowrap items-center space-x-2 sm:space-x-6 text-xs sm:text-sm">
          
          {/* Skip to Main Content */}
          <Link 
            to="#features" 
            onClick={() => {
              const el = document.getElementById('features');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-green-200"
          >
            Skip to main content
          </Link>
          <span>|</span>

          {/* Screen Reader */}
          {/* <button 
            onClick={() => {
              const el = document.getElementById('main-content');
              if (el) el.focus();
            }}
            className="hover:text-green-200"
          >
            Screen Reader Access
          </button> */}
          {/* <span>|</span> */}

          {/* Text Size Controls */}
          {/* <div className="flex items-center space-x-1">
            <span>Text Size</span>
            <button onClick={decreaseText} className="hover:bg-green-700 p-1 rounded">
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs" style={{ fontSize: `${textSize}px` }}>A</span>
            <button onClick={increaseText} className="hover:bg-green-700 p-1 rounded">
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <span>|</span> */}

          {/* Color Theme Indicator */}
          <div className="flex items-center space-x-1">
            <div className="w-4 h-3 bg-orange-500"></div>
            <div className="w-4 h-3 bg-white"></div>
            <div className="w-4 h-3 bg-green-500"></div>
          </div>
          <span>|</span>


          <div className="flex items-center space-x-1">
            <span>Site visits : </span>
            <span>{visits}</span>
          </div>
          <span>|</span>

          {/* Language Toggle */}
          {/* <button className="hover:text-green-200">हिन्दी</button> */}
        </div>
      </div>
    </div>
  );
}

export default Header;
