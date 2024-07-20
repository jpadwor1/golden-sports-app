import { ExtendedUser } from '@/types/types';
import React from 'react';

interface MemberListProps {
  user: ExtendedUser;
  groupId: string;
}

const MemberList = ({ user, groupId }: MemberListProps) => {
  return (
    <div className='flex flex-row space-x-2'>
  <div className='bg-white rounded-md h-screen'></div>
  <div className='bg-white rounded-md h-screen md:flex md:flex-col hidden'>
    <div>
        import from excel
    </div>
    <div>
        invite to group with link
    </div>
  </div>

    </div>
);
};

export default MemberList;
