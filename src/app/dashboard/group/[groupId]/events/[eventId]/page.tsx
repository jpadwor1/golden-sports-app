import React from "react";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { CalendarIcon, DollarSign, Loader2, MapPin, User2 } from "lucide-react";
import Image from "next/image";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import ParticipationButtons from "@/components/Dashboard/Events/buttons/participationButtons";
import MessageDialog from "@/components/Dashboard/Events/MessageDialog";
import ParticipationDialog from "@/components/Dashboard/Events/participation-status-dialog";
import EventButtons from "@/components/Dashboard/Events/buttons/event-buttons";
import { Separator } from "@/components/ui/separator";
import EventCommentInput from "@/components/Dashboard/Events/comments/event-comment-input";
import { getFileIcon } from "@/hooks/getIcon";
import { ExtendedEvent } from "@/types/types";
import MaxWidthWrapper from "@/components/Layout/MaxWidthWrapper";
import { currentUser } from "@clerk/nextjs/server";

interface PageProps {
  params: {
    groupId: string;
    eventId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const user = await currentUser();

  if (!user || !user.id) redirect("/auth-callback?origin=dashboard");

  const groupId = params.groupId;
  const eventId = params.eventId;
  const dbUser = await db.member.findFirst({
    where: {
      id: user.id,
    },
    include: {
      guardians: true,
    },
  });

  if (!dbUser) redirect("/auth-callback?origin=dashboard");

  const group = await db.group.findFirst({
    where: {
      id: groupId,
    },
  });

  const coach = await db.member.findFirst({
    where: {
      id: group?.contactPersonId,
    },
  });

  const event = await db.event.findFirst({
    where: {
      id: eventId,
    },
    include: {
      invitees: true,
      responses: true,
      comments: true,
      payments: true,
      group: true,
      files: true,
    },
  });

  if (!event || !group || !coach) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
          <h3 className="font-semibold text-xl">Setting up your account...</h3>
          <p>You will be redirected automatically.</p>
        </div>
      </div>
    );
  }

  const files = event.files.length > 0 ? event.files : [];

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const encodedAddress = encodeURIComponent(
    event.address ? event.address : "Hemet, CA"
  );

  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=12&size=600x300&maptype=roadmap&markers=color:green%7Clabel:A%7C${encodedAddress}&key=${apiKey}`;
  const eventStartDate = format(
    new Date(event.startDateTime),
    "EEEE, MMM dd  'at' hh:mm a"
  );
  const eventEndDate = event.endDateTime
    ? format(new Date(event.endDateTime), "EEEE, MMM dd 'at' hh:mm a")
    : null;
  let initials = "";
  if (
    dbUser &&
    dbUser.guardians.length > 0 &&
    dbUser.guardians[0].firstName.split(" ").length > 1
  ) {
    initials =
      dbUser?.guardians[0].firstName.split(" ")[0][0] +
      dbUser?.guardians[0].firstName.split(" ")[1][0];
  } else if (dbUser && dbUser.guardians.length > 0) {
    initials = dbUser?.guardians[0].firstName[0];
  }

  //TODO: We need to go through the event Response and map through acceptedIds, declinedIds, and unconfirmedIds to get the status of the user

  let participationStatus = "";
  if (event.responses?.acceptedIds.includes(dbUser?.id)) {
    participationStatus = "attending";
  } else if (event.responses?.declinedIds.includes(dbUser?.id)) {
    participationStatus = "declined";
  } else if (event.responses?.unconfirmedIds.includes(dbUser?.id)) {
    participationStatus = "unanswered";
  }

  const attending =
    event.responses!.acceptedIds!.length > 0
      ? event.responses?.acceptedIds
      : [];
  const declined =
    event.responses!.declinedIds!.length > 0
      ? event.responses?.declinedIds
      : [];
  const unanswered =
    event.responses!.unconfirmedIds!.length > 0
      ? event.responses?.unconfirmedIds
      : [];

  return (
    <MaxWidthWrapper>
      <div className="md:max-w-4xl max-w-screen mx-auto p-4 bg-white rounded-lg shadow">
        <div className="flex flex-col">
          <div className="mb-4">
            <Image
              alt="Map"
              className="w-full h-[250px] object-cover rounded-t-lg"
              height="300"
              src={mapUrl}
              style={{
                aspectRatio: "768/300",
                objectFit: "cover",
              }}
              width="768"
            />
          </div>
          <div className="flex flex-row justify-end">
            <EventButtons user={dbUser} event={event} />
          </div>
          <div className="mt-4 mb-6">
            <h1 className="text-2xl font-bold">{event.title}</h1>
          </div>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage
                  alt={
                    dbUser.guardians[0].firstName
                      ? dbUser.guardians[0].firstName
                      : dbUser.firstName + " " + dbUser.lastName
                  }
                  src={dbUser.imageURL ? dbUser.imageURL : ""}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <p className="font-semibold">Answering on behalf of</p>
                <p className="font-semibold text-indigo-600">
                  {dbUser?.firstName
                    ? dbUser.firstName
                    : dbUser.firstName + " " + dbUser.lastName}
                </p>
              </div>
            </div>
            <ParticipationButtons
              participation={participationStatus}
              userId={dbUser?.id}
              event={event}
            />
          </div>
          <div className="flex flex-col mb-4">
            <div className="flex items-center mb-2">
              <CalendarIcon className="text-gray-800 mr-2" />
              <p className="text-sm tracking-wide">
                {eventStartDate} {eventEndDate ? " - " + eventEndDate : ""}
              </p>
            </div>
            <div className="flex items-center mb-2">
              <MapPin className="text-gray-800 mr-2" />
              <Link
                href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
                target="_blank"
              >
                <p className="text-sm tracking-wide">{event.address}</p>
              </Link>
            </div>
            <div className="flex items-center mb-2">
              <User2 className="text-gray-800 mr-2" />
              <p className="text-sm tracking-wide">
                {group.name + " " + group.description}
              </p>
            </div>
            {event.totalFeeAmount !== null && (
              <div className="flex items-center">
                <DollarSign className="text-gray-800 mr-2" />
                <p className="text-md tracking-wide">
                  {event.totalFeeAmount.toFixed(2)}
                </p>
              </div>
            )}
          </div>
          <div className="mt-4 mb-8 px-4 py-4">
            <p>{event.description}</p>
          </div>

          {files.length > 0 && (
            <>
              <Separator />
              <div className="mb-8">
                <h3 className="text-lg font-medium my-2">Attachments</h3>
                <Separator className="mb-2" />

                <div className="grid grid-cols-2 gap-2">
                  {files.map((file, index) => (
                    <Link
                      href={file.url}
                      target="_blank"
                      key={index}
                      className="flex flex-row items-start border rounded-md p-2 my-2"
                    >
                      {getFileIcon(file.fileName)}
                      <p className="text-sm text-gray-500 truncate max-w-[200px]">
                        {file.fileName}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
          <div className="flex md:flex-row flex-col space-y-10 justify-between items-center mb-4">
            <MessageDialog />
            <ParticipationDialog
              eventId={eventId}
              attending={attending ?? []}
              declined={declined ?? []}
              unanswered={unanswered ?? []}
            />
          </div>
          {/* <EventCommentInput dbUser={dbUser} eventId={event.id} /> */}
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Page;
