import { useEffect } from "react";

const useLockBodyScroll = (locked) => {
  useEffect(() => {
    if (locked) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [locked]);
};

export default useLockBodyScroll;
