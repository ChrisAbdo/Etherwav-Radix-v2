import React from 'react';
import { cn } from 'lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

import Link from 'next/link';
import Image from 'next/image';

const components: {
  title: string;
  href: string;
  description: string;
}[] = [
  {
    title: 'MovieGPT',
    href: '/projects/moviegpt',
    description:
      'An AI movie recommendation platform built with GPT-3 and Next.js.',
  },
  {
    title: 'GrammarScoreAI',
    href: '/projects/grammarscoreai',
    description:
      'An AI writing companion designed to help you improve your writing. Built with Next.js + GPT-3.',
  },
  {
    title: 'SmoothTalker',
    href: '/projects/smoothtalker',
    description: 'An AI pickup line generator built with GPT-3 and Next.js.',
  },
  {
    title: 'C. Elegans ML/AI @ NJIT',
    href: '/projects/njit',
    description:
      'A 6 week research project at NJIT where I built a biomimetic AI navigation system.',
  },
];

const NavMenu = () => {
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <NavigationMenu className="hidden items-center justify-center gap-8 text-sm font-medium lg:flex lg:w-0 lg:flex-1">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Discover</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-rose-500 to-indigo-700 p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    {/* <Icons.logo className="h-6 w-6 text-white" /> */}
                    <div className="avatar">
                      <div className="w-24 rounded-full"></div>
                    </div>
                    <div className="mt-4 mb-2 text-lg font-medium text-white">
                      Christopher Abdo
                    </div>
                    <p className="text-sm leading-tight text-white/90">
                      Full Stack Developer | Web3 Developer
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="https://www.github.com/chrisabdo" title="GitHub">
                View my projects on GitHub!
              </ListItem>
              <ListItem href="https://www.twitter.com/abdo_eth" title="Twitter">
                Follow me on Twitter to stay up to date with my latest projects!
              </ListItem>
              <ListItem
                href="https://www.linkedin.com/in/christopher-abdo/"
                title="LinkedIn"
              >
                Connect with me on LinkedIn!
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Radio</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[600px] gap-3 p-4 md:grid-cols-2 z-50">
              {components.map((component) => (
                <Link key={component.title} href={component.href}>
                  <ListItem title={component.title}>
                    {component.description}
                  </ListItem>
                </Link>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Upload
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavMenu;

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#B1BDC5] focus:bg-[#DADDE2] dark:hover:bg-[#303030] dark:focus:bg-[#303030]',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-sm leading-snug text-slate-500 line-clamp-2 dark:text-slate-400">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
