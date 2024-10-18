import { Folder, Home, Users } from "lucide-react";
import { SideNavItem } from "./types";
import { db } from "@/db";
import { group } from "console";

export async function getGroups(userId: string) {
  const dbUser = await db.member.findFirst({
    where: {
      id: userId,
    },
    include: {
      groups: true
    },
  });

  if (!dbUser) {
    return [];
  }
  const groups = dbUser.groups;

  const SIDENAV_ITEMS: SideNavItem[] = [
    {
      title: "Home",
      path: "/",
      icon: <Home className="w-6 h-6" />,
    },
    {
      title: "Your Groups",
      path: `/group/${groups[0].id}`,
      icon: <Users className="w-6 h-6" />,
      submenu: true,
      subMenuItems: groups.map((group) => {
        return { title: group.name, path: `/group/${group.id}` };
      }),
    },
    {
      title: "Messages",
      path: "/messages",
      icon: <Folder className="w-6 h-6" />,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: <Folder className="w-6 h-6" />,
      submenu: true,
      subMenuItems: [
        { title: "Account", path: "/settings/account" },
        { title: "Privacy", path: "/settings/privacy" },
      ],
    },
    {
      title: "Help",
      path: "/help",
      icon: <Folder className="w-6 h-6" />,
    },
  ];

  return SIDENAV_ITEMS;
}

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Home",
    path: "/",
    icon: <Home className="w-6 h-6" />,
  },
  {
    title: "Your Groups",
    path: `/group`,
    icon: <Folder className="w-6 h-6" />,
    submenu: true,
    subMenuItems: [
      { title: "All", path: "/projects" },
      { title: "Web Design", path: "/projects/web-design" },
      { title: "Graphic Design", path: "/projects/graphic-design" },
    ],
  },
  {
    title: "Messages",
    path: "/messages",
    icon: <Folder className="w-6 h-6" />,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: <Folder className="w-6 h-6" />,
    submenu: true,
    subMenuItems: [
      { title: "Account", path: "/settings/account" },
      { title: "Privacy", path: "/settings/privacy" },
    ],
  },
  {
    title: "Help",
    path: "/help",
    icon: <Folder className="w-6 h-6" />,
  },
];
