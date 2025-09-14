import React from 'react';
import BottomNavigation from './BottomNavigation';
import TopActionBar from './TopActionBar';

interface AppLayoutProps {
  children: React.ReactNode;
  showTopActions?: boolean;
  onRefresh?: () => void;
  onNotifications?: () => void;
  notificationCount?: number;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  showTopActions = true,
  onRefresh,
  onNotifications,
  notificationCount = 0
}) => {
  return (
    <div className="min-h-[600px] w-[400px] bg-white flex flex-col h-[600px]">
      {/* Top Action Bar */}
      {showTopActions && (
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-2">
          <TopActionBar 
            onRefresh={onRefresh} 
            onNotifications={onNotifications}
            notificationCount={notificationCount}
          />
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
      
      {/* Bottom Navigation */}
      <div className="sticky bottom-0 z-20 bg-white border-t border-gray-100">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default AppLayout;