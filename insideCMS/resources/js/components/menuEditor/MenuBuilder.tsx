import { Button } from "@/components/ui/button";
import MenuBuilderComponent from "react-dnd-menu-builder";

interface MenuItem {
  id: string;
  name: string;
  href: string;
  children: MenuItem[];
}

function MenuBuilder({ menus, setMenus, formData, setFormData }: { menus: MenuItem[]; setMenus: (menus: MenuItem[]) => void; formData: MenuItem; setFormData: (formData: MenuItem) => void }) {
  const addMenu = (e: React.FormEvent) => {
    e.preventDefault();
    setMenus([
      ...menus,
      {
        ...formData,
        id: Math.random().toString(36).substring(7),
      },
    ]);
    setFormData({ id: "", name: "", href: "", children: [] });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MenuBuilderComponent items={menus} setItems={setMenus} />
      <Button
        className="mt-4 w-sm"
        variant="outline"
        size="sm"
        onClick={(e: React.FormEvent) => {
          addMenu(e);
        }}
      >
        Добавить пункт меню
      </Button>
    </div>
  );
}

export default MenuBuilder;
