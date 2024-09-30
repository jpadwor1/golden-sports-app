import React from "react";
import Link from "next/link";
import MaxWidthWrapper from "@/components/Layout/MaxWidthWrapper";
import { buttonVariants } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import MobileNav from "./MobileNav";
import UserAccountNav from "./UserAccountNav";
import NavbarMenu from "./NavbarMenu";
import { db } from "@/db";
import { cn } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";

const Navbar = async () => {
  const user = await currentUser();

  let dbUser;
  if (user) {
    dbUser = await db.user.findUnique({
      where: {
        id: user?.id,
      },
      include: {
        notifications: true,
      },
    });
  }

  return (
    <nav className="sticky h-20 inset-x-0 top-0 z-40 w-flow bg-white/60 backdrop-blur-lg transtion-all">
      <MaxWidthWrapper>
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex z-40 font-semibold">
            <Image
              className="w-12 h-auto"
              src="/GSlogo.png"
              width={300}
              height={222}
              alt="Always Clean"
            />
          </Link>

          <MobileNav isLoggedIn={!!user} />

          <div className="hidden items-center space-x-4 sm:flex">
            <NavbarMenu />
            {!user || !dbUser ? (
              <>
                <Link
                  href={`/sign-in`}
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  Login
                </Link>

                <Link
                  href={`/sign-up`}
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "bg-gradient-to-r from-[#00B3B6] to-green-600 rounded-full shadow-xl hover:scale-[0.96]"
                  )}
                >
                  Get Started <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
                <SignOutButton />
              </>
            ) : (
              <>
                <Link
                  href="/dashboard/group"
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  Dashboard
                </Link>
                <UserAccountNav
                  name="Your Account"
                  imageUrl={dbUser?.imageURL ?? ""}
                  email={user.primaryEmailAddress?.emailAddress ?? ""}
                  role="Customer"
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
