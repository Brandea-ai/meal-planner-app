'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Calendar,
  ShoppingCart,
  MessageCircle,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronDown,
  Sun,
  Moon,
  Users,
  QrCode,
  RotateCcw,
} from 'lucide-react';
import { MealType } from '@/types';

interface SidebarProps {
  activeTab: 'plan' | 'shopping' | 'chat' | 'statistics' | 'settings';
  onTabChange: (tab: 'plan' | 'shopping' | 'chat' | 'statistics' | 'settings') => void;
  mealType?: MealType;
  onMealTypeChange?: (type: MealType) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  tab?: 'plan' | 'shopping' | 'chat' | 'statistics' | 'settings';
  children?: MenuItem[];
  action?: () => void;
}

const sidebarVariants = {
  hidden: { x: '-100%' },
  visible: {
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: '-100%',
    transition: {
      duration: 0.2,
      ease: 'easeIn' as const,
    },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export function Sidebar({ activeTab, onTabChange, mealType, onMealTypeChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['plan']);

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleTabChange = (tab: 'plan' | 'shopping' | 'chat' | 'statistics' | 'settings') => {
    onTabChange(tab);
    setIsOpen(false);
  };

  const menuItems: MenuItem[] = [
    {
      id: 'plan',
      label: 'Mahlzeitenplan',
      icon: Calendar,
      tab: 'plan',
      children: [
        {
          id: 'breakfast',
          label: 'Frühstück',
          icon: Sun,
          action: () => {
            onMealTypeChange?.('breakfast');
            handleTabChange('plan');
          },
        },
        {
          id: 'dinner',
          label: 'Abendessen',
          icon: Moon,
          action: () => {
            onMealTypeChange?.('dinner');
            handleTabChange('plan');
          },
        },
      ],
    },
    {
      id: 'shopping',
      label: 'Einkaufsliste',
      icon: ShoppingCart,
      tab: 'shopping',
    },
    {
      id: 'chat',
      label: 'Familien-Chat',
      icon: MessageCircle,
      tab: 'chat',
    },
    {
      id: 'statistics',
      label: 'Statistik',
      icon: BarChart3,
      tab: 'statistics',
    },
    {
      id: 'settings',
      label: 'Einstellungen',
      icon: Settings,
      tab: 'settings',
      children: [
        {
          id: 'settings-portionen',
          label: 'Portionen',
          icon: Users,
          action: () => handleTabChange('settings'),
        },
        {
          id: 'settings-sync',
          label: 'Geräte verbinden',
          icon: QrCode,
          action: () => handleTabChange('settings'),
        },
        {
          id: 'settings-reset',
          label: 'Zurücksetzen',
          icon: RotateCcw,
          action: () => handleTabChange('settings'),
        },
      ],
    },
  ];

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const isActive = item.tab === activeTab;
    const isSubActive = item.id === mealType;

    return (
      <div key={item.id}>
        <motion.button
          variants={menuItemVariants}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else if (item.action) {
              item.action();
            } else if (item.tab) {
              handleTabChange(item.tab);
            }
          }}
          className={`flex w-full items-center justify-between rounded-[12px] px-4 py-3 text-left transition-colors ${
            level === 0 ? 'mb-1' : 'mb-0.5 ml-4'
          } ${
            isActive || isSubActive
              ? 'bg-[var(--system-blue)]/10 text-[var(--system-blue)]'
              : 'text-[var(--foreground)] hover:bg-[var(--fill-tertiary)]'
          }`}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            <item.icon
              size={level === 0 ? 22 : 18}
              className={isActive || isSubActive ? 'text-[var(--system-blue)]' : 'text-[var(--foreground-secondary)]'}
            />
            <span className={`font-medium ${level === 0 ? 'text-[15px]' : 'text-[14px]'}`}>
              {item.label}
            </span>
          </div>
          {hasChildren && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight size={18} className="text-[var(--foreground-tertiary)]" />
            </motion.div>
          )}
        </motion.button>

        {/* Children */}
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {item.children?.map((child) => renderMenuItem(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      {/* Burger Menu Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full glass-inner"
        aria-label="Menü öffnen"
        whileTap={{ scale: 0.95 }}
      >
        <Menu size={22} className="text-[var(--foreground)]" />
      </motion.button>

      {/* Sidebar Overlay & Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Panel */}
            <motion.aside
              className="fixed left-0 top-0 bottom-0 z-50 w-[280px] bg-[var(--background)] shadow-xl"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between border-b border-[var(--separator)] p-4 pt-safe">
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Menü
                </h2>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--fill-tertiary)]"
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={18} className="text-[var(--foreground-secondary)]" />
                </motion.button>
              </div>

              {/* Menu Items */}
              <motion.nav
                className="p-4 space-y-1"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                    },
                  },
                }}
              >
                {menuItems.map((item) => renderMenuItem(item))}
              </motion.nav>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--separator)] p-4 pb-safe">
                <p className="text-center text-xs text-[var(--foreground-tertiary)]">
                  7-Tage Mahlzeitenplan
                </p>
                <p className="text-center text-[10px] text-[var(--foreground-tertiary)]">
                  Albanisch · Deutsch · Französisch
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
