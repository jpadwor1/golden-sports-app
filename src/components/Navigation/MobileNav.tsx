"use client";

import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { motion } from "framer-motion";

interface MobileNavProps {
  isLoggedIn: boolean;
}

const MobileNav = ({ isLoggedIn }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleOpen = () => setIsOpen((prev) => !prev);

  const pathName = usePathname();

  useEffect(() => {
    if (isOpen) toggleOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName]);

  const closeOnCurrent = (href: string) => {
    if (pathName === href) {
      toggleOpen();
    }
  };

  return (
    <div className="cursor-pointer sm:hidden">
      <Menu
        onClick={toggleOpen}
        className="relative z-40 w-5 h-5 text-zinc-700"
      />

      <motion.div
        className={cn(
          "fixed inset-0 z-50 min-h-screen transition-opacity duration-400 ease-in-out",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          transition: { duration: 0.3, delay: 0.2 },
        }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={cn(
            "absolute z-[1000] top-0 right-0 bottom-0 w-full bg-[#162233] transition-transform duration-400 ease-in-out"
          )}
          initial={{ transform: "translateX(100%)" }}
          animate={{ transform: "translateX(0)" }}
          exit={{ transform: "translateX(100%)" }}
        >
          <div className="flex justify-end p-4 mt-4">
            <X
              onClick={toggleOpen}
              className="w-6 h-6 text-white cursor-pointer mr-2"
            />
          </div>
          <nav className="p-4">
            <ul className="space-y-4 text-[20px] font-medium text-white tracking-wide">
              <li>
                <Link
                  href="/features"
                  onClick={() => closeOnCurrent("/features")}
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/team-sports"
                  onClick={() => closeOnCurrent("/team-sports")}
                >
                  Team Sports and Activities
                </Link>
              </li>
              <li>
                <Link href="/users" onClick={() => closeOnCurrent("/users")}>
                  Who uses Golden Sports
                </Link>
              </li>
              <li>
                <Link href="/about" onClick={() => closeOnCurrent("/about")}>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  onClick={() => closeOnCurrent("/resources")}
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  onClick={() => closeOnCurrent("/contact")}
                >
                  Contact
                </Link>
              </li>
              {isLoggedIn ? (
                <li>
                  <Link
                    className={cn(
                      buttonVariants(),
                      "bg-green-600 w-full rounded-full"
                    )}
                    href="/dashboard"
                    onClick={() => closeOnCurrent("/dashboard")}
                  >
                    Dashboard
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      className={cn(
                        buttonVariants(),
                        "bg-white text-black text-[14px] uppercase font-bold w-full rounded-full"
                      )}
                      href="/login"
                      onClick={() => closeOnCurrent("/login")}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      onClick={() => closeOnCurrent("/register")}
                    >
                      <Button className="bg-gradient-to-r from-green-400 to-green-800 text-[14px] uppercase font-bold w-full text-white rounded-full">
                        Try it, It's Free
                      </Button>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MobileNav;
