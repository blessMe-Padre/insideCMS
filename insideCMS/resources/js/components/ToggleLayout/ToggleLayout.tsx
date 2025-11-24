import { useEffect, useState } from "react";
import { Grid, List } from "lucide-react";

type Layout = "grid" | "list";

type ToggleLayoutProps = {
  targetSelector?: string; // можно не передавать, тогда ищем .items-layout
};

export default function ToggleLayout({ targetSelector = ".items-layout" }: ToggleLayoutProps) {
  const [layout, setLayout] = useState<Layout>("list");

  useEffect(() => {
    const el = document.querySelector<HTMLElement>(targetSelector);
    if (!el) return;

    el.classList.remove("items-layout--grid", "items-layout--list");
    el.classList.add(`items-layout--${layout}`);

    return () => {
      el.classList.remove("items-layout--grid", "items-layout--list");
    };
  }, [layout, targetSelector]);

  const handleLayout = (value: Layout) => {
    setLayout(value);
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <button
        type="button"
        title="Показать ввиде списка"
        className="cursor-pointer"
        onClick={() => handleLayout("list")}
      >
        <List className="w-5 h-5" />
      </button>
      <button
        type="button"
        title="Показать ввиде карточек"
        className="cursor-pointer"
        onClick={() => handleLayout("grid")}
      >
        <Grid className="w-5 h-5" />
      </button>
    </div>
  );
}