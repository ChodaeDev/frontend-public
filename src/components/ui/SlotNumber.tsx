'use client';

import { useState, useEffect } from 'react';

interface SlotNumberProps {
  value: number;
  locale: string;
  delay?: number;
  duration?: number;
  className?: string;
}

export default function SlotNumber({
  value,
  locale,
  delay = 0,
  duration = 1000,
  className,
}: SlotNumberProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const digits = value.toString().length;
    const max = Math.pow(10, digits);

    const start = () => {
      const begin = Date.now();

      const tick = () => {
        if (cancelled) return;

        const elapsed = Date.now() - begin;
        const progress = Math.min(elapsed / duration, 1);

        if (progress >= 1) {
          setDisplay(value);
          return;
        }

        const noise = Math.floor(Math.random() * max);
        setDisplay(Math.round((noise * (1 - progress)) + (value * progress)));

        const interval = 40 + (progress * 120);
        timeoutId = setTimeout(tick, interval);
      };

      tick();
    };

    if (delay > 0) {
      timeoutId = setTimeout(start, delay);
    } else {
      start();
    }

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [value, delay, duration]);

  return (
    <span className={className}>{display.toLocaleString(locale)}</span>
  );
}
