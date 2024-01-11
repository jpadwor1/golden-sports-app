import MaxWidthWrapper from '@/components/Layout/MaxWidthWrapper';
import { buttonVariants } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <MaxWidthWrapper>
      <section
        className='py-24 md:pt-36 bg-white overflow-hidden header-section-bg'
        
      >
        <div className='container px-4 mx-auto'>
          <div className='flex flex-wrap items-center -mx-4'>
            <div className='w-full md:w-1/2 px-4 mb-16 md:mb-0'>
              <span className='inline-block py-px px-2 mb-4 text-xs leading-5 text-green-500 bg-green-100 font-medium rounded-full shadow-sm'>
                Sports Team Management
              </span>
              <h3 className='mb-4 text-4xl md:text-5xl leading-tight text-gray-900 font-bold tracking-tighter'>
                Simplify Your Sports Management with Golden Sports
              </h3>
              <p className='mb-6 text-lg md:text-xl text-gray-500 font-medium'>
                Golden Sports brings together group management, scheduling,
                communication, and financial tools in one easy-to-use app. Ideal
                for coaches, parents, and club administrators, our app
                streamlines the management of sports teams and activities,
                ensuring you focus more on the game and less on the logistics.
              </p>
              <div className='flex flex-wrap'>
                <div className='w-full md:w-auto mb-3 md:mb-0 md:mr-4'>
                  <Link href='/client'>
                    <Image
                      height={150}
                      width={150}
                      src='/flex-ui-assets/elements/app-store-dark.svg'
                      alt=''
                    />
                  </Link>
                </div>
                <div className='w-full md:w-auto'>
                  <Link href='/client'>
                    <Image
                      height={162}
                      width={162}
                      src='/flex-ui-assets/elements/google-play-dark.svg'
                      alt=''
                    />
                  </Link>
                </div>
              </div>
            </div>
            <div className='w-full md:w-1/2 px-4'>
              <div className='relative flex flex-row items-center mx-auto md:mr-0 max-w-max'>
                <div className='relative max-w-max overflow-hidden'>
                  <Image
                    height={601}
                    width={338}
                    className='relative z-20 h-80 md:h-auto object-cover'
                    src='/flex-ui-assets/elements/applications/iphone-light1.png'
                    alt=''
                  />
                  <Image
                    height={510}
                    width={237}
                    className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 p-7 md:p-0 -mt-3 md:-mt-4 -ml-1 h-80 md:h-auto object-cover'
                    src='/flex-ui-assets/elements/applications/smartphone-ui.png'
                    alt=''
                  />
                </div>
                <div className='relative z-10 hidden 2xl:block max-w-max 2xl:-ml-24'>
                  <Image
                    height={522}
                    width={294}
                    className='relative z-10 object-cover'
                    src='/flex-ui-assets/elements/applications/iphone-light2.png'
                    alt=''
                  />
                  <Image
                    height={444}
                    width={206}
                    className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 -mt-4 -ml-1 object-cover'
                    src='/flex-ui-assets/elements/applications/smartphone-ui2.png'
                    alt=''
                  />
                </div>
                <Image
                  height={50}
                  width={50}
                  className='absolute -left-5 -top-5 w-28 md:w-auto text-yellow-400'
                  src='/flex-ui-assets/elements/circle2-yellow.svg'
                  alt=''
                />
                <Image
                  height={50}
                  width={50}
                  className='absolute -right-7 bottom-12 w-28 md:w-auto text-blue-500'
                  src='/flex-ui-assets/elements/dots1-blue.svg'
                  alt=''
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className='py-24 bg-white header-section-bg'
        
      >
        <div className='container px-4 mx-auto'>
          <div className='flex flex-wrap items-center -mx-4 mb-16'>
            <div className='w-full md:w-1/2 px-4 mb-16 md:mb-0'>
              <span className='inline-block py-px px-2 mb-4 text-xs leading-5 text-green-500 bg-green-100 font-medium uppercase rounded-full shadow-sm'>
                How it works
              </span>
              <h2 className='mb-6 text-4xl md:text-5xl leading-tight font-bold tracking-tighter'>
                Discover How Golden Sports Simplifies Team Management
              </h2>
              <p className='text-lg md:text-xl text-gray-500 font-medium'>
                From group coordination to financial management, Golden Sports
                offers a comprehensive platform to manage all your sports team
                needs.
              </p>
            </div>
            <div className='w-full md:w-1/2 px-4'>
              <div className='relative mx-auto md:mr-0 max-w-max overflow-hidden rounded-7xl'>
                <Image
                  height={400}
                  width={400}
                  src='/flex-ui-assets/images/how-it-works/placeholder-video.png'
                  alt=''
                />
                <video
                  className='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 min-h-full min-w-full max-w-none'
                  poster='/flex-ui-assets/images/testimonials/video-frame.jpeg'
                  muted={true}
                >
                  <source
                    src='https://static.shuffle.dev/files/video-placeholder.mp4'
                    type='video/mp4'
                  />
                </video>
                <a
                  className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full'
                  href='#'
                >
                  <svg
                    width={24}
                    height={24}
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M19.5 11.13L5.50001 3.05C5.34799 2.96223 5.17554 2.91603 5.00001 2.91603C4.82447 2.91603 4.65203 2.96223 4.50001 3.05C4.3474 3.1381 4.22079 3.26497 4.13299 3.41775C4.04518 3.57052 3.99931 3.74379 4.00001 3.92V20.08C3.99931 20.2562 4.04518 20.4295 4.13299 20.5823C4.22079 20.735 4.3474 20.8619 4.50001 20.95C4.65203 21.0378 4.82447 21.084 5.00001 21.084C5.17554 21.084 5.34799 21.0378 5.50001 20.95L19.5 12.87C19.6539 12.7828 19.7819 12.6563 19.871 12.5035C19.96 12.3506 20.007 12.1769 20.007 12C20.007 11.8231 19.96 11.6494 19.871 11.4965C19.7819 11.3437 19.6539 11.2172 19.5 11.13ZM6.00001 18.35V5.65L17 12L6.00001 18.35Z'
                      fill='white'
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className='flex flex-wrap -mx-4 text-center md:text-left'>
            <div className='w-full md:w-1/2 px-4 mb-8'>
              <div className='inline-flex items-center justify-center mb-4 w-12 h-12 text-xl text-white bg-green-500 font-semibold rounded-full'>
                1
              </div>
              <h3 className='mb-2 text-xl font-bold'>Easy Event Scheduling</h3>
              <p className='font-medium text-gray-500'>
                Create and manage events with ease. Schedule matches, training,
                and social gatherings in just a few clicks.
              </p>
            </div>
            <div className='w-full md:w-1/2  px-4 mb-8'>
              <div className='inline-flex items-center justify-center mb-4 w-12 h-12 text-xl text-white bg-green-500 font-semibold rounded-full'>
                2
              </div>
              <h3 className='mb-2 text-xl font-bold'>
                Streamlined Communication
              </h3>
              <p className='font-medium text-gray-500'>
                Keep everyone in the loop with our centralized messaging system,
                ensuring no one misses important updates.
              </p>
            </div>
            <div className='w-full md:w-1/2  px-4 mb-8'>
              <div className='inline-flex items-center justify-center mb-4 w-12 h-12 text-xl text-white bg-green-500 font-semibold rounded-full'>
                3
              </div>
              <h3 className='mb-2 text-xl font-bold'>
                Seamless Payment Processing
              </h3>
              <p className='font-medium text-gray-500'>
                Handle all payments for memberships, match fees, and equipment
                securely and efficiently within the app.
              </p>
            </div>
            <div className='w-full md:w-1/2  px-4 mb-8 md:mb-0'>
              <div className='inline-flex items-center justify-center mb-4 w-12 h-12 text-xl text-white bg-green-500 font-semibold rounded-full'>
                4
              </div>
              <h3 className='mb-2 text-xl font-bold'>Parental Oversight</h3>
              <p className='font-medium text-gray-500'>
                Enable parents to manage their children’s profiles, respond to
                invitations, and oversee activities with peace of mind.
              </p>
            </div>
            <div className='w-full md:w-1/2  px-4 mb-8 md:mb-0'>
              <div className='inline-flex items-center justify-center mb-4 w-12 h-12 text-xl text-white bg-green-500 font-semibold rounded-full'>
                5
              </div>
              <h3 className='mb-2 text-xl font-bold'>Fundraising Tools</h3>
              <p className='font-medium text-gray-500'>
                Boost your club&apos;s finances with in-app fundraising features
                like Spot the Ball and Golden Sports Superdraw.
              </p>
            </div>
            <div className='w-full md:w-1/2  px-4'>
              <div className='inline-flex items-center justify-center mb-4 w-12 h-12 text-xl text-white bg-green-500 font-semibold rounded-full'>
                6
              </div>
              <h3 className='mb-2 text-xl font-bold'>
                Comprehensive Club Management
              </h3>
              <p className='font-medium text-gray-500'>
                Oversee multiple teams or groups with Golden SportsClub,
                offering a broad view of club activities, finances, and member
                engagement.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section
        className='py-24 bg-white header-section-bg'
        
      >
        <div className='container px-4 mx-auto'>
          <div className='text-center'>
            <span className='inline-block py-px px-2 mb-4 text-xs leading-5 text-green-500 bg-green-100 font-medium rounded-full shadow-sm'>
              Get Started
            </span>
            <h3 className='mb-10 mx-auto text-3xl md:text-4xl leading-tight text-gray-900 font-bold tracking-tighter max-w-5xl'>
              Elevate Your Team Management with Golden Sports
            </h3>
            <div className='relative mb-10 mx-auto max-w-max'>
              <Image
                height={50}
                width={50}
                className='absolute top-1/2 transform -translate-y-1/2 w-1/2 md:w-auto text-yellow-400'
                src='/flex-ui-assets/elements/circle1-yellow.svg'
                alt=''
              />
              <Image
                height={50}
                width={50}
                className='absolute top-1/2 right-0 transform -translate-y-1/2 w-1/4 md:w-auto text-blue-500'
                src='/flex-ui-assets/elements/dots1-blue.svg'
                alt=''
              />
              <Image
                height={470}
                width={731}
                className='absolute p-7 -mt-1 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10/12 z-20'
                src='/flex-ui-assets/elements/dashboard.png'
                alt=''
              />
              <Image
                height={525}
                width={945}
                className='relative z-10'
                src='/flex-ui-assets/elements/applications/macbook.png'
                alt=''
              />
            </div>
            <p className='mb-6 mx-auto text-lg md:text-xl text-gray-500 font-medium max-w-4xl'>
              Join the community of coaches, parents, and administrators who
              have transformed their team management with Golden Sports.
              Experience the ultimate in convenience, organization, and
              efficiency.
            </p>
            <div className='flex flex-wrap justify-center'>
              <div className='w-full md:w-auto py-1 md:py-0 md:mr-6'>
                <Link
                  className={buttonVariants({
                    size: 'lg',
                    className:
                      'w-full text-base md:text-lg leading-4 text-green-50 font-medium',
                  })}
                  href='/client'
                >
                  Download Now
                </Link>
              </div>
              <div className='w-full md:w-auto py-1 md:py-0'>
                <Link
                  className={buttonVariants({
                    size: 'lg',
                    variant: 'outline',
                    className:
                      'w-full text-gray-900 md:text-lg leading-4 font-medium',
                  })}
                  href='/features'
                >
                  Explore Features
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className='bg-white overflow-hidden header-section-bg'
        
      >
        <div className='container px-4 mx-auto'>
          <div className='flex flex-wrap lg:items-center pt-24 pb-12 -mx-4'>
            <div className='w-full md:w-3/4 px-4'>
              <a className='block mb-8 max-w-max' href='#'>
                <Image
                  height={50}
                  width={50}
                  className='h-8'
                  src='/GSlogo.png'
                  alt=''
                />
              </a>
              <p className='mb-12 text-base md:text-lg text-gray-400 font-medium md:max-w-md'>
                Join the Golden Sports community and elevate your sports
                management experience to the next level.
              </p>
              <div className='mb-12 md:mb-0 flex flex-wrap -mx-3 md:-mx-6'>
                <div className='w-full md:w-auto p-3 md:py-0 md:px-6'>
                  <Link
                    className='inline-block text-gray-500 hover:text-gray-600 font-medium'
                    href='#'
                  >
                    About Us
                  </Link>
                </div>
                <div className='w-full md:w-auto p-3 md:py-0 md:px-6'>
                  <Link
                    className='inline-block text-gray-500 hover:text-gray-600 font-medium'
                    href='#'
                  >
                    Features
                  </Link>
                </div>
                <div className='w-full md:w-auto p-3 md:py-0 md:px-6'>
                  <Link
                    className='inline-block text-gray-500 hover:text-gray-600 font-medium'
                    href='#'
                  >
                    Testimonials
                  </Link>
                </div>
                <div className='w-full md:w-auto p-3 md:py-0 md:px-6'>
                  <Link
                    className='inline-block text-gray-500 hover:text-gray-600 font-medium'
                    href='#'
                  >
                    FAQ
                  </Link>
                </div>
                <div className='w-full md:w-auto p-3 md:py-0 md:px-6'>
                  <Link
                    className='inline-block text-gray-500 hover:text-gray-600 font-medium'
                    href='#'
                  >
                    Blog
                  </Link>
                </div>
                <div className='w-full md:w-auto p-3 md:py-0 md:px-6'>
                  <Link
                    className='inline-block text-gray-500 hover:text-gray-600 font-medium'
                    href='#'
                  >
                    Contact Us
                  </Link>
                </div>
                
              </div>
            </div>
            <div className='w-full md:w-1/4 px-4'>
              <div className='lg:pr-10 lg:ml-auto lg:max-w-max'>
                <Link className='block mb-4' href='#'>
                  <Image
                    height={150}
                    width={150}
                    src='/flex-ui-assets/elements/app-store.svg'
                    alt=''
                  />
                </Link>
                <Link className='block' href='#'>
                  <Image
                    height={162}
                    width={162}
                    src='/flex-ui-assets/elements/google-play.svg'
                    alt=''
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className='border-b border-gray-100' />
        <div className='container px-4 mx-auto'>
          <div className='flex flex-wrap items-center py-12 md:pb-32'>
            <div className='w-full md:w-1/2 mb-6 md:mb-0'>
              <p className='text-gray-400 font-medium'>
                © 2024 Golden Sports. All rights reserved.
              </p>
            </div>
            <div className='w-full md:w-1/2'>
              <div className='flex flex-wrap md:justify-end -mx-5'>
                <div className='px-5'>
                  <Link
                    className='inline-block text-gray-300 hover:text-gray-400'
                    href='#'
                  >
                    <svg
                      width={10}
                      height={18}
                      viewBox='0 0 10 18'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M6.63494 17.7273V9.76602H9.3583L9.76688 6.66246H6.63494V4.68128C6.63494 3.78301 6.88821 3.17085 8.20297 3.17085L9.87712 3.17017V0.394238C9.5876 0.357335 8.59378 0.272728 7.43708 0.272728C5.0217 0.272728 3.3681 1.71881 3.3681 4.37391V6.66246H0.636475V9.76602H3.3681V17.7273H6.63494Z'
                        fill='currentColor'
                      />
                    </svg>
                  </Link>
                </div>
                <div className='px-5'>
                  <Link
                    className='inline-block text-gray-300 hover:text-gray-400'
                    href='#'
                  >
                    <svg
                      width={19}
                      height={16}
                      viewBox='0 0 19 16'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M18.8181 2.14597C18.1356 2.44842 17.4032 2.65355 16.6336 2.74512C17.4194 2.27461 18.0208 1.5283 18.3059 0.641757C17.5689 1.07748 16.7553 1.39388 15.8885 1.56539C15.1943 0.824879 14.2069 0.363636 13.1118 0.363636C11.0108 0.363636 9.30722 2.06718 9.30722 4.16706C9.30722 4.46488 9.34083 4.75576 9.40574 5.03391C6.24434 4.87512 3.44104 3.36048 1.56483 1.05894C1.23686 1.61985 1.05028 2.27342 1.05028 2.97109C1.05028 4.29106 1.72243 5.45573 2.74225 6.13712C2.11877 6.11627 1.53237 5.94476 1.01901 5.65967V5.70718C1.01901 7.54979 2.33086 9.08761 4.07031 9.43761C3.75161 9.52336 3.41555 9.57088 3.06789 9.57088C2.82222 9.57088 2.58464 9.54655 2.35171 9.50018C2.8361 11.0125 4.24067 12.1123 5.90483 12.1424C4.6034 13.1622 2.96243 13.7683 1.1801 13.7683C0.873008 13.7683 0.570523 13.7498 0.272705 13.7162C1.95655 14.7974 3.95561 15.4278 6.10416 15.4278C13.1026 15.4278 16.928 9.63115 16.928 4.60397L16.9153 4.11145C17.6627 3.57833 18.3094 2.90851 18.8181 2.14597Z'
                        fill='currentColor'
                      />
                    </svg>
                  </Link>
                </div>
                <div className='px-5'>
                  <Link
                    className='inline-block text-gray-300 hover:text-gray-400'
                    href='#'
                  >
                    <svg
                      width={20}
                      height={20}
                      viewBox='0 0 20 20'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M5.6007 0.181818H14.3992C17.3874 0.181818 19.8184 2.61281 19.8182 5.60074V14.3993C19.8182 17.3872 17.3874 19.8182 14.3992 19.8182H5.6007C2.61276 19.8182 0.181885 17.3873 0.181885 14.3993V5.60074C0.181885 2.61281 2.61276 0.181818 5.6007 0.181818ZM14.3993 18.0759C16.4267 18.0759 18.0761 16.4266 18.0761 14.3993H18.076V5.60074C18.076 3.57348 16.4266 1.92405 14.3992 1.92405H5.6007C3.57343 1.92405 1.92412 3.57348 1.92412 5.60074V14.3993C1.92412 16.4266 3.57343 18.0761 5.6007 18.0759H14.3993ZM4.85721 10.0001C4.85721 7.16424 7.16425 4.85714 10.0001 4.85714C12.8359 4.85714 15.1429 7.16424 15.1429 10.0001C15.1429 12.8359 12.8359 15.1429 10.0001 15.1429C7.16425 15.1429 4.85721 12.8359 4.85721 10.0001ZM6.62805 10C6.62805 11.8593 8.14081 13.3719 10.0001 13.3719C11.8593 13.3719 13.3721 11.8593 13.3721 10C13.3721 8.14058 11.8594 6.6279 10.0001 6.6279C8.14069 6.6279 6.62805 8.14058 6.62805 10Z'
                        fill='currentColor'
                      />
                    </svg>
                  </Link>
                </div>
                <div className='px-5'>
                  <Link
                    className='inline-block text-gray-300 hover:text-gray-400'
                    href='#'
                  >
                    <svg
                      width={18}
                      height={18}
                      viewBox='0 0 18 18'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M9 0C4.0275 0 0 4.13211 0 9.22838C0 13.3065 2.5785 16.7648 6.15375 17.9841C6.60375 18.0709 6.76875 17.7853 6.76875 17.5403C6.76875 17.3212 6.76125 16.7405 6.7575 15.9712C4.254 16.5277 3.726 14.7332 3.726 14.7332C3.3165 13.6681 2.72475 13.3832 2.72475 13.3832C1.9095 12.8111 2.78775 12.8229 2.78775 12.8229C3.6915 12.887 4.16625 13.7737 4.16625 13.7737C4.96875 15.1847 6.273 14.777 6.7875 14.5414C6.8685 13.9443 7.10025 13.5381 7.3575 13.3073C5.35875 13.0764 3.258 12.2829 3.258 8.74709C3.258 7.73988 3.60675 6.91659 4.18425 6.27095C4.083 6.03774 3.77925 5.0994 4.263 3.82846C4.263 3.82846 5.01675 3.58116 6.738 4.77462C7.458 4.56958 8.223 4.46785 8.988 4.46315C9.753 4.46785 10.518 4.56958 11.238 4.77462C12.948 3.58116 13.7017 3.82846 13.7017 3.82846C14.1855 5.0994 13.8818 6.03774 13.7917 6.27095C14.3655 6.91659 14.7142 7.73988 14.7142 8.74709C14.7142 12.2923 12.6105 13.0725 10.608 13.2995C10.923 13.5765 11.2155 14.1423 11.2155 15.0071C11.2155 16.242 11.2043 17.2344 11.2043 17.5341C11.2043 17.7759 11.3617 18.0647 11.823 17.9723C15.4237 16.7609 18 13.3002 18 9.22838C18 4.13211 13.9703 0 9 0Z'
                        fill='currentColor'
                      />
                    </svg>
                  </Link>
                </div>
                <div className='px-5'>
                  <Link
                    className='inline-block text-gray-300 hover:text-gray-400'
                    href='#'
                  >
                    <svg
                      width={18}
                      height={18}
                      viewBox='0 0 18 18'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M16.2 0H1.8C0.81 0 0 0.81 0 1.8V16.2C0 17.19 0.81 18 1.8 18H16.2C17.19 18 18 17.19 18 16.2V1.8C18 0.81 17.19 0 16.2 0ZM5.4 15.3H2.7V7.2H5.4V15.3ZM4.05 5.67C3.15 5.67 2.43 4.95 2.43 4.05C2.43 3.15 3.15 2.43 4.05 2.43C4.95 2.43 5.67 3.15 5.67 4.05C5.67 4.95 4.95 5.67 4.05 5.67ZM15.3 15.3H12.6V10.53C12.6 9.81004 11.97 9.18 11.25 9.18C10.53 9.18 9.9 9.81004 9.9 10.53V15.3H7.2V7.2H9.9V8.28C10.35 7.56 11.34 7.02 12.15 7.02C13.86 7.02 15.3 8.46 15.3 10.17V15.3Z'
                        fill='currentColor'
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MaxWidthWrapper>
  );
}
