import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import Link from 'next/link';
import { User, Gem } from 'lucide-react';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/server';

interface UserAccountNavProps {
  email: string | undefined;
  imageUrl: string;
  name: string;
  role: string;
}

const UserAccountNav = async ({
  role,
  email,
  imageUrl,
  name,
}: UserAccountNavProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='overflow-visible'>
        <Button className='rounded-full h-8 w-8 aspect-square bg-slate-400'>
          <Avatar className='h-8 w-8 relative'>
            {imageUrl ? (
              <div className='relative aspect-square h-full w-full'>
                <Image
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  src={imageUrl}
                  alt='profile picture'
                  referrerPolicy='no-referrer'
                />
              </div>
            ) : (
              <AvatarFallback>
                <span className='sr-only'>{name}</span>
                <User className='h-4 w-4 text-gray-900' />
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-white' align='end'>
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-0.5 leading-none '>
            {name && <p className='font-medium text-sm text-black'>{name}</p>}
            {email && (
              <p className='w-[200px] truncate text-xs text-zinc-700'>
                {email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={role === 'USER' ? '/client' : '/profile'}>Profile</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          {email ? (
            <Link href='/profile/billing'>Manage billing</Link>
          ) : (
            <Link href='/pricing'>
              Upgrade <Gem className='ml-1 h-4 w-4 text-green-400' />
            </Link>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className='cursor-pointer' asChild>
          <LogoutLink>Logout</LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
