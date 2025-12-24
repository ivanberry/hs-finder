
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
      <div className="px-6 py-3 border-b border-gray-200">
        Global Harmonized System (HS) Database
      </div>
      <div className="flex flex-wrap items-center justify-between px-6 py-3">
        <div className="flex space-x-6">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Customs Guide</a>
          <a href="#" className="hover:underline">WCO Information</a>
        </div>
        <div className="flex space-x-6 mt-2 sm:mt-0">
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Settings</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
