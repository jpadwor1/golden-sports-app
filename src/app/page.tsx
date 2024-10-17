import MaxWidthWrapper from "@/components/Layout/MaxWidthWrapper";
import Footer from "@/components/Navigation/Footer";
import Navbar from "@/components/Navigation/Navbar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />
      <MaxWidthWrapper className="main-bg-gradient-to-bottom shadow-lg">
        <section className="py-24 md:pt-36 bg-white overflow-hidden header-section-bg grainy">
          <div className="container px-4 mx-auto">
            <div className="flex flex-wrap items-center -mx-4">
              <div className="w-full md:w-1/2 px-4 mb-16 md:mb-0">
                <span className="inline-block py-px px-2 mb-4 text-xs leading-5 text-green-500 bg-green-100 font-medium rounded-full shadow-sm">
                  Sports Team Management
                </span>
                <h3 className="mb-4 text-4xl md:text-5xl leading-tight text-gray-900 font-bold tracking-tighter">
                  Simplify Your Sports Management with Golden Sports
                </h3>
                <p className="mb-6 text-lg md:text-xl text-gray-500 font-medium">
                  Golden Sports brings together group management, scheduling,
                  communication, and financial tools in one easy-to-use app.
                  Ideal for coaches, parents, and club administrators, our app
                  streamlines the management of sports teams and activities,
                  ensuring you focus more on the game and less on the logistics.
                </p>
                <div className="flex flex-wrap">
                  <div className="w-full md:w-auto mb-3 md:mb-0 md:mr-4">
                    <Link href="/client">
                      <Image
                        height={150}
                        width={150}
                        src="/flex-ui-assets/elements/app-store-dark.svg"
                        alt=""
                      />
                    </Link>
                  </div>
                  <div className="w-full md:w-auto">
                    <Link href="/client">
                      <Image
                        height={162}
                        width={162}
                        src="/flex-ui-assets/elements/google-play-dark.svg"
                        alt=""
                      />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 px-4">
                <div className="relative flex flex-row items-center mx-auto md:mr-0 max-w-max">
                  <div className="relative max-w-max overflow-hidden">
                    <Image
                      height={601}
                      width={338}
                      className="relative z-20 h-80 md:h-auto object-cover"
                      src="/flex-ui-assets/elements/applications/iphone-light1.png"
                      alt=""
                    />
                    <Image
                      height={510}
                      width={237}
                      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 p-7 md:p-0 -mt-3 md:-mt-4 -ml-1 h-80 md:h-auto object-cover"
                      src="/flex-ui-assets/elements/applications/smartphone-ui.png"
                      alt=""
                    />
                  </div>
                  <div className="relative z-10 hidden 2xl:block max-w-max 2xl:-ml-24">
                    <Image
                      height={522}
                      width={294}
                      className="relative z-10 object-cover"
                      src="/flex-ui-assets/elements/applications/iphone-light2.png"
                      alt=""
                    />
                    <Image
                      height={444}
                      width={206}
                      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 -mt-4 -ml-1 object-cover"
                      src="/flex-ui-assets/elements/applications/smartphone-ui2.png"
                      alt=""
                    />
                  </div>
                  <Image
                    height={50}
                    width={50}
                    className="absolute -left-5 -top-5 w-28 md:w-auto text-yellow-400"
                    src="/flex-ui-assets/elements/circle2-yellow.svg"
                    alt=""
                  />
                  <Image
                    height={50}
                    width={50}
                    className="absolute -right-7 bottom-12 w-28 md:w-auto text-blue-500"
                    src="/flex-ui-assets/elements/dots1-blue.svg"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-24 bg-white header-section-bg">
          <div className="container px-4 mx-auto">
            <div className="flex flex-wrap items-center -mx-4 mb-16">
              <div className="w-full md:w-1/2 px-4 mb-16 md:mb-0">
                <span className="inline-block py-px px-2 mb-4 text-xs leading-5 text-green-500 bg-green-100 font-medium uppercase rounded-full shadow-sm">
                  How it works
                </span>
                <h2 className="mb-6 text-4xl md:text-5xl leading-tight font-bold tracking-tighter">
                  Discover How Golden Sports Simplifies Team Management
                </h2>
                <p className="text-lg md:text-xl text-gray-500 font-medium">
                  From group coordination to financial management, Golden Sports
                  offers a comprehensive platform to manage all your sports team
                  needs.
                </p>
              </div>
              <div className="w-full md:w-1/2 px-4">
                <div className="relative mx-auto md:mr-0 max-w-max overflow-hidden rounded-7xl">
                  <Image
                    height={400}
                    width={400}
                    src="/flex-ui-assets/images/how-it-works/placeholder-video.png"
                    alt=""
                  />
                  <video
                    className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 min-h-full min-w-full max-w-none"
                    poster="/flex-ui-assets/images/testimonials/video-frame.jpeg"
                    muted={true}
                  >
                    <source
                      src="https://static.shuffle.dev/files/video-placeholder.mp4"
                      type="video/mp4"
                    />
                  </video>
                  <a
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full"
                    href="#"
                  >
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.5 11.13L5.50001 3.05C5.34799 2.96223 5.17554 2.91603 5.00001 2.91603C4.82447 2.91603 4.65203 2.96223 4.50001 3.05C4.3474 3.1381 4.22079 3.26497 4.13299 3.41775C4.04518 3.57052 3.99931 3.74379 4.00001 3.92V20.08C3.99931 20.2562 4.04518 20.4295 4.13299 20.5823C4.22079 20.735 4.3474 20.8619 4.50001 20.95C4.65203 21.0378 4.82447 21.084 5.00001 21.084C5.17554 21.084 5.34799 21.0378 5.50001 20.95L19.5 12.87C19.6539 12.7828 19.7819 12.6563 19.871 12.5035C19.96 12.3506 20.007 12.1769 20.007 12C20.007 11.8231 19.96 11.6494 19.871 11.4965C19.7819 11.3437 19.6539 11.2172 19.5 11.13ZM6.00001 18.35V5.65L17 12L6.00001 18.35Z"
                        fill="white"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap -mx-4 text-center md:text-left">
              <div className="w-full md:w-1/2 px-4 mb-8">
                <div className="inline-flex items-center justify-center mb-4 w-12 h-12 text-xl text-white bg-green-500 font-semibold rounded-full">
                  1
                </div>
                <h3 className="mb-2 text-xl font-bold">
                  Easy Event Scheduling
                </h3>
                <p className="font-medium text-gray-500">
                  Create and manage events with ease. Schedule matches,
                  training, and social gatherings in just a few clicks.
                </p>
              </div>
              <div className="w-full md:w-1/2  px-4 mb-8">
                <div className="inline-flex items-center justify-center mb-4 w-12 h-12 text-xl text-white bg-green-500 font-semibold rounded-full">
                  2
                </div>
                <h3 className="mb-2 text-xl font-bold">
                  Streamlined Communication
                </h3>
                <p className="font-medium text-gray-500">
                  Keep everyone in the loop with our centralized messaging
                  system, ensuring no one misses important updates.
                </p>
              </div>
              <div className="w-full md:w-1/2  px-4 mb-8">
                <div className="inline-flex items-center justify-center mb-4 w-12 h-12 text-xl text-white bg-green-500 font-semibold rounded-full">
                  3
                </div>
                <h3 className="mb-2 text-xl font-bold">
                  Seamless Payment Processing
                </h3>
                <p className="font-medium text-gray-500">
                  Handle all payments for memberships, match fees, and equipment
                  securely and efficiently within the app.
                </p>
              </div>
              <div className="w-full md:w-1/2  px-4 mb-8 md:mb-0">
                <div className="inline-flex items-center justify-center mb-4 w-12 h-12 text-xl text-white bg-green-500 font-semibold rounded-full">
                  4
                </div>
                <h3 className="mb-2 text-xl font-bold">Parental Oversight</h3>
                <p className="font-medium text-gray-500">
                  Enable parents to manage their children&apos;s profiles,
                  respond to invitations, and oversee activities with peace of
                  mind.
                </p>
              </div>
              <div className="w-full md:w-1/2  px-4 mb-8 md:mb-0">
                <div className="inline-flex items-center justify-center mb-4 w-12 h-12 text-xl text-white bg-green-500 font-semibold rounded-full">
                  5
                </div>
                <h3 className="mb-2 text-xl font-bold">Fundraising Tools</h3>
                <p className="font-medium text-gray-500">
                  Boost your club&apos;s finances with in-app fundraising
                  features like Spot the Ball and Golden Sports Superdraw.
                </p>
              </div>
              <div className="w-full md:w-1/2  px-4">
                <div className="inline-flex items-center justify-center mb-4 w-12 h-12 text-xl text-white bg-green-500 font-semibold rounded-full">
                  6
                </div>
                <h3 className="mb-2 text-xl font-bold">
                  Comprehensive Club Management
                </h3>
                <p className="font-medium text-gray-500">
                  Oversee multiple teams or groups with Golden SportsClub,
                  offering a broad view of club activities, finances, and member
                  engagement.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-24 bg-white header-section-bg grainy">
          <div className="container px-4 mx-auto">
            <div className="text-center">
              <span className="inline-block py-px px-2 mb-4 text-xs leading-5 text-green-500 bg-green-100 font-medium rounded-full shadow-sm">
                Get Started
              </span>
              <h3 className="mb-10 mx-auto text-3xl md:text-4xl leading-tight text-gray-900 font-bold tracking-tighter max-w-5xl">
                Elevate Your Team Management with Golden Sports
              </h3>
              <div className="relative mb-10 mx-auto max-w-max">
                <Image
                  height={50}
                  width={50}
                  className="absolute top-1/2 transform -translate-y-1/2 w-1/2 md:w-auto text-yellow-400"
                  src="/flex-ui-assets/elements/circle1-yellow.svg"
                  alt=""
                />
                <Image
                  height={50}
                  width={50}
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 w-1/4 md:w-auto text-blue-500"
                  src="/flex-ui-assets/elements/dots1-blue.svg"
                  alt=""
                />
                <Image
                  height={470}
                  width={731}
                  className="absolute p-7 -mt-1 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10/12 z-20"
                  src="/flex-ui-assets/elements/dashboard.png"
                  alt=""
                />
                <Image
                  height={525}
                  width={945}
                  className="relative z-10"
                  src="/flex-ui-assets/elements/applications/macbook.png"
                  alt=""
                />
              </div>
              <p className="mb-6 mx-auto text-lg md:text-xl text-gray-500 font-medium max-w-4xl">
                Join the community of coaches, parents, and administrators who
                have transformed their team management with Golden Sports.
                Experience the ultimate in convenience, organization, and
                efficiency.
              </p>
              <div className="flex flex-wrap justify-center">
                <div className="w-full md:w-auto py-1 md:py-0 md:mr-6">
                  <Link
                    className={cn(
                      buttonVariants({
                        size: "lg",
                        className:
                          "w-full text-base md:text-lg leading-4 text-white font-medium",
                      }),
                      "bg-[#2D9B38] hover:bg-gradient-to-r from-[#2D9B38] to-[#00B3B6]"
                    )}
                    href="/client"
                  >
                    Download Now
                  </Link>
                </div>
                <div className="w-full md:w-auto py-1 md:py-0">
                  <Link
                    className={buttonVariants({
                      size: "lg",
                      variant: "outline",
                      className:
                        "w-full text-gray-900 md:text-lg leading-4 font-medium",
                    })}
                    href="/features/overview"
                  >
                    Explore Features
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </MaxWidthWrapper>
    </>
  );
}
