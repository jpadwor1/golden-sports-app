"use client";
import { trpc } from "@/app/_trpc/client";
import React, { useState } from "react";

const Page = () => {
  const [groupCode, setGroupCode] = useState("");
  const [error, setError] = useState("");

  const joinGroup = trpc.joinGroup.useMutation();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/group/join", {
        method: "POST",
        body: JSON.stringify({ groupCode }),
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <h1>Join a Group</h1>
      <form>
        <input type="text" placeholder="Group Code" />
        <button type="submit">Join</button>
      </form>
    </div>
  );
};

export default Page;
