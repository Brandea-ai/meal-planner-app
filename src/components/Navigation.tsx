'use client';

import { Calendar, ShoppingCart, Settings, BarChart3, MessageCircle } from 'lucide-react';

interface NavigationProps {
  activeTab: 'plan' | 'shopping' | 'chat' | 'statistics' | 'settings';
  onTabChange: (tab: 'plan' | 'shopping' | 'chat' | 'statistics' | 'settings') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'plan' as const, label: 'Plan', icon: Calendar },
    { id: 'shopping' as const, label: 'Einkauf', icon: ShoppingCart },
    { id: 'chat' as const, label: 'Chat', icon: MessageCircle },
    { id: 'statistics' as const, label: 'Statistik', icon: BarChart3 },
    { id: 'settings' as const, label: 'Mehr', icon: Settings },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--separator)] bg-[var(--background)]/80 backdrop-blur-xl"
      role="navigation"
      aria-label="Hauptnavigation"
    >
      <div className="mx-auto flex max-w-lg justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex min-h-[49px] flex-1 flex-col items-center justify-center gap-0.5 py-1 transition-none active:opacity-80 ${
                isActive
                  ? 'text-[var(--system-blue)]'
                  : 'text-[var(--gray-1)]'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                size={24}
                strokeWidth={isActive ? 2.5 : 2}
                aria-hidden="true"
              />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-safe-bottom bg-[var(--background)]" />
    </nav>
  );
}
