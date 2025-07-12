import React from 'react';

const WhatsAppButton = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-green-600"
        title="Contact us on WhatsApp"
      >
        <img 
          src="/icons/whatsapp-icon.svg" 
          alt="WhatsApp" 
          className="w-8 h-8"
        />
      </a>
    </div>
  );
};

export default WhatsAppButton; 