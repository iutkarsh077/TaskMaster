"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, CheckSquare, LogOut, Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Logout } from "../../actions/Logout"
import { usePathname, useRouter } from "next/navigation"

const NavItem = ({ href, icon: Icon, children }: { href: string; icon: React.ElementType; children: React.ReactNode }) => (
  <Link 
    href={href} 
    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
  >
    <Icon size={18} />
    <span>{children}</span>
  </Link>
)

const Navbar = () => {
  const router = useRouter();
  const path = usePathname();
  const handleLogout = async() =>{
    try {
      const res = await Logout();
      if(res.status === false){
        throw new Error(res.msg);
      }
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <nav className={`sticky top-0 z-10 bg-white/80 backdrop-blur-md ${["/login", "/sign-up"].includes(path) ? "hidden" : "relative"}
`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl font-bold text-gray-900">TaskMaster</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <NavItem href="/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>
            <NavItem href="/" icon={CheckSquare}>Task List</NavItem>
            <Button variant="outline" size="lg" className="ml-4" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <nav className="flex flex-col gap-4">
                  <NavItem href="/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>
                  <NavItem href="/" icon={CheckSquare}>Task List</NavItem>
                  <Button variant="outline" size="sm" className="justify-start" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

