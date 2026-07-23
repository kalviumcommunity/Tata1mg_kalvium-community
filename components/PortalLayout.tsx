"use client";

import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { LogoutButton } from './LogoutButton';
import { Button } from './ui/button';

export type PortalNavItem<T extends string> = {
  id: T;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: number;
};

export interface PortalSidebarMeta {
  brandLabel: string;
  brandAccent?: string;
  brandTextColor: string;
  brandAccentColor: string;
  background: string;
  borderColor: string;
  userName: string;
  userRole: string;
  userSubtitle: string;
  userIcon: React.ReactNode;
  userIconBg: string;
  navTextColor: string;
  navHoverBg: string;
  activeBg: string;
  activeTextColor: string;
}

interface PortalLayoutProps<T extends string> {
  title: string;
  activeView: T;
  onNavItemClick: (id: T) => void;
  navItems: Array<PortalNavItem<T>>;
  notificationCount?: number;
  onNotificationClick?: () => void;
  children: React.ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarMeta: PortalSidebarMeta;
  footer?: React.ReactNode;
}

export function PortalLayout<T extends string>({
  title,
  activeView,
  onNavItemClick,
  navItems,
  notificationCount = 0,
  onNotificationClick,
  children,
  sidebarOpen,
  setSidebarOpen,
  sidebarMeta,
  footer,
}: PortalLayoutProps<T>) {
  const Sidebar = () => (
    <div
      style={{
        backgroundColor: sidebarMeta.background,
        width: '260px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: sidebarMeta.borderColor }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: sidebarMeta.brandAccentColor }}>
            {sidebarMeta.userIcon}
          </div>
          <span style={{ fontWeight: 700, color: sidebarMeta.brandTextColor, fontSize: '1rem' }}>
            {sidebarMeta.brandLabel}
            {sidebarMeta.brandAccent && (
              <span style={{ color: sidebarMeta.brandAccentColor }}>{sidebarMeta.brandAccent}</span>
            )}
          </span>
        </div>
      </div>

      <div className="p-4 border-b" style={{ borderColor: sidebarMeta.borderColor }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: sidebarMeta.userIconBg }}>
            {sidebarMeta.userIcon}
          </div>
          <div>
            <p style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>{sidebarMeta.userName}</p>
            <p style={{ color: sidebarMeta.userSubtitle ? '#A5F3FC' : '#94A3B8', fontSize: '0.75rem' }}>{sidebarMeta.userSubtitle || sidebarMeta.userRole}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.id === activeView;
          return (
            <button
              key={item.id}
              onClick={() => onNavItemClick(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
              style={{
                backgroundColor: isActive ? sidebarMeta.activeBg : 'transparent',
                color: isActive ? sidebarMeta.activeTextColor : sidebarMeta.navTextColor,
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = sidebarMeta.navHoverBg;
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: sidebarMeta.activeBg, color: 'white', minWidth: '20px', textAlign: 'center' }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t" style={{ borderColor: sidebarMeta.borderColor }}>
        {footer ?? <LogoutButton className="w-full justify-center" />}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setSidebarOpen(false)}></div>
          <div className="relative z-50">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3 flex items-center gap-3">
          <button className="lg:hidden p-2 rounded-xl hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <p style={{ fontWeight: 600, color: '#1A1A2E', fontSize: '0.95rem' }}>{title}</p>
          </div>
          {onNotificationClick && (
            <button className="relative p-2 rounded-xl hover:bg-gray-100" onClick={onNotificationClick}>
              <Bell className="w-5 h-5 text-gray-600" />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: '#FF6B6B' }}></span>
              )}
            </button>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
