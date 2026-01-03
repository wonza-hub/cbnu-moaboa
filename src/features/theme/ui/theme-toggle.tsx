"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/shared/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-2 opacity-0">
        <Button variant="outline" size="icon" disabled>
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        </Button>
        <Button variant="outline" size="icon" disabled>
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        </Button>
        <Button variant="outline" size="icon" disabled>
          <Monitor className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant={theme === "light" ? "default" : "outline"}
        size="icon"
        onClick={() => setTheme("light")}
        aria-label="라이트 모드"
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
      <Button
        variant={theme === "dark" ? "default" : "outline"}
        size="icon"
        onClick={() => setTheme("dark")}
        aria-label="다크 모드"
      >
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      </Button>
      <Button
        variant={theme === "system" ? "default" : "outline"}
        size="icon"
        onClick={() => setTheme("system")}
        aria-label="시스템 설정"
      >
        <Monitor className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    </div>
  );
}
