import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Download, RefreshCw } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface InstallPWAButtonProps {
  onInstallSuccess?: () => void;
  onInstallDismiss?: () => void;
}

const InstallPWAButton = ({
  onInstallSuccess,
  onInstallDismiss,
}: InstallPWAButtonProps) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(
    localStorage.getItem("pwaCanInstall") !== "false"
  );

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
      localStorage.setItem("pwaCanInstall", "true");
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setCanInstall(false);
      setDeferredPrompt(null);
      localStorage.setItem("pwaCanInstall", "false");
      onInstallSuccess?.();
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", () => {});
    };
  }, [onInstallSuccess]);

  const handleClick = async () => {
    if (!deferredPrompt) {
      console.warn("No install prompt available. Please reload the page or check PWA configuration.");
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setCanInstall(false);
        localStorage.setItem("pwaCanInstall", "false");
        onInstallSuccess?.();
      } else {
        onInstallDismiss?.();
      }
    } catch (error) {
      console.error("Error showing the PWA install prompt:", error);
    } finally {
      setDeferredPrompt(null);
    }
  };

  return canInstall ? (
    <Button
      variant="ghost"
      className="w-full justify-start gap-2 text-sm px-3 py-2 sm:text-base"
      onClick={handleClick}
      aria-label="Install app"
    >
      <Download className="w-4 h-4" />
      Install App
    </Button>
  ) : (
    <div className="w-full space-y-2 px-3 py-2">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Install option is unavailable. Please reload the page.
      </p>
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 text-sm sm:text-base"
        onClick={() => window.location.reload()}
        aria-label="Reload page to check install availability"
      >
        <RefreshCw className="w-4 h-4" />
        Reload Page
      </Button>
    </div>
  );
};

export default InstallPWAButton;
