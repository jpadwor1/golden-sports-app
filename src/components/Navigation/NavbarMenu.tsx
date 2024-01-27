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
} from '@/components/ui/navigation-menu';
import Image from 'next/image';

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Overview',
    href: '/features/overview',
    description:
      "A comprehensive summary of our platform's features, giving you a bird's-eye view of all functionalities.",
  },
  {
    title: 'Events',
    href: '/features/events',
    description:
      'Effortless event creation and management, ensuring your group stays active and engaged.',
  },
  {
    title: 'Invites & Reminders',
    href: '/features/invites-reminders',
    description:
      'Automated invites and reminders to keep your group members informed and punctual for all events.',
  },
  {
    title: 'File Storage',
    href: '/features/file-storage',
    description:
      "Secure and organized cloud storage for all your group's files, easily accessible by members.",
  },
  {
    title: 'Messaging',
    href: '/features/messaging',
    description:
      'Instant messaging capabilities for real-time communication within your group.',
  },
  {
    title: 'Payments',
    href: '/features/payments',
    description:
      'Convenient and secure payment processing for group subscriptions, events, and more.',
  },
];

export default function NavbarMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className='bg-transparent'>
            What We Do
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
              <li className='row-span-3'>
                <NavigationMenuLink asChild>
                  <a
                    className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md'
                    href='/about'
                  >
                    <Image
                      src='/GSlogo.png'
                      width={80}
                      height={80}
                      alt='Golden Sports'
                    />
                    <div className='mb-2 text-lg font-medium'>
                      Golden Sports
                    </div>
                    <p className='text-sm leading-tight text-muted-foreground'>
                      Simplify Your Sports Management with Golden Sports
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href='#' title='Features'>
              A comprehensive summary of our platform&apos;s features, giving you a bird&apos;s-eye view of all functionalities.
              </ListItem>
              <ListItem href='#' title='Who uses Golden Sports'>
                Be the coach that spends time on what matters most
              </ListItem>
              <ListItem href='#' title='Our Mission'>
                We believe these precious social activities ought to be easier.
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
                  href="#"
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
