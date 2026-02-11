"use client";

import { useState, useCallback } from "react";
import { BootSequence } from "@/components/BootSequence";
import { ThemeTransition } from "@/components/ThemeTransition";
import { useTheme } from "@/components/ThemeProvider";

export function PageEffects() {
  const [bootDone, setBootDone] = useState(false);
  const { toggleTheme } = useTheme();

  const onBootComplete = useCallback(() => {
    setBootDone(true);
  }, []);

  return (
    <>
      {!bootDone && <BootSequence onComplete={onBootComplete} />}
      <ThemeTransition onMidpoint={toggleTheme} />
    </>
  );
}
