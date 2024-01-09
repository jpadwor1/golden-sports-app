'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Image from 'next/image';

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Regular Pool Cleaning',
    href: '/services/regular-cleaning',
    description:
      'Routine cleaning services including skimming, vacuuming, and brushing to keep your pool pristine.',
  },
  {
    title: 'Chemical Balancing',
    href: '/services/chemical-balancing',
    description:
      'Expert testing and adjustment of pool water chemicals to ensure a safe and balanced swimming environment.',
  },
  {
    title: 'Algae Treatment',
    href: '/services/algae-treatment',
    description:
      'Effective solutions for algae removal and prevention, keeping your pool clean and clear.',
  },
  {
    title: 'Tile and Deck Cleaning',
    href: '/services/tile-deck-cleaning',
    description:
      'Specialized cleaning for pool tiles and decks to remove dirt, grime, and mildew, ensuring a spotless pool area.',
  },
  {
    title: 'Pool Opening & Closing',
    href: '/services/opening-closing',
    description:
      'Seasonal services to prepare your pool for the summer and winterize it for the off-season.',
  },
];

export default function NavbarMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className='bg-transparent'>What We Do</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
              <li className='row-span-3'>
                <NavigationMenuLink asChild>
                  <a
                    className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md'
                    href='/about'
                  >
                    <Image
                      src='/logo.png'
                      width={80}
                      height={80}
                      alt='Always Clean'
                    />
                    <div className='mb-2 text-lg font-medium'>Always Clean</div>
                    <p className='text-sm leading-tight text-muted-foreground'>
                      Expert Pool Cleaning for a Sparkling, Hassle-Free Summer.
                      Honest. Reliable. Affordable.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href='/services' title='Our Services'>
                Comprehensive Pool Maintenance & Repair Services. Quality You
                Can Trust.
              </ListItem>
              <ListItem href='/process' title='Our Process'>
                A Step-by-Step Guide to Our Professional Pool Cleaning Process.
                Efficiency and Transparency.
              </ListItem>
              <ListItem href='/testimonials' title='Testimonials'>
                Hear From Our Satisfied Customers. Quality Service Guaranteed.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>What We Offer</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid w-[300px] gap-3 p-4 md:w-[400px] md:grid-cols-2 lg:w-[500px] '>
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

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
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className='text-sm font-medium leading-none'>{title}</div>
          <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
