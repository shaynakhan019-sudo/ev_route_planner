import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeSelector from "./ThemeSelector";
import ModeToggle from "./ModeToggle";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <h1 className="min-w-0 flex-1 truncate text-base font-semibold sm:text-lg">
        EV Route Planner
      </h1>

      <div className="flex shrink-0 items-center gap-2">
        <ThemeSelector />
        <ModeToggle />
      </div>
    </header>
  );
}