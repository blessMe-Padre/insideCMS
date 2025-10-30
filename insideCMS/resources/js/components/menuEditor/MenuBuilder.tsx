import { Button } from "@/components/ui/button";
import { useState } from "react";
import MenuBuilderComponent from "react-dnd-menu-builder";

  const initialFormData = {
    id: "",
    name: "",
    href: "",
    children: [],
  };
  
interface MenuItem {
  id: string;
  name: string;
  href: string;
  children: MenuItem[];
}
  
function MenuBuilder({ initialMenus }: { initialMenus: MenuItem[] }) {
  const [menus, setMenus] = useState<MenuItem[]>(initialMenus as MenuItem[]);
  const [formData, setFormData] = useState(initialFormData);

  console.log('menus', menus);
  console.log('formData', formData);

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
