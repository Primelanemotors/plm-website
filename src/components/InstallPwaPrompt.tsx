import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallPwaPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if running as installed standalone PWA
    const isRunningStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isRunningStandalone);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Do not show if already running in standalone mode or dismissed by user
  if (isStandalone || dismissed || !deferredPrompt) {
    return null;
  }

  return (
    <div className="mx-4 mb-4 bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700/80 rounded-xl p-3 flex items-center justify-between text-white shadow-xl">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-white text-black font-black text-sm flex items-center justify-center shadow">
          PLM
        </div>
        <div>
          <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
            Install PLM Command Centre
            <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-black px-1.5 py-0.2 rounded border border-emerald-500/30 uppercase">
              PWA
            </span>
          </div>
          <div className="text-[11px] text-zinc-400">Add to home screen for 1-tap dialer & offline access</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1.5 text-zinc-400 hover:text-white text-xs"
          aria-label="Dismiss banner"
        >
          ✕
        </button>
        <button
          type="button"
          onClick={handleInstallClick}
          className="px-3 py-1.5 text-xs font-extrabold bg-white text-black hover:bg-zinc-200 rounded-lg transition-colors shadow"
        >
          Install
        </button>
      </div>
    </div>
  );
};

export default InstallPwaPrompt;
