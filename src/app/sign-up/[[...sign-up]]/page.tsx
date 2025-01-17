import Footer from "@/components/Navigation/Footer";
import Navbar from "@/components/Navigation/Navbar";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100dvh-30rem)]">
        <SignUp />
      </div>
      <Footer />
    </>
  );
}
