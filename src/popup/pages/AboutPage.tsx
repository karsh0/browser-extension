import React from 'react';
import { FiChevronLeft, FiExternalLink, FiHeart, FiGithub, FiMail, FiGlobe } from 'react-icons/fi';

const AboutPage: React.FC = () => {
  const handleBack = () => {
    window.location.href = '#/more';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FiChevronLeft size={20} className="mr-1" />
            <span className="text-sm font-medium">Back</span>
          </button>
          
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-800">About BrowsePing</h1>
            <p className="text-sm text-gray-600">Socializing your browsing experience</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* App Info */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
            <span className="text-white text-3xl font-bold">BP</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">BrowsePing</h2>
          <p className="text-gray-600 mb-1">Socialize your presence, enhance your browsing</p>
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            Version 1.0.0
          </span>
        </div>

        {/* Description */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
          <p className="text-gray-700 leading-relaxed">
            BrowsePing transforms your solitary browsing into a vibrant social experience. Connect with friends, 
            share your digital presence, and discover what's capturing everyone's attention across the web. 
            Make browsing more interesting, engaging, and social while maintaining complete control over your privacy.
          </p>
        </div>

        {/* Features */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">What Makes Browsing Social</h3>
          <div className="space-y-3">
            {[
              {
                title: 'Social Presence',
                desc: 'Share your online activity with friends and see what they\'re exploring in real-time'
              },
              {
                title: 'Friend Discovery',
                desc: 'Connect with friends and build your social browsing network'
              },
              {
                title: 'Personal Analytics',
                desc: 'Analyze your browsing patterns, tab usage, and time spent online'
              },
              {
                title: 'Hourly Insights',
                desc: 'Discover your peak browsing hours and daily online patterns'
              },
              {
                title: 'Monthly Leaderboards',
                desc: 'Compare your online activity with friends and see who\'s most active'
              },
              {
                title: 'Privacy Control',
                desc: 'Complete control over what you share and who can see your activity'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">{feature.title}</div>
                    <div className="text-xs text-gray-600 mt-1">{feature.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vision */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-purple-800 mb-2">Our Vision</h3>
          <p className="text-sm text-purple-700">
            We believe browsing shouldn't be a lonely activity. BrowsePing brings the social element to your 
            digital exploration, helping you discover new content through your friends' interests while providing 
            valuable insights into your own online behavior.
          </p>
        </div>

        {/* Links */}
        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-gray-800">Get in Touch</h3>
          
            {[
            { icon: <FiGlobe size={18} />, label: 'Official Website', url: 'https://browseping.com', available: true },
            { icon: <FiGithub size={18} />, label: 'Source Code', url: 'https://github.com/browseping', available: true },
            ].map((link, index) => (
            <a
              key={index}
              href={link.available ? link.url : '#'}
              onClick={link.available ? undefined : (e) => e.preventDefault()}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              link.available 
                ? 'bg-white border border-gray-200 hover:border-blue-300 text-gray-800'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
              target={link.available ? "_blank" : undefined}
              rel={link.available ? "noopener noreferrer" : undefined}
            >
              <div className={`p-1 rounded ${link.available ? 'text-blue-600' : 'text-gray-400'}`}>
              {link.icon}
              </div>
              <span className="flex-1">{link.label}</span>
              {link.available ? (
              <FiExternalLink size={16} className="text-gray-400" />
              ) : (
              <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded">Coming Soon</span>
              )}
            </a>
            ))}
        </div>

        {/* Privacy Note */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-green-800 mb-2 flex items-center space-x-2">
            <FiHeart size={16} />
            <span>Privacy First</span>
          </h3>
          <p className="text-sm text-green-700">
            Your privacy is paramount. BrowsePing gives you granular control over your digital presence. 
            Choose what to share, with whom, and when. Your browsing data remains yours, and social features 
            are entirely opt-in with customizable privacy settings.
          </p>
        </div>

        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            © 2025 BrowsePing <br />
            Socializing your browsing experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;