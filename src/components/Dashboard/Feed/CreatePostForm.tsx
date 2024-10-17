"use client";

import { Member as User } from "@prisma/client";
import React, { ChangeEventHandler } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  CalendarCheck2,
  Image as ImageIcon,
  MessageCircleX,
  MinusCircle,
  VoteIcon,
  X,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/app/_trpc/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { startFileUpload } from "@/lib/actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import VideoThumbnail from "@/components/VideoThumbnail";
import { File as FileType } from "@prisma/client";

interface PostFormProps {
  user: {
    groupsAsCoach: {
      id: string;
      name: string;
      description: string | null;
      coachId: string;
      createdAt: Date;
      logoURL: string | null;
    }[];
    groupsAsMember: {
      id: string;
      name: string;
      description: string | null;
      coachId: string;
      createdAt: Date;
      logoURL: string | null;
    }[];
  } & User;
}

type Files = {
  key: string;
  downloadURL: string;
  groupId: string;
  fileType: string;
  fileName: string;
}[];

const CreatePostForm = ({ user }: PostFormProps) => {
  const router = useRouter();
  const [inputOpen, setInputOpen] = React.useState(false);
  const [groupId, setGroupId] = React.useState("");
  const [formData, setFormData] = React.useState({
    postBody: "",
    files: [] as Files,
    groupId: "",
  });
  const ref = React.useRef<HTMLDivElement>(null);
  const TextAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const userGroups = [...user.groupsAsCoach, ...user.groupsAsMember];
  const submitPost = trpc.createPost.useMutation();
  const addPost = trpc.createPost.useMutation();

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Check if the clicked area is outside the ref and not part of the select component
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        !(event.target as Element).closest(".select-class")
      ) {
        setInputOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  React.useEffect(() => {
    if (inputOpen && TextAreaRef.current) {
      TextAreaRef.current.focus();
    }
  }, [inputOpen]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "inherit"; // Reset the height
    e.target.style.height = `${e.target.scrollHeight}px`; // Set the height to scroll height
  };

  const handleIconClick = () => {
    fileInputRef.current?.click(); // Trigger click on the file input when icon is clicked
  };

  const removeImage = (fileId: string) => {
    // Remove image from formData
    setFormData({
      ...formData,
      files: formData.files.filter((file) => file.key !== fileId),
    });
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const uploadPromises = Array.from(files).map((file) =>
        startFileUpload({ file })
      );

      Promise.all(uploadPromises).then((results) => {
        const newFiles = results
          .map((res) => {
            return res ? { ...res, key: res.downloadURL, groupId: "" } : null;
          })
          .filter((res) => res !== null);

        setFormData((prevFormData) => ({
          ...prevFormData,
          files: [...prevFormData.files, ...(newFiles as Files)],
        }));
      });
    }
  };

  const onSubmit = () => {
    if (TextAreaRef.current) {
      const newFormData = {
        postBody: TextAreaRef.current.value,
        groupId: groupId,
        files: formData.files.map((file) => ({
          key: file.key,
          downloadURL: file.downloadURL,
          groupId: groupId,
          fileType: file.fileType,
          fileName: file.fileName,
        })),
      };

      addPost.mutate(newFormData, {
        onSuccess: () => {
          setFormData({ postBody: "", groupId: "", files: [] });
          setInputOpen(false);
          router.refresh();
        },
        onError: (error) => {
          toast({
            title: "Oops, something went wrong!",
            description: "Please try again later.",
          });
          console.log(error);
        },
      });
    }
  };
  return (
    <div
      ref={ref}
      className="flex flex-col w-full bg-white shadow-sm rounded-md items-center justify-center mb-6"
    >
      <div className="flex flex-row items-center justify-evenly w-full p-4">
        <Avatar>
          <AvatarImage
            src={user.imageURL ? user.imageURL : ""}
            alt="profile pic"
          />
          <AvatarFallback>
            {user.firstName[0] + user.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <Select
          onValueChange={(value) => setGroupId(value)}
          className="select-class"
        >
          <SelectTrigger
            className={cn(
              inputOpen ? "" : "hidden",
              "w-[250px] text-xs select-class ml-2 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 ring-0 ring-offset-0"
            )}
          >
            <SelectValue placeholder="Pick a Team to Post" />
          </SelectTrigger>
          <SelectContent className="select-class focus-visible:ring-0">
            {userGroups.map((group) => (
              <SelectItem
                className="select-class focus-visible:ring-0"
                key={group.id}
                value={group.id}
              >
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          readOnly
          value={formData.postBody}
          onClick={() => setInputOpen(true)}
          className={cn(
            inputOpen ? "opacity-0 pointer-events-none" : "flex",
            "rounded-full w-4/5 transition duration-100 ease-in-out focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
          )}
          placeholder="What's on your mind?"
        />
      </div>
      <div
        className={cn(
          inputOpen ? "flex" : "hidden",
          "flex-col w-full px-6 h-30 min-h-fit transition-all duration-100 ease-in-out mb-6"
        )}
      >
        <Textarea
          required
          ref={TextAreaRef}
          name="postBody"
          value={formData.postBody}
          onChange={(e) =>
            setFormData({ ...formData, postBody: e.target.value })
          }
          onInput={handleInput}
          placeholder="What's on your mind?"
          className="rounded-none focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 resize-none border-none min-h-fit overflow-hidden"
        />
        {formData.files.length > 0 && (
          <div className="flex flex-row">
            {formData.files.map((file) => (
              <div key={file.key} className="relative mr-1 mt-2 rounded-sm">
                {file.fileType.includes("video") ? (
                  <>
                    <VideoThumbnail
                      width={100}
                      height={100}
                      videoFile={file}
                      className="relative rounded-sm"
                    />
                    <X
                      onClick={() => removeImage(file.key)}
                      className="absolute top-1 right-1 h-6 w-6 text-red-600"
                    />
                  </>
                ) : (
                  <>
                    <Image
                      alt=""
                      height={100}
                      width={100}
                      src={file.downloadURL}
                      className="relative rounded-sm"
                    />
                    <X
                      onClick={() => removeImage(file.key)}
                      className="absolute top-1 right-1 h-6 w-6 text-red-600"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-row justify-between mt-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <ImageIcon
                  className="text-gray-400 h-5 w-5"
                  onClick={handleIconClick}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Add media</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            onClick={onSubmit}
            disabled={formData.postBody.length === 0}
            size="xs"
            className="self-end max-w-fit rounded-full bg-blue-600 disabled:bg-gray-200 hover:bg-blue-400 disabled:text-gray-600"
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostForm;
