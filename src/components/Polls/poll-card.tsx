import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '../ui/separator';

export default function PollCard() {
  return (
    <Card className='w-full max-w-lg mx-auto mb-6'>
      <CardHeader className='flex items-start justify-between px-4 py-3 bg-white dark:bg-gray-800'>
        <div className='flex flex-row items-start gap-2'>
          <Avatar className='w-8 h-8'>
            <AvatarImage alt='@shadcn' src='/placeholder-avatar.jpg' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className='text-sm'>
            <div className='font-medium'>Olivia Davis</div>
            <div className='text-gray-500 dark:text-gray-400'>
              Posted 2 hours ago
            </div>
          </div>
        </div>
      </CardHeader>
      <Separator  />

      <CardContent className='px-6 py-8'>

        <h3 className='text-2xl font-bold mb-6'>
          What&apos;s your favorite programming language?
        </h3>
        <div className='grid gap-4'>
          <Button className='justify-start shadow-md' variant='outline'>
            JavaScript
          </Button>
          <Button className='justify-start shadow-md' variant='outline'>
            Python
          </Button>
          <Button className='justify-start shadow-md' variant='outline'>
            Java
          </Button>
          <Button className='justify-start shadow-md' variant='outline'>
            C#
          </Button>
        </div>

        <div className='text-center my-6'>
          <p className='text-gray-600'>Due by: Tomorrow</p>
        </div>
        <Separator />
        <div className='flex flex-row space-x-2 mt-4'>
        <Input type='text' placeholder='Write a comment...' />
        <Button className='bg-green-700' >Submit</Button>
        </div>
        
      </CardContent>
    </Card>
  );
}
