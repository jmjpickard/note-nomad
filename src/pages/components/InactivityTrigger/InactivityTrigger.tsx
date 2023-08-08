import { useEffect } from "react";

interface InactivityTriggerProps {
  timeout: number;
  onInactive?: () => void;
}

const InactivityTrigger: React.FC<InactivityTriggerProps> = ({
  timeout,
  onInactive,
}) => {
  useEffect(() => {
    let activityTimeout: NodeJS.Timeout;

    const resetActivityTimeout = () => {
      if (activityTimeout) {
        clearTimeout(activityTimeout);
      }

      activityTimeout = setTimeout(() => {
        if (onInactive) {
          onInactive();
        }
      }, timeout);
    };

    const handleActivity = () => {
      resetActivityTimeout();
    };

    resetActivityTimeout();

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    return () => {
      if (activityTimeout) {
        clearTimeout(activityTimeout);
      }
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, [timeout, onInactive]);

  return null; // Renders nothing
};

export default InactivityTrigger;
