'use client';
import React, { FormEvent } from 'react';
import {
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogContent,
  Dialog,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const MessageDialog = () => {
  const [message, setMessage] = React.useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(message);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Send message to host</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Send a message to the host</DialogTitle>
          <DialogDescription>
            Let the host know if you have any questions or comments.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className='grid gap-4 py-4'>
            <Textarea
              onChange={(e) => setMessage(e.target.value)}
              className='min-h-[100px]'
              placeholder='Write your message...'
            />
          </div>
          <DialogFooter>
            <Button type='submit'>Send message</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;
