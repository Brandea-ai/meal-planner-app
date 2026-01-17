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
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  return (
    <nav
      className="fixed bottom-6 left-4 right-4 z-50"
      role="navigation"
      aria-label="Hauptnavigation"
    >
      <div className="glass-nav mx-auto max-w-lg p-2">
        {/* Sliding Indicator */}
        <motion.div
          className="absolute top-2 bottom-2 rounded-[22px] bg-[var(--background)] shadow-md"
          style={{
            width: `calc((100% - 16px) / 5)`,
          }}
          animate={{
            x: `calc(${activeIndex} * 100%)`,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 35,
          }}
        />

        {/* Tab Buttons */}
        <div className="relative flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isChat = tab.id === 'chat';

            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative z-10 flex flex-1 flex-col items-center justify-center gap-1 py-2.5"
                aria-current={isActive ? 'page' : undefined}
                whileTap={{ scale: 0.95 }}
              >
                {isChat ? (
                  <motion.div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      isActive
                        ? 'bg-[var(--system-green)] text-white'
                        : 'bg-[var(--system-green)]/20 text-[var(--system-green)]'
                    }`}
                    animate={{
                      scale: isActive ? 1.1 : 1,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 25,
                    }}
                  >
                    <Icon size={18} strokeWidth={2.5} aria-hidden="true" />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{
                      scale: isActive ? 1.15 : 1,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 25,
                    }}
                  >
                    <Icon
                      size={22}
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
                <motion.span
                  className={`text-[10px] font-semibold ${
                    isChat
                      ? 'text-[var(--system-green)]'
                      : isActive
                      ? 'text-[var(--system-blue)]'
                      : 'text-[var(--gray-1)]'
                  }`}
                  animate={{
                    opacity: isActive ? 1 : 0.8,
                  }}
                >
                  {tab.label}
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Safe area for iOS */}
      <div className="h-safe-bottom" />
    </nav>
  );
}
