import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background mt-auto">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-text-secondary">
        <p className="font-semibold text-red-600 mb-2">Disclaimer</p>
        <p className="text-sm max-w-2xl mx-auto">
          DermaVision is an experimental AI tool and not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
        </p>
      </div>
    </footer>
  );
};

export default Footer;