import { Button } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList
} from '@/components/ui/navigation-menu';
import { Home, Menu, Settings, User, X } from 'lucide-react';
import React, { useState } from 'react';

interface NavbarProps {
  brandName?: string;
}

const Navbar: React.FC<NavbarProps> = ({ brandName = 'MyApp' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { 
      label: 'Home', 
      href: '/', 
      icon: <Home className="mr-2 h-4 w-4" /> 
    },
    { 
      label: 'Profile', 
      href: '/profile', 
      icon: <User className="mr-2 h-4 w-4" /> 
    },
    { 
      label: 'Settings', 
      href: '/settings', 
      icon: <Settings className="mr-2 h-4 w-4" /> 
    }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand Logo/Name */}
        <div className="text-xl font-bold text-gray-800">
          {brandName}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuLink 
                    href={item.href} 
                    className="flex items-center p-2 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    {item.icon}
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <Button variant="outline">Login</Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center w-full p-3 hover:bg-gray-100 rounded-md transition-colors"
              >
                {item.icon}
                {item.label}
              </a>
            ))}
            <Button className="w-full">Login</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;