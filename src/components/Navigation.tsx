'use client';

import { motion } from 'framer-motion';
import { Calendar, ShoppingCart, Settings, BarChart3, MessageCircle } from 'lucide-react';

interface NavigationProps {
  activeTab: 'plan' | 'shopping' | 'chat' | 'statistics' | 'settings';
  onTabChange: (tab: 'plan' | 'shopping' | 'chat' | 'statistics' | 'settings') => void;
}

const tabs = [
  { id: 'plan' as const, label: 'Mahlzeit', icon: Calendar },
  { id: 'shopping' as const, label: 'Einkauf', icon: ShoppingCart },
  { id: 'chat' as const, label: 'Chat', icon: MessageCircle },
  { id: 'statistics' as const, label: 'Statistik', icon: BarChart3 },
  { id: 'settings' as const, label: 'Mehr', icon: Settings },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      role="navigation"
      aria-label="Hauptnavigation"
    >
      <div className="border-t border-[var(--separator)] bg-[var(--background)]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-lg">
          {/* Tab Buttons */}
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isChat = tab.id === 'chat';

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Active Background Highlight */}
                  {isActive && !isChat && (
                    <motion.div
                      layoutId="nav-highlight"
                      className="absolute inset-x-2 top-1.5 bottom-[calc(0.375rem+env(safe-area-inset-bottom))] rounded-xl bg-[var(--system-blue)]/10"
                      transition={{ type: 'spring' as const, stiffness: 400, damping: 30 }}
                    />
                  )}

                  {isChat ? (
                    <div
                      className={`relative flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                        isActive
                          ? 'bg-[var(--system-green)] text-white'
                          : 'bg-[var(--system-green)]/15 text-[var(--system-green)]'
                      }`}
                    >
                      <Icon size={16} strokeWidth={2.5} aria-hidden="true" />
                    </div>
                  ) : (
                    <div className="relative">
                      <Icon
                        size={22}
                        strokeWidth={isActive ? 2.5 : 1.8}
                        aria-hidden="true"
                        className={`transition-colors ${
                          isActive
                            ? 'text-[var(--system-blue)]'
                            : 'text-[var(--gray-1)]'
                        }`}
                      />
                    </div>
                  )}
                  <span
                    className={`relative text-[10px] font-semibold transition-colors ${
                      isChat
                        ? isActive
                          ? 'text-[var(--system-green)]'
                          : 'text-[var(--system-green)]/70'
                        : isActive
                        ? 'text-[var(--system-blue)]'
                        : 'text-[var(--gray-1)]'
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
