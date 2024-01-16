'use client';

import React from 'react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Group, User, UserRole } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AddMemberForm from './AddMemberForm';
import {
  Divide,
  Mail,
  MoreVertical,
  Plus,
  Trash,
  User as UserIcon,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AddMemberByFile from './AddMemberByFile';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { trpc } from '@/app/_trpc/client';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

interface TeamDetailsProps {
  coach: User | null;
  team: Group | null; // Allow null
  members: User[] | null | undefined;
}

const TeamDetails = ({ team, coach, members }: TeamDetailsProps) => {
  const router = useRouter();
  const [showAddMemberForm, setShowAddMemberForm] = React.useState(false);
  const [deleteAlert, setDeleteAlert] = React.useState(false);
  const deleteTeam = trpc.deleteTeam.useMutation();

  const handleDeleteTeam = (teamId: string) => {
    deleteTeam.mutate(teamId, {
      onSuccess: () => {
        toast({
          title: 'Team deleted',
          description: 'Your team has been deleted',
        });
        router.push('/settings/team');
        router.refresh();
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
        });
        router.push('/settings/team');
      },
    });
  };

  return (
    <div className='flex flex-col w-full bg-white shadow-md rounded-md h-full p-6'>
      <div className='flex flex-row justify-between'>
        <div className='flex flex-row items-center gap-2'>
          <Image
            src={team?.logoURL || '/GSlogo.png'}
            alt='Logo'
            width={100}
            height={100}
          />
          <div className='flex flex-col items-start'>
            <h1 className='text-2xl tex-gray-900 font-semibold tracking-wide'>
              {team?.name}
            </h1>
            <h2 className='text-md text-gray-600'>Coach {coach?.name}</h2>
            <h2 className='text-md text-gray-600'>{team?.description}</h2>
          </div>
        </div>
        <div className='flex flex-row items-start'>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical className='h-6 w-6 ' />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setShowAddMemberForm(true)}>
                <Plus className='h-4 w-4 text-gray-600 mr-2' /> Team Member
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteAlert(true)}>
                <Trash className='h-4 w-4 text-red-600 mr-2' />
                Delete Team
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {deleteAlert && (
        <Dialog open={deleteAlert}>
          <DialogContent className='w-[300px]'>
            
              
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription className='text-gray-600'>
                This will permanently delete the team and all associated data.
              </DialogDescription>
            <div className='flex flex-row justify-between mt-10'>
                <Button variant='ghost' onClick={() => setDeleteAlert(false)}>
                  Cancel
                </Button>

                <Button
                  variant='destructive'
                  onClick={() => handleDeleteTeam(team?.id ? team?.id : '')}
                >
                  Delete
                </Button>
              </div>
          </DialogContent>
        </Dialog>
      )}
      <Separator className='mt-2 mb-6' />
      {showAddMemberForm ? (
        <>
          <div className='flex flex-col items-center'>
            <h2 className='text-xl font-medium text-gray-900 tracking-wider mt-2'>
              Uploading a CSV document
            </h2>
            <p className='text-sm text-gray-500 font-medium tracking-wide'>
              Ensure only a name and email column exists in your document.
            </p>
            <p className='text-sm text-gray-500 font-medium tracking-wide mb-6'>
              Column headers must be removed as well.
            </p>
            <AddMemberByFile teamId={team?.id ? team?.id : ''} />
            <h2 className='text-2xl font-medium text-gray-900 tracking-wider mt-6 mb-2'>
              Or
            </h2>
            <h2 className='text-xl font-medium text-gray-900 tracking-wider mt-6 mb-2'>
              Add Manually
            </h2>
          </div>
          <AddMemberForm teamId={team?.id ? team?.id : ''} />
        </>
      ) : (
        <div className='flex flex-wrap items-center text-center justify-center'>
          <div className='flex flex-col items-center justify-center'>
            <h3 className='text-xl text-gray-900 font-semibold'>
              Team Members
            </h3>
            <Separator className='mt-2 mb-6 w-full' />
            <ScrollArea className='w-full'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className='text-gray-900 text-sm text-left'>
                        <p className=' text-gray-600'>Name</p>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className='text-gray-600 text-sm flex flex-row items-center'>
                        <Mail className='font-bold h-4 w-4 mr-2' />
                        <p className=' text-gray-600 text-sm'>Email</p>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className='text-gray-600 text-sm flex flex-row items-center'>
                        <Mail className='font-bold h-4 w-4 mr-2' />
                        <p className=' text-gray-600 text-sm'>Phone</p>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members?.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className='text-md font-medium text-gray-900 '>
                        <div className='flex flex-row items-center space-x-1'>
                          <Avatar className='h-8 w-8 relative'>
                            {member.imageURL ? (
                              <div className='relative aspect-square h-full w-full'>
                                <Image
                                  fill
                                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                                  src={member.imageURL}
                                  alt='profile picture'
                                  referrerPolicy='no-referrer'
                                />
                              </div>
                            ) : (
                              <AvatarFallback>
                                <span className='sr-only'>{member.name}</span>
                                <UserIcon className='h-4 w-4 text-gray-900' />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <p>{member.name}</p>
                        </div>
                      </TableCell>
                      <TableCell className=''>
                        <p className='text-center flex text-gray-900 font-medium'>
                          {member.email}
                        </p>
                      </TableCell>
                      <TableCell>
                        {member.phone ? member.phone : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetails;
