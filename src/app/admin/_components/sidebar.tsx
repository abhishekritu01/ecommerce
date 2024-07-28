import React from 'react'
import Link from "next/link"
import {
    Bell,
    CircleUser,
    Home,
    HomeIcon,
    LineChart,
    Menu,
    Package,
    Package2,
    Search,
    ShoppingCart,
    Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"


const Sidebar = () => {

    /**
     * dashboard
     * Products       /admin/products
     * Warehouse    /admin/warehouse
     * Delivery Persons /admin/delivery-persons
     * Orders       /admin/orders
     * Inventory    /admin/inventory
     */

    const navItems = [
        { lable: 'Dashboard', icon: HomeIcon, href: '/admin' },
        { lable: 'Products', icon: Package2, href: '/admin/products' },
        { lable: 'Warehouse', icon: HomeIcon, href: '/admin/warehouse' },
        { lable: 'Delivery Persons', icon: CircleUser, href: '/admin/delivery-persons' },
        { lable: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
        { lable: 'Inventory', icon: LineChart, href: '/admin/inventory' },
    ]


    return (
   
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <Package2 className="h-6 w-6" />
                            <span className="">Acme Inc</span>
                        </Link>
                        <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">Toggle notifications</span>
                        </Button>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">

                            {
                                navItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                    >
                                        <item.icon className="h-5 w-5" />       
                                        {item.lable}
                                    </Link>
                                ))
                            }
                        </nav>
                    </div>

                </div>
            </div>

    )
}

export default Sidebar