import {
    SidebarGroup,
    // SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            {/* <SidebarGroupLabel>Контент</SidebarGroupLabel> */}
            <SidebarMenu>
                {items.map((item) => {
                    const isActive = page.url.startsWith(
                        typeof item.href === 'string'
                            ? item.href
                            : item.href.url,
                    );

                    // Если есть подпункты, используем Collapsible
                    if (item.subItems && item.subItems.length > 0) {
                        return (
                            <Collapsible
                                key={item.title}
                                asChild
                                defaultOpen={isActive}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            tooltip={{
                                                children: item.title,
                                            }}
                                        >
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.subItems.map((subItem) => (
                                                <SidebarMenuSubItem
                                                    key={subItem.title}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={page.url.startsWith(
                                                            typeof subItem.href ===
                                                                'string'
                                                                ? subItem.href
                                                                : subItem.href
                                                                      .url,
                                                        )}
                                                    >
                                                        <Link
                                                            href={subItem.href}
                                                            prefetch
                                                        >
                                                            {subItem.icon && (
                                                                <subItem.icon />
                                                            )}
                                                            <span>
                                                                {subItem.title}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        );
                    }

                    // Обычный пункт меню без подпунктов
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
