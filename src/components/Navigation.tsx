'use client';

import { motion } from 'framer-motion';
import { Calendar, ShoppingCart, Settings, BarChart3, MessageCircle } from 'lucide-react';

interface NavigationProps {
  activeTab: 'plan' | 'shopping' | 'chat' | 'statistics' | 'settings';
  onTabChange: (tab: 'plan' | 'shopping' | 'chat' | 'statistics' | 'settings') => void;
}

const tabs = [
  { id: 'plan' as const, label: 'Plan', icon: Calendar },
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
      <div className="border-t border-[var(--separator)] bg-[var(--background)]/90 backdrop-blur-xl">
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
                  {isChat ? (
                    <motion.div
                      className={`flex h-7 w-7 items-center justify-center rounded-full ${
                        isActive
                          ? 'bg-[var(--system-green)] text-white'
                          : 'bg-[var(--system-green)]/20 text-[var(--system-green)]'
                      }`}
                      animate={{ scale: isActive ? 1.05 : 1 }}
                      transition={{ type: 'spring' as const, stiffness: 400, damping: 25 }}
                    >
                      <Icon size={16} strokeWidth={2.5} aria-hidden="true" />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      transition={{ type: 'spring' as const, stiffness: 400, damping: 25 }}
                    >
                      <Icon
                        size={20}
                        strokeWidth={isActive ? 2.5 : 2}
                        aria-hidden="true"
                        className={
                          isActive
                            ? 'text-[var(--system-blue)]'
                            : 'text-[var(--gray-1)]'
                        }
                      />
                    </motion.div>
                  )}
                  <span
                    className={`text-[10px] font-medium ${
                      isChat
                        ? 'text-[var(--system-green)]'
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
