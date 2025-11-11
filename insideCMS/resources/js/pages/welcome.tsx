import { dashboard, login, register, reviews } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { renderComponent, type Component } from '@/utils/renderComponent';
import Search from '@/components/search/Search';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"

  interface Service {
    id: number;
    title: string;
    description: string;
    images: string[];
    components: Component[];
  }



export default function Welcome({ services }: { services: Service[] }) {
    const { auth, modules } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            
            <div className="dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full py-6 max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        <Link
                            href={reviews()}
                            className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                        >
                            Отзывы
                        </Link>     
                        {auth.user ? (
                            <>
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Личный кабинет
                            </Link>
                            {modules?.info?.is_active && (
                                <Link
                                    href="/info"
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Информация о пользователе
                                </Link>
                            )}
                            </>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Войти
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Регистрация
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <main className="py-6">
                    <div className="container">
                        <Carousel>
                            <CarouselContent>
                                <CarouselItem>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</CarouselItem>
                                <CarouselItem>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</CarouselItem>
                                <CarouselItem>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</CarouselItem>
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>
                </main>
            </div>


            <div className="container">
                <div className="mb-6">
                    <Search />
                </div>
                {services.map((service) => (
                    <div key={service.id}>
                        <h2>{service.title}</h2>
                        <p>{service.description}</p>
                        {service.components.map((component, index) => (
                            <div key={`${service.id}-${component.id ?? `idx-${index}`}`}>
                                {renderComponent(component)}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}
