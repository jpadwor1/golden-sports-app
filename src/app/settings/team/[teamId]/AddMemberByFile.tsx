'use client';
import { Input } from '@/components/ui/input';
import React from 'react';
import Papa from 'papaparse';
import { trpc } from '@/app/_trpc/client';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

type Result = {
  data: string[];
};

interface AddMemberByFileProps {
  teamId: string;
}

type ParsedData = {
  name: string;
  email: string;
}[];

const AddMemberByFile = ({ teamId }: AddMemberByFileProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [parsedData, setParsedData] = React.useState<ParsedData>([]);

  const addMember = trpc.addTeamMember.useMutation();

  React.useEffect(() => {
  }, [parsedData]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    if (!e.target.files) return;
    const file = e.target.files[0];

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: function (results: Result) {
        const tempParsedData = results.data.map((member) => ({
          name: member[0],
          email: member[1],
        }));

        // Update state with all parsed data
        setParsedData(tempParsedData);

        // Now call addMember.mutate with the updated parsedData
        try {
          addMember.mutate(
            { member: tempParsedData, teamId: teamId },
            {
              onSuccess: async () => {
                toast({
                  title: 'Member Added Successfully',
                  description: `Member has been added to the team.`,
                });
                router.push(`/settings/team/${teamId}`);
              },
              onError: (error) => {
                toast({
                  title: 'Error',
                  description: error.message,
                });
                setIsLoading(false);
              },
            }
          );
        } catch (error) {
          console.log('error', error);
        }
      },
    });
  };
  return (
    <div>
      <Input
        className='border-2 border-dashed'
        type='file'
        accept='.csv'
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default AddMemberByFile;
