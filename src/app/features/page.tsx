import React from "react";
import Link from "next/link";
import {
  CalendarDays,
  Users,
  Bell,
  ArrowRight,
  MessageCircle,
  CheckSquare,
  DollarSign,
  BarChart2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navigation/Navbar";
import FeatureCarousel from "@/components/FeatureCarousel";
import Footer from "@/components/Navigation/Footer";
import MaxWidthWrapper from "@/components/Layout/MaxWidthWrapper";
import Image from "next/image";

const FeaturesPage = () => {
  const allFeatures = [
    {
      title: "Automated Notifications",
      description: "No more chasing parents and players.",
      icon: <Bell className="w-8 h-8" />,
    },
    {
      title: "Organize All Kinds of Events",
      description:
        "Full control over scheduling games, practices, or other activities.",
      icon: <CalendarDays className="w-8 h-8" />,
    },
    {
      title: "Group Setup",
      description: "Gives you all the flexibility you need.",
      icon: <Users className="w-8 h-8" />,
    },
  ];

  //add new feature list for carousel
  const carouselFeatures = [
    {
      title: "Automated Notifications",
      description: "No more chasing parents and players.",
      icon: <Bell className="w-8 h-8" />,
    },
    {
      title: "Organize All Kinds of Events",
      description:
        "Full control over scheduling games, practices, or other activities.",
      icon: <CalendarDays className="w-8 h-8" />,
    },
    {
      title: "Group Setup",
      description: "Gives you all the flexibility you need.",
      icon: <Users className="w-8 h-8" />,
    },
    {
      title: "Team Communication",
      description: "Seamless messaging and updates for the entire team.",
      icon: <MessageCircle className="w-8 h-8" />,
    },
    {
      title: "Attendance Tracking",
      description: "Easily manage and track attendance for all events.",
      icon: <CheckSquare className="w-8 h-8" />,
    },
    {
      title: "Payment Management",
      description: "Simplify fee collection and financial tracking.",
      icon: <DollarSign className="w-8 h-8" />,
    },
    {
      title: "Performance Analytics",
      description: "Track team and individual player statistics over time.",
      icon: <BarChart2 className="w-8 h-8" />,
    },
  ];

  return (
    <>
      <Navbar />
      <MaxWidthWrapper className="relative main-bg-gradient-to-bottom md:px-10 max-w-5xl z-[-4] overflow-hidden">
        <div className="h-[408px] w-[415px] md:h-[893px] md:w-[906px] md:-right-[200px] md:-top-[91px] -right-[130px] -top-[115px] absolute bg-[#00B3B6]/30 rounded-full z-[-3] "></div>
        <div className="h-[408px] w-[415px] md:h-[893px] md:w-[906px] md:-right-[300px] md:-top-[175px] -right-[170px] -top-[150px] absolute bg-[#00B3B6]/60 rounded-full z-[-2]"></div>
        <div className="h-[374px] w-[379px] md:h-[819px] md:w-[831px] md:-right-[300px] md:-top-[175px] -right-[170px] -top-[150px] absolute bg-[#00B3B6]/80 rounded-full z-[-1]"></div>
        <div className="w-full min-h-screen flex md:-mt-20">
          <div className="flex md:flex-row flex-col items-center md:justify-between justify-center">
            <div className="flex md:w-1/3 w-full flex-col md:mr-6 md:z-[100] px-2">
              <div className=" text-left w-full">
                <h1 className="text-[14px] w-full font-bold mb-8 text-left text-white uppercase z-[1000]">
                  Golden Sports Team App Features
                </h1>
                <h2 className="text-5xl font-bold md:mb-8 md:text-left text-white">
                  Gain full control of{" "}
                  <span className="text-[#00FF99]">your</span> time
                </h2>
              </div>

              <div className="flex md:flex-row  md:items-start items-start space-x-4 md:justify-evenly justify-start md:mb-0 md:mt-0 -mt-10 mb-8">
                <Link
                  href="#"
                  className="flex items-center justify-center md:w-48 w-36 md:mr-6"
                >
                  <svg
                    width="540"
                    height="156"
                    viewBox="0 0 540 156"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M520 156H20C9.005 156 0 147.22 0 136.5V19.5C0 8.7799 9.005 2.28882e-05 20 2.28882e-05H520C530.995 2.28882e-05 540 8.7799 540 19.5V136.5C540 147.22 530.995 156 520 156Z"
                      fill="white"
                    />
                    <path
                      d="M520 3.12489C529.26 3.12489 536.795 10.4715 536.795 19.5V136.5C536.795 145.529 529.26 152.875 520 152.875H20C10.74 152.875 3.205 145.529 3.205 136.5V19.5C3.205 10.4715 10.74 3.12489 20 3.12489H520ZM520 2.28882e-05H20C9.005 2.28882e-05 0 8.7799 0 19.5V136.5C0 147.22 9.005 156 20 156H520C530.995 156 540 147.22 540 136.5V19.5C540 8.7799 530.995 2.28882e-05 520 2.28882e-05Z"
                      fill="#A6A6A6"
                    />
                    <path
                      d="M38.74 29.4011C37.565 30.6004 36.885 32.4675 36.885 34.8855V121.134C36.885 123.552 37.565 125.419 38.74 126.618L39.03 126.882L88.6 78.5704V77.4296L39.03 29.1184L38.74 29.4011Z"
                      fill="black"
                    />
                    <path
                      d="M111.105 94.6822L94.5999 78.5703V77.4296L111.125 61.3177L111.495 61.5273L131.065 72.3839C136.65 75.4649 136.65 80.5349 131.065 83.6354L111.495 94.4726L111.105 94.6822V94.6822Z"
                      fill="black"
                    />
                    <path
                      d="M108.495 97.4726L91.6 81L41.74 129.618C43.595 131.52 46.62 131.749 50.06 129.848L108.495 97.4726"
                      fill="black"
                    />
                    <path
                      d="M108.495 58.5274L50.06 26.1525C46.62 24.2708 43.595 24.4999 41.74 26.4011L91.6 75L108.495 58.5274Z"
                      fill="black"
                    />
                    <path
                      d="M189.67 39.9506C189.67 43.2071 188.67 45.8153 186.7 47.7604C184.435 50.0663 181.485 51.2265 177.87 51.2265C174.415 51.2265 171.465 50.0468 169.045 47.7214C166.62 45.3619 165.41 42.4661 165.41 39C165.41 35.5339 166.62 32.6381 169.045 30.2981C171.465 27.9533 174.415 26.7735 177.87 26.7735C179.59 26.7735 181.23 27.1196 182.795 27.7631C184.355 28.4115 185.625 29.289 186.545 30.3713L184.455 32.4285C182.85 30.5809 180.665 29.6693 177.87 29.6693C175.35 29.6693 173.165 30.5273 171.31 32.2579C169.475 33.9934 168.555 36.2408 168.555 39C168.555 41.7593 169.475 44.0261 171.31 45.7616C173.165 47.4728 175.35 48.3503 177.87 48.3503C180.545 48.3503 182.795 47.4728 184.57 45.7421C185.74 44.5965 186.405 43.017 186.58 40.9988H177.87V38.181H189.49C189.63 38.7904 189.67 39.3803 189.67 39.9506V39.9506Z"
                      fill="black"
                      stroke="black"
                      strokeWidth="0.16"
                      stroke-miterlimit="10"
                    />
                    <path
                      d="M208.105 30.1811H197.19V37.5911H207.03V40.4089H197.19V47.8189H208.105V50.6902H194.1V27.3097H208.105V30.1811Z"
                      fill="black"
                      stroke="black"
                      strokeWidth="0.16"
                      stroke-miterlimit="10"
                    />
                    <path
                      d="M221.115 50.6902H218.025V30.1811H211.33V27.3097H227.815V30.1811H221.115V50.6902V50.6902Z"
                      fill="black"
                      stroke="black"
                      strokeWidth="0.16"
                      stroke-miterlimit="10"
                    />
                    <path
                      d="M239.745 50.6902V27.3097H242.83V50.6902H239.745Z"
                      fill="black"
                      stroke="black"
                      strokeWidth="0.16"
                      stroke-miterlimit="10"
                    />
                    <path
                      d="M256.505 50.6902H253.44V30.1811H246.72V27.3097H263.225V30.1811H256.505V50.6902Z"
                      fill="black"
                      stroke="black"
                      strokeWidth="0.16"
                      stroke-miterlimit="10"
                    />
                    <path
                      d="M294.435 47.6824C292.07 50.0468 289.14 51.2265 285.645 51.2265C282.13 51.2265 279.2 50.0468 276.835 47.6824C274.475 45.3229 273.3 42.4271 273.3 39C273.3 35.5729 274.475 32.6771 276.835 30.3176C279.2 27.9533 282.13 26.7735 285.645 26.7735C289.12 26.7735 292.05 27.9533 294.415 30.3371C296.795 32.7161 297.97 35.5924 297.97 39C297.97 42.4271 296.795 45.3229 294.435 47.6824ZM279.12 45.7226C280.9 47.4728 283.065 48.3503 285.645 48.3503C288.205 48.3503 290.39 47.4728 292.15 45.7226C293.925 43.9725 294.825 41.7251 294.825 39C294.825 36.2749 293.925 34.0275 292.15 32.2774C290.39 30.5273 288.205 29.6498 285.645 29.6498C283.065 29.6498 280.9 30.5273 279.12 32.2774C277.345 34.0275 276.445 36.2749 276.445 39C276.445 41.7251 277.345 43.9725 279.12 45.7226V45.7226Z"
                      fill="black"
                      stroke="black"
                      strokeWidth="0.16"
                      stroke-miterlimit="10"
                    />
                    <path
                      d="M302.305 50.6902V27.3097H306.055L317.715 45.4935H317.85L317.715 40.9987V27.3097H320.8V50.6902H317.58L305.37 31.6095H305.235L305.37 36.1237V50.6902H302.305V50.6902Z"
                      fill="black"
                      stroke="black"
                      strokeWidth="0.16"
                      stroke-miterlimit="10"
                    />
                    <path
                      d="M272.54 84.8348C263.145 84.8348 255.47 91.8061 255.47 101.424C255.47 110.965 263.145 118.009 272.54 118.009C281.955 118.009 289.63 110.965 289.63 101.424C289.63 91.8061 281.955 84.8348 272.54 84.8348ZM272.54 111.477C267.385 111.477 262.95 107.328 262.95 101.424C262.95 95.4428 267.385 91.3673 272.54 91.3673C277.695 91.3673 282.15 95.4428 282.15 101.424C282.15 107.328 277.695 111.477 272.54 111.477V111.477ZM235.295 84.8348C225.88 84.8348 218.225 91.8061 218.225 101.424C218.225 110.965 225.88 118.009 235.295 118.009C244.705 118.009 252.365 110.965 252.365 101.424C252.365 91.8061 244.705 84.8348 235.295 84.8348ZM235.295 111.477C230.135 111.477 225.685 107.328 225.685 101.424C225.685 95.4428 230.135 91.3673 235.295 91.3673C240.45 91.3673 244.885 95.4428 244.885 101.424C244.885 107.328 240.45 111.477 235.295 111.477ZM190.975 89.9194V96.9687H208.24C207.735 100.908 206.385 103.803 204.315 105.822C201.795 108.259 197.87 110.965 190.975 110.965C180.35 110.965 172.03 102.604 172.03 92.2448C172.03 81.8855 180.35 73.5248 190.975 73.5248C196.72 73.5248 200.9 75.7137 203.985 78.551L209.08 73.5833C204.765 69.5663 199.025 66.4804 190.975 66.4804C176.405 66.4804 164.16 78.0391 164.16 92.2448C164.16 106.451 176.405 118.009 190.975 118.009C198.85 118.009 204.765 115.494 209.415 110.775C214.18 106.129 215.665 99.5963 215.665 94.3216C215.665 92.6836 215.525 91.1772 215.275 89.9194H190.975ZM372.205 95.3843C370.8 91.6744 366.465 84.8348 357.635 84.8348C348.885 84.8348 341.6 91.5574 341.6 101.424C341.6 110.716 348.81 118.009 358.475 118.009C366.29 118.009 370.8 113.363 372.655 110.658L366.855 106.889C364.92 109.649 362.285 111.477 358.475 111.477C354.69 111.477 351.975 109.785 350.235 106.451L372.99 97.2709L372.205 95.3843V95.3843ZM349.005 100.908C348.81 94.5117 354.1 91.2357 357.89 91.2357C360.86 91.2357 363.38 92.6836 364.22 94.7554L349.005 100.908V100.908ZM330.51 117H337.99V68.2501H330.51V117ZM318.26 88.5301H318.01C316.33 86.5898 313.125 84.8348 309.065 84.8348C300.545 84.8348 292.755 92.1278 292.755 101.478C292.755 110.775 300.545 118.009 309.065 118.009C313.125 118.009 316.33 116.24 318.01 114.241H318.26V116.62C318.26 122.962 314.785 126.37 309.18 126.37C304.61 126.37 301.775 123.152 300.605 120.447L294.1 123.094C295.975 127.491 300.94 132.902 309.18 132.902C317.95 132.902 325.35 127.871 325.35 115.63V85.8439H318.26V88.5301V88.5301ZM309.705 111.477C304.55 111.477 300.235 107.27 300.235 101.478C300.235 95.6329 304.55 91.3673 309.705 91.3673C314.785 91.3673 318.79 95.6329 318.79 101.478C318.79 107.27 314.785 111.477 309.705 111.477V111.477ZM407.225 68.2501H389.335V117H396.795V98.5287H407.225C415.51 98.5287 423.635 92.6836 423.635 83.3869C423.635 74.0952 415.49 68.2501 407.225 68.2501V68.2501ZM407.42 91.7476H396.795V75.0312H407.42C412.99 75.0312 416.17 79.5406 416.17 83.3869C416.17 87.1602 412.99 91.7476 407.42 91.7476ZM453.535 84.7422C448.145 84.7422 442.54 87.0627 440.235 92.2058L446.855 94.9114C448.28 92.2058 450.9 91.3283 453.67 91.3283C457.54 91.3283 461.465 93.5952 461.525 97.5976V98.1094C460.175 97.3489 457.285 96.2228 453.73 96.2228C446.6 96.2228 439.335 100.05 439.335 107.192C439.335 113.724 445.175 117.931 451.74 117.931C456.76 117.931 459.53 115.723 461.27 113.154H461.525V116.922H468.73V98.2216C468.73 89.5782 462.11 84.7422 453.535 84.7422ZM452.635 111.457C450.195 111.457 446.795 110.277 446.795 107.328C446.795 103.555 451.035 102.107 454.705 102.107C457.99 102.107 459.53 102.814 461.525 103.745C460.94 108.259 456.955 111.457 452.635 111.457V111.457ZM494.98 85.8098L486.405 106.943H486.15L477.285 85.8098H469.24L482.56 115.343L474.96 131.776H482.755L503.28 85.8098H494.98V85.8098ZM427.735 117H435.215V68.2501H427.735V117Z"
                      fill="black"
                    />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="flex items-center justify-center md:w-48 w-36 "
                >
                  <svg
                    width="540"
                    height="156"
                    viewBox="0 0 540 156"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M537 138.009C537 146.323 530.126 153.057 521.623 153.057H18.3973C9.8985 153.057 3 146.323 3 138.009V18.0105C3 9.70101 9.8985 2.9434 18.3973 2.9434H521.619C530.126 2.9434 536.996 9.70101 536.996 18.0105L537 138.009Z"
                      fill="white"
                    />
                    <path
                      d="M520 3.12488C529.26 3.12488 536.795 10.4715 536.795 19.5V136.5C536.795 145.529 529.26 152.875 520 152.875H20C10.74 152.875 3.205 145.529 3.205 136.5V19.5C3.205 10.4715 10.74 3.12488 20 3.12488H520ZM520 1.52588e-05H20C9.005 1.52588e-05 0 8.77989 0 19.5V136.5C0 147.22 9.005 156 20 156H520C530.995 156 540 147.22 540 136.5V19.5C540 8.77989 530.995 1.52588e-05 520 1.52588e-05Z"
                      fill="#A6A6A6"
                    />
                    <path
                      d="M120.512 77.1576C120.396 64.5879 131.068 58.4727 131.556 58.188C125.512 49.5963 116.144 48.4224 112.852 48.3288C104.984 47.5215 97.352 52.9191 93.344 52.9191C89.256 52.9191 83.084 48.4068 76.432 48.5394C67.872 48.6681 59.864 53.5002 55.472 61.0038C46.408 76.3035 53.168 98.787 61.852 111.154C66.196 117.211 71.272 123.973 77.916 123.735C84.416 123.474 86.844 119.695 94.688 119.695C102.46 119.695 104.74 123.735 111.516 123.583C118.492 123.474 122.884 117.499 127.076 111.388C132.096 104.446 134.112 97.6092 134.192 97.2582C134.028 97.2036 120.644 92.2233 120.512 77.1576Z"
                      fill="black"
                    />
                    <path
                      d="M107.712 40.1934C111.208 35.9307 113.6 30.1314 112.936 24.2463C107.876 24.4647 101.548 27.6588 97.904 31.8279C94.68 35.5017 91.8 41.5233 92.544 47.1861C98.228 47.5995 104.064 44.3898 107.712 40.1934Z"
                      fill="black"
                    />
                    <path
                      d="M196.2 39.0351C196.2 43.6254 194.788 47.0808 191.968 49.4013C189.356 51.5424 185.644 52.6149 180.836 52.6149C178.452 52.6149 176.412 52.5135 174.704 52.3107V27.2298C176.932 26.8788 179.332 26.6994 181.924 26.6994C186.504 26.6994 189.956 27.6705 192.284 29.6127C194.892 31.8084 196.2 34.9479 196.2 39.0351ZM191.78 39.1482C191.78 36.1725 190.972 33.891 189.356 32.2998C187.74 30.7125 185.38 29.9169 182.272 29.9169C180.952 29.9169 179.828 30.0027 178.896 30.1821V49.2492C179.412 49.3272 180.356 49.3623 181.728 49.3623C184.936 49.3623 187.412 48.4926 189.156 46.7532C190.9 45.0138 191.78 42.4788 191.78 39.1482Z"
                      fill="black"
                    />
                    <path
                      d="M219.636 43.0443C219.636 45.8718 218.808 48.1884 217.152 50.0058C215.416 51.8739 213.116 52.806 210.244 52.806C207.476 52.806 205.272 51.9129 203.628 50.1189C201.988 48.3288 201.168 46.0707 201.168 43.3485C201.168 40.5015 202.012 38.1654 203.708 36.3519C205.404 34.5384 207.684 33.6297 210.556 33.6297C213.324 33.6297 215.548 34.5228 217.232 36.3129C218.832 38.0523 219.636 40.2987 219.636 43.0443ZM215.288 43.1769C215.288 41.4804 214.912 40.0257 214.164 38.8128C213.284 37.3464 212.032 36.6132 210.404 36.6132C208.72 36.6132 207.44 37.3464 206.56 38.8128C205.808 40.0257 205.436 41.5038 205.436 43.251C205.436 44.9475 205.812 46.4022 206.56 47.6151C207.468 49.0815 208.732 49.8147 210.364 49.8147C211.964 49.8147 213.22 49.0698 214.124 47.5761C214.9 46.3398 215.288 44.8734 215.288 43.1769Z"
                      fill="black"
                    />
                    <path
                      d="M251.06 34.0041L245.16 52.3887H241.32L238.876 44.4054C238.256 42.4125 237.752 40.4313 237.36 38.4657H237.284C236.92 40.4859 236.416 42.4632 235.768 44.4054L233.172 52.3887H229.288L223.74 34.0041H228.048L230.18 42.744C230.696 44.811 231.12 46.7805 231.46 48.6447H231.536C231.848 47.1081 232.364 45.1503 233.092 42.783L235.768 34.008H239.184L241.748 42.5958C242.368 44.6901 242.872 46.7064 243.26 48.6486H243.376C243.66 46.7571 244.088 44.7408 244.656 42.5958L246.944 34.008H251.06V34.0041Z"
                      fill="black"
                    />
                    <path
                      d="M272.792 52.3887H268.6V41.8587C268.6 38.6139 267.336 36.9915 264.8 36.9915C263.556 36.9915 262.552 37.4361 261.772 38.3292C261 39.2223 260.608 40.2753 260.608 41.4804V52.3848H256.416V39.2574C256.416 37.6428 256.364 35.8917 256.264 33.9963H259.948L260.144 36.8706H260.26C260.748 35.9775 261.476 35.2404 262.432 34.6515C263.568 33.9651 264.84 33.618 266.232 33.618C267.992 33.618 269.456 34.1718 270.62 35.2833C272.068 36.6444 272.792 38.6763 272.792 41.3751V52.3887V52.3887Z"
                      fill="black"
                    />
                    <path
                      d="M284.352 52.3887H280.164V25.5684H284.352V52.3887Z"
                      fill="black"
                    />
                    <path
                      d="M309.032 43.0443C309.032 45.8718 308.204 48.1884 306.548 50.0058C304.812 51.8739 302.508 52.806 299.64 52.806C296.868 52.806 294.664 51.9129 293.024 50.1189C291.384 48.3288 290.564 46.0707 290.564 43.3485C290.564 40.5015 291.408 38.1654 293.104 36.3519C294.8 34.5384 297.08 33.6297 299.948 33.6297C302.72 33.6297 304.94 34.5228 306.628 36.3129C308.228 38.0523 309.032 40.2987 309.032 43.0443ZM304.68 43.1769C304.68 41.4804 304.304 40.0257 303.556 38.8128C302.68 37.3464 301.424 36.6132 299.8 36.6132C298.112 36.6132 296.832 37.3464 295.956 38.8128C295.204 40.0257 294.832 41.5038 294.832 43.251C294.832 44.9475 295.208 46.4022 295.956 47.6151C296.864 49.0815 298.128 49.8147 299.76 49.8147C301.36 49.8147 302.612 49.0698 303.516 47.5761C304.296 46.3398 304.68 44.8734 304.68 43.1769Z"
                      fill="black"
                    />
                    <path
                      d="M329.32 52.3887H325.556L325.244 50.271H325.128C323.84 51.9597 322.004 52.806 319.62 52.806C317.84 52.806 316.4 52.2483 315.316 51.1407C314.332 50.1345 313.84 48.8826 313.84 47.3967C313.84 45.1503 314.8 43.4382 316.732 42.2526C318.66 41.067 321.372 40.4859 324.864 40.5132V40.17C324.864 37.7481 323.56 36.5391 320.948 36.5391C319.088 36.5391 317.448 36.9954 316.032 37.9002L315.18 35.217C316.932 34.1601 319.096 33.6297 321.648 33.6297C326.576 33.6297 329.048 36.1647 329.048 41.2347V48.0051C329.048 49.842 329.14 51.3045 329.32 52.3887ZM324.968 46.0707V43.2354C320.344 43.1574 318.032 44.3937 318.032 46.9404C318.032 47.8998 318.296 48.6174 318.836 49.0971C319.376 49.5768 320.064 49.8147 320.884 49.8147C321.804 49.8147 322.664 49.53 323.448 48.9645C324.236 48.3951 324.72 47.6736 324.9 46.7883C324.944 46.5894 324.968 46.3476 324.968 46.0707Z"
                      fill="black"
                    />
                    <path
                      d="M353.14 52.3887H349.42L349.224 49.4364H349.108C347.92 51.6828 345.896 52.806 343.052 52.806C340.78 52.806 338.888 51.9363 337.388 50.1969C335.888 48.4575 335.14 46.1994 335.14 43.4265C335.14 40.4508 335.952 38.0406 337.584 36.1998C339.164 34.4838 341.1 33.6258 343.404 33.6258C345.936 33.6258 347.708 34.4565 348.716 36.1218H348.796V25.5684H352.992V47.4357C352.992 49.2258 353.04 50.8755 353.14 52.3887ZM348.796 44.6355V41.5701C348.796 41.0397 348.756 40.6107 348.68 40.2831C348.444 39.3003 347.936 38.4735 347.164 37.8066C346.384 37.1397 345.444 36.8043 344.36 36.8043C342.796 36.8043 341.572 37.4088 340.672 38.6217C339.78 39.8346 339.328 41.3829 339.328 43.2744C339.328 45.0918 339.756 46.566 340.616 47.7009C341.524 48.9099 342.748 49.5144 344.28 49.5144C345.656 49.5144 346.756 49.0113 347.592 48.0012C348.4 47.0691 348.796 45.9459 348.796 44.6355Z"
                      fill="black"
                    />
                    <path
                      d="M388.992 43.0443C388.992 45.8718 388.164 48.1884 386.508 50.0058C384.772 51.8739 382.476 52.806 379.6 52.806C376.836 52.806 374.632 51.9129 372.984 50.1189C371.344 48.3288 370.524 46.0707 370.524 43.3485C370.524 40.5015 371.368 38.1654 373.064 36.3519C374.76 34.5384 377.04 33.6297 379.916 33.6297C382.68 33.6297 384.908 34.5228 386.588 36.3129C388.188 38.0523 388.992 40.2987 388.992 43.0443ZM384.648 43.1769C384.648 41.4804 384.272 40.0257 383.524 38.8128C382.64 37.3464 381.392 36.6132 379.76 36.6132C378.08 36.6132 376.8 37.3464 375.916 38.8128C375.164 40.0257 374.792 41.5038 374.792 43.251C374.792 44.9475 375.168 46.4022 375.916 47.6151C376.824 49.0815 378.088 49.8147 379.72 49.8147C381.32 49.8147 382.58 49.0698 383.484 47.5761C384.256 46.3398 384.648 44.8734 384.648 43.1769Z"
                      fill="black"
                    />
                    <path
                      d="M411.532 52.3887H407.344V41.8587C407.344 38.6139 406.08 36.9915 403.54 36.9915C402.296 36.9915 401.292 37.4361 400.516 38.3292C399.74 39.2223 399.352 40.2753 399.352 41.4804V52.3848H395.156V39.2574C395.156 37.6428 395.108 35.8917 395.008 33.9963H398.688L398.884 36.8706H399C399.492 35.9775 400.22 35.2404 401.172 34.6515C402.312 33.9651 403.58 33.618 404.976 33.618C406.732 33.618 408.196 34.1718 409.36 35.2833C410.812 36.6444 411.532 38.6763 411.532 41.3751V52.3887V52.3887Z"
                      fill="black"
                    />
                    <path
                      d="M439.744 37.0656H435.128V45.9966C435.128 48.2664 435.948 49.4013 437.572 49.4013C438.324 49.4013 438.948 49.3389 439.44 49.2102L439.548 52.3107C438.72 52.6149 437.632 52.767 436.292 52.767C434.636 52.767 433.348 52.2756 432.416 51.2928C431.48 50.31 431.016 48.6564 431.016 46.3359V37.0656H428.26V34.0041H431.016V30.6345L435.124 29.4255V34.0002H439.74V37.0656H439.744Z"
                      fill="black"
                    />
                    <path
                      d="M461.936 52.3887H457.74V41.9367C457.74 38.6412 456.476 36.9915 453.944 36.9915C452 36.9915 450.672 37.947 449.944 39.858C449.82 40.2597 449.748 40.7511 449.748 41.3283V52.3848H445.56V25.5684H449.748V36.6483H449.828C451.148 34.632 453.04 33.6258 455.492 33.6258C457.228 33.6258 458.664 34.1796 459.804 35.2911C461.224 36.6756 461.936 38.7348 461.936 41.457V52.3887V52.3887Z"
                      fill="black"
                    />
                    <path
                      d="M484.828 42.3267C484.828 43.0599 484.772 43.6761 484.672 44.1792H472.1C472.156 45.9966 472.756 47.3811 473.92 48.3405C474.984 49.1985 476.356 49.6275 478.036 49.6275C479.896 49.6275 481.592 49.3389 483.12 48.7578L483.776 51.597C481.988 52.3536 479.884 52.7319 477.448 52.7319C474.528 52.7319 472.228 51.8934 470.564 50.2164C468.892 48.5394 468.064 46.2891 468.064 43.4655C468.064 40.6926 468.836 38.3838 470.392 36.543C472.016 34.5774 474.212 33.5946 476.984 33.5946C479.696 33.5946 481.756 34.5774 483.148 36.543C484.272 38.103 484.828 40.0335 484.828 42.3267ZM480.828 41.2698C480.86 40.0569 480.584 39.0117 480.016 38.1303C479.288 36.9954 478.18 36.426 476.68 36.426C475.312 36.426 474.196 36.9798 473.344 38.0913C472.648 38.9766 472.236 40.0335 472.1 41.2698H480.828Z"
                      fill="black"
                    />
                    <path
                      d="M214.58 122.866H205.496L200.52 107.62H183.224L178.484 122.866H169.64L186.776 70.9643H197.36L214.58 122.866ZM199.02 101.224L194.52 87.6719C194.044 86.2874 193.152 83.027 191.836 77.8946H191.676C191.152 80.102 190.308 83.3624 189.148 87.6719L184.728 101.224H199.02V101.224Z"
                      fill="black"
                    />
                    <path
                      d="M258.648 103.693C258.648 110.058 256.884 115.089 253.356 118.782C250.196 122.07 246.272 123.712 241.588 123.712C236.532 123.712 232.9 121.941 230.688 118.4H230.528V138.115H222V97.7613C222 93.7599 221.892 89.6532 221.684 85.4412H229.184L229.66 91.3731H229.82C232.664 86.9037 236.98 84.6729 242.772 84.6729C247.3 84.6729 251.08 86.4162 254.104 89.9067C257.136 93.4011 258.648 97.9953 258.648 103.693ZM249.96 103.997C249.96 100.355 249.12 97.3518 247.432 94.9884C245.588 92.5236 243.112 91.2912 240.008 91.2912C237.904 91.2912 235.992 91.9776 234.284 93.3309C232.572 94.6959 231.452 96.4782 230.928 98.6856C230.664 99.7152 230.532 100.558 230.532 101.221V107.461C230.532 110.183 231.388 112.48 233.1 114.356C234.812 116.232 237.036 117.168 239.772 117.168C242.984 117.168 245.484 115.959 247.272 113.549C249.064 111.134 249.96 107.952 249.96 103.997Z"
                      fill="black"
                    />
                    <path
                      d="M302.796 103.693C302.796 110.058 301.032 115.089 297.5 118.782C294.344 122.07 290.42 123.712 285.736 123.712C280.68 123.712 277.048 121.941 274.84 118.4H274.68V138.115H266.152V97.7613C266.152 93.7599 266.044 89.6532 265.836 85.4412H273.336L273.812 91.3731H273.972C276.812 86.9037 281.128 84.6729 286.924 84.6729C291.448 84.6729 295.228 86.4162 298.26 89.9067C301.28 93.4011 302.796 97.9953 302.796 103.693ZM294.108 103.997C294.108 100.355 293.264 97.3518 291.576 94.9884C289.732 92.5236 287.264 91.2912 284.156 91.2912C282.048 91.2912 280.14 91.9776 278.428 93.3309C276.716 94.6959 275.6 96.4782 275.076 98.6856C274.816 99.7152 274.68 100.558 274.68 101.221V107.461C274.68 110.183 275.536 112.48 277.24 114.356C278.952 116.228 281.176 117.168 283.92 117.168C287.132 117.168 289.632 115.959 291.42 113.549C293.212 111.134 294.108 107.952 294.108 103.997Z"
                      fill="black"
                    />
                    <path
                      d="M352.156 108.311C352.156 112.726 350.584 116.317 347.428 119.09C343.96 122.121 339.132 123.634 332.928 123.634C327.2 123.634 322.608 122.557 319.132 120.401L321.108 113.47C324.852 115.678 328.96 116.785 333.436 116.785C336.648 116.785 339.148 116.076 340.944 114.664C342.732 113.252 343.624 111.357 343.624 108.993C343.624 106.887 342.888 105.113 341.412 103.674C339.944 102.235 337.492 100.897 334.068 99.6606C324.748 96.2715 320.092 91.3068 320.092 84.7782C320.092 80.5116 321.724 77.0133 324.992 74.2911C328.248 71.565 332.592 70.2039 338.024 70.2039C342.868 70.2039 346.892 71.0268 350.104 72.6687L347.972 79.4469C344.972 77.8557 341.58 77.0601 337.784 77.0601C334.784 77.0601 332.44 77.7816 330.76 79.2168C329.34 80.4999 328.628 82.0638 328.628 83.9163C328.628 85.9677 329.44 87.6642 331.072 88.998C332.492 90.2304 335.072 91.5642 338.816 93.0033C343.396 94.8012 346.76 96.9033 348.924 99.3135C351.08 101.716 352.156 104.723 352.156 108.311Z"
                      fill="black"
                    />
                    <path
                      d="M380.352 91.6811H370.952V109.851C370.952 114.473 372.608 116.782 375.928 116.782C377.452 116.782 378.716 116.653 379.716 116.395L379.952 122.71C378.272 123.322 376.06 123.63 373.32 123.63C369.952 123.63 367.32 122.628 365.42 120.627C363.528 118.622 362.576 115.261 362.576 110.538V91.6733H356.976V85.4333H362.576V78.581L370.952 76.1162V85.4333H380.352V91.6811Z"
                      fill="black"
                    />
                    <path
                      d="M422.764 103.845C422.764 109.598 421.076 114.321 417.708 118.014C414.176 121.816 409.488 123.712 403.644 123.712C398.012 123.712 393.528 121.891 390.184 118.248C386.84 114.605 385.168 110.007 385.168 104.465C385.168 98.6661 386.888 93.9159 390.34 90.2226C393.784 86.5254 398.432 84.6768 404.276 84.6768C409.908 84.6768 414.44 86.4981 417.86 90.1446C421.132 93.6819 422.764 98.2488 422.764 103.845ZM413.916 104.114C413.916 100.663 413.16 97.7028 411.628 95.2341C409.84 92.2467 407.284 90.7569 403.972 90.7569C400.544 90.7569 397.94 92.2506 396.152 95.2341C394.62 97.7067 393.864 100.714 393.864 104.27C393.864 107.722 394.62 110.682 396.152 113.147C397.996 116.134 400.572 117.624 403.896 117.624C407.152 117.624 409.708 116.103 411.552 113.069C413.124 110.553 413.916 107.562 413.916 104.114Z"
                      fill="black"
                    />
                    <path
                      d="M450.484 92.7537C449.64 92.6016 448.74 92.5236 447.796 92.5236C444.796 92.5236 442.476 93.6273 440.844 95.8386C439.424 97.7886 438.712 100.253 438.712 103.229V122.866H430.188L430.268 97.227C430.268 92.9136 430.16 88.9863 429.948 85.4451H437.376L437.688 92.6055H437.924C438.824 90.1446 440.244 88.1634 442.188 86.6775C444.088 85.3398 446.14 84.6729 448.352 84.6729C449.14 84.6729 449.852 84.7275 450.484 84.825V92.7537Z"
                      fill="black"
                    />
                    <path
                      d="M488.624 102.383C488.624 103.873 488.524 105.128 488.312 106.154H462.728C462.828 109.851 464.064 112.679 466.44 114.629C468.596 116.372 471.384 117.246 474.808 117.246C478.596 117.246 482.052 116.657 485.16 115.475L486.496 121.247C482.864 122.791 478.576 123.56 473.628 123.56C467.676 123.56 463.004 121.852 459.604 118.439C456.212 115.027 454.512 110.444 454.512 104.695C454.512 99.0522 456.092 94.3527 459.256 90.6048C462.568 86.6034 467.044 84.6027 472.676 84.6027C478.208 84.6027 482.396 86.6034 485.24 90.6048C487.492 93.7833 488.624 97.7145 488.624 102.383ZM480.492 100.226C480.548 97.7613 479.992 95.6319 478.836 93.834C477.36 91.5213 475.092 90.3669 472.04 90.3669C469.252 90.3669 466.984 91.494 465.252 93.756C463.832 95.5539 462.988 97.7106 462.728 100.222H480.492V100.226Z"
                      fill="black"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="relative md:h-[600px] md:w-[600px] h-[300px] w-[300px] md:mt-32">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-700 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
              <div className="absolute left-0 top-0 ">
                <div className="relative z-10 overflow-hidden rotate-[-25deg] z-0">
                  <Image
                    src="/iphone-mockup.png"
                    alt="Golden Sports mobile app mockup"
                    width={300}
                    height={500}
                    className="relative z-10 md:h-[475px] h-[300px] w-auto"
                  />
                  <div className="absolute top-0 bottom-0 z-0 md:rounded-[52px] rounded-[30px] overflow-hidden md:w-[228px] w-[146px] px-1">
                    <Image
                      src="/mockup-bg.png"
                      alt="Golden Sports mobile app mockup"
                      width={300}
                      height={600}
                      className="h-full "
                    />
                  </div>
                </div>
              </div>

              <div className="absolute md:right-[150px] right-0 top-0">
                <div className="relative z-10 overflow-hidden">
                  <Image
                    src="/iphone-mockup.png"
                    alt="Golden Sports mobile app mockup"
                    width={300}
                    height={500}
                    className="relative z-10 md:h-[475px] h-[300px] w-auto"
                  />
                  <div className="absolute top-0 bottom-0 z-0 md:rounded-[52px] rounded-[30px] overflow-hidden md:w-[228px] w-[146px] px-1">
                    <Image
                      src="/mockup-bg.png"
                      alt="Golden Sports mobile app mockup"
                      width={300}
                      height={600}
                      className="h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-6xl font-bold mb-8 text-center text-white">
            See how Golden Sports can help you
          </h1>
          <p className="text-xl mb-8 text-center max-w-3xl mx-auto text-white">
            Discover the powerful features designed to streamline your sports
            management.
          </p>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {allFeatures.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="bg-white/60 p-8 rounded-lg my-12 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Experience the power of Spond
            </h2>
            <p className="mb-6">
              Join thousands of teams already using our platform to streamline
              their sports management.
            </p>
            <div className="space-x-4">
              <Link href="/register">
                <Button className="bg-green-600 text-white hover:bg-green-700 rounded-full">
                  Start For Free
                </Button>
              </Link>
            </div>
          </div>

          {/* All Features Carousel */}
          <h2 className="text-3xl font-bold mb-6 text-center">All Features</h2>
          <div className="md:max-w-2xl max-w-md mx-auto">
            <FeatureCarousel features={carouselFeatures} />
          </div>
        </div>
      </MaxWidthWrapper>
      <Footer />
    </>
  );
};

const FeatureCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <ArrowRight className="text-blue-600 mt-4" />
    </div>
  );
};

export default FeaturesPage;
