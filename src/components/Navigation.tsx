'use client';

interface NavigationProps {
  activeTab: 'plan' | 'shopping' | 'settings';
  onTabChange: (tab: 'plan' | 'shopping' | 'settings') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'plan' as const, label: 'Wochenplan', icon: '📅' },
    { id: 'shopping' as const, label: 'Einkaufen', icon: '🛒' },
    { id: 'settings' as const, label: 'Einstellungen', icon: '⚙️' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-700 dark:bg-gray-900/80"
      role="navigation"
      aria-label="Hauptnavigation"
    >
      <div className="mx-auto flex max-w-lg justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-1 flex-col items-center gap-1 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
              activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <span className="text-xl" aria-hidden="true">
              {tab.icon}
            </span>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
      {/* Safe area for iOS */}
      <div className="h-safe-bottom bg-white dark:bg-gray-900" />
    </nav>
  );
}
