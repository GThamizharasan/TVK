
import React from 'react';

const NewsTicker: React.FC = () => {
  const news = [
    "TVK State Conference to be held in Vikravandi this month.",
    "Join the movement: Dial *100# for membership enrollment.",
    "Education for all is our primary mission - Thalapathy Vijay.",
    "Tamil Nadu's future starts with TVK. Be part of the change.",
  ];

  return (
    <div className="bg-red-700 text-white py-2 overflow-hidden relative border-y border-red-800">
      <div className="flex whitespace-nowrap news-ticker-animation">
        {news.concat(news).map((item, index) => (
          <span key={index} className="mx-8 font-semibold uppercase tracking-wider flex items-center">
            <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;
