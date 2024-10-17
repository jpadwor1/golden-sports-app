"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CheckIcon, UserPlus } from "lucide-react";
import React from "react";
import { trpc } from "@/app/_trpc/client";
import { Group, Member } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { ExtendedEvent } from "@/types/types";

type GroupType = Group & {
  members: Member[];
};
interface InviteUserButtonProps {
  event: ExtendedEvent;
}
const InviteUserButton = ({ event }: InviteUserButtonProps) => {
  const router = useRouter();
  const groupId = event.groupId;
  const [memberSelectOpen, setMemberSelectOpen] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState<Member[]>([]);
  const { data, isLoading } = trpc.getGroup.useQuery(groupId);
  const addInvitees = trpc.addInvitees.useMutation();

  const handleUserSelect = (member: Member) => {
    if (selectedUsers.some((selected) => selected.id === member.id)) {
      setSelectedUsers(
        selectedUsers.filter((selected) => selected.id !== member.id)
      );
    } else {
      setSelectedUsers([...selectedUsers, member]);
    }
  };

  const handleSubmit = () => {
    addInvitees.mutate(
      {
        eventId: event.id,
        invitees: selectedUsers.map((user) => user.id),
      },
      {
        onSuccess: () => {
          setMemberSelectOpen(false);
          router.refresh();
        },
        onError: (error: any) => {
          toast({
            title: "Oops! Something went wrong.",
            description:
              "We couldn't add the invitees. Please try again later.",
            variant: "destructive",
          });
          console.error(error);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Button size="xs" variant="secondary" className="mr-2">
        <UserPlus className="mr-2 h-4 w-4" /> Add
      </Button>
    );
  }
  const group = data as GroupType;

  const members = group.members.filter(
    (member) =>
      !event.invitees.some(
        (invitee: { userId: string }) => invitee.userId === member.id
      )
  );
  return (
    <>
      <Button
        onClick={() => setMemberSelectOpen(true)}
        size="xs"
        variant="secondary"
        className="mr-2"
      >
        <UserPlus className="mr-2 h-4 w-4" /> Add
      </Button>

      {memberSelectOpen && (
        <Dialog open={memberSelectOpen} onOpenChange={setMemberSelectOpen}>
          <DialogTrigger
            className={cn(
              buttonVariants({
                size: "xs",
                variant: "secondary",
              })
            )}
          >
            <UserPlus className="mr-2 h-4 w-4" /> Add
          </DialogTrigger>
          <DialogContent className="overflow-y-auto max-h-[600px] min-h-[400px] min-w-[600px]">
            <DialogHeader className="">
              <DialogTitle>Select recipients </DialogTitle>
              <DialogDescription>
                Select users to invite to this event.
              </DialogDescription>
            </DialogHeader>
            <div className="w-full min-h-[400px] border flex flex-row justify-between overflow-y-auto">
              <ScrollArea className="w-1/2">
                <ul className="flex flex-col space-y-1 p-1 mr-1">
                  {members.map((member) => (
                    <li
                      key={member.id}
                      className={`flex items-center gap-3 p-2 w-full rounded-lg cursor-pointer transition-colors ${
                        selectedUsers.some(
                          (selected) => selected.id === member.id
                        )
                          ? "bg-blue-50 dark:bg-gray-800"
                          : "hover:bg-blue-50 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => handleUserSelect(member)}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={member.imageURL ? member.imageURL : ""}
                          alt={member.firstName}
                        />
                        <AvatarFallback>
                          {member.firstName[0] + member.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="text-sm">
                          {member.firstName} {member.lastName}
                        </h4>
                      </div>
                      {selectedUsers.some(
                        (selected) => selected.id === member.id
                      ) ? (
                        <div className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center">
                          <CheckIcon className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="bg-white border rounded-full w-5 h-5 flex items-center justify-center"></div>
                      )}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
              <div className="w-1/2 p-2 flex flex-col bg-gray-200">
                <div className="flex flex-row items-center justify-between">
                  <h3>Selected</h3>
                  <p>{selectedUsers.length}</p>
                </div>
                <Separator className="bg-black" />
                <ul className="flex flex-col gap-2">
                  {selectedUsers.map((selected) => (
                    <li
                      key={selected.id}
                      className="flex items-center gap-3 p-3 rounded-lg"
                    >
                      {selected.firstName} {selected.lastName}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={handleSubmit}
                size="sm"
                className="bg-green-700"
              >
                Invite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default InviteUserButton;
