import { useState } from "react";
import MenuBuilderComponent from "react-dnd-menu-builder";


interface MenuItem {
  id: string;
  name: string;
  href: string;
  children: MenuItem[];
}


const initialMenus: MenuItem[] = [
    {
      id: "Home",
      name: "Главная",
      href: "/home",
      children: [],
    },
    {
      id: "Collections",
      href: "/collections",
      name: "Коллекции",
      children: [
        {
          id: "Spring",
          name: "Весна",
          href: "/spring",
          children: [
                {
                id: "Spring_1",
                name: "Весна 1",
                href: "/spring/1",
                children: [],
                },
          ],
        },
      ],
    },
  ];
  
  const initialFormData = {
    id: "",
    name: "",
    href: "",
    children: [],
  };


function MenuBuilder() {
  const [menus, setMenus] = useState<MenuItem[]>(initialMenus as MenuItem[]);
  const [formData, setFormData] = useState(initialFormData);

  const addMenu = () => {
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
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
        onClick={() => {
          addMenu();
        }}
      >
        Добавить пункт меню
      </button>
    </div>
  );
}

export default MenuBuilder;
