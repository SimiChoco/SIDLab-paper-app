"use client";

import { addLiked } from "@/lib/db";
import React, { useState } from "react";

type SpeechBubbleProps = {
  comment: string;
  likedNum: number;
  id: string;
};

const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  comment,
  likedNum,
  id,
}) => {
  const [liked, setLiked] = useState(false);
  const [tmpLikedNum, setTmpLikedNum] = useState<number>(likedNum);
  const handleLikedPressed = () => {
    if (!liked) {
      setLiked(true);
      console.log(typeof tmpLikedNum);
      setTmpLikedNum((prevTmpLikeNum) => prevTmpLikeNum + 1);
      addLiked(id);
    }
  };
  return (
    <div
      className="relative flex bg-gray-50 rounded-lg p-2"
      style={{ display: comment ? "true" : "false" }}
    >
      <p className="text-sm text-gray-800 font-serif">{comment}</p>
      <div className="absolute top-1/2 -translate-y-1/2 left-[-8px] w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-50"></div>
      <button
        onClick={handleLikedPressed}
        className="flex items-center gap-1 text-gray-50 ml-4 p-0"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 25 27"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24.0135 13.2563C24.0135 12.879 23.9235 12.525 23.7727 12.2032C22.767 8.95875 18.0585 9.19575 11.361 9.0375C10.2413 9.01125 10.8818 7.689 11.2748 4.7865C11.5305 2.89875 10.3133 0 8.26725 0C4.89375 0 8.139 2.661 5.15625 9.2415C3.5625 12.7575 0 10.788 0 14.3198V22.359C0 23.7338 0.135 25.0552 2.0685 25.2727C3.94275 25.4835 3.52125 26.8192 6.225 26.8192H19.758C20.4209 26.8185 21.0563 26.5547 21.525 26.0859C21.9936 25.6172 22.2572 24.9816 22.2578 24.3187C22.2578 23.7472 22.0575 23.2268 21.7343 22.8053C22.4993 22.377 23.0243 21.5685 23.0243 20.631C23.0243 20.061 22.8248 19.5405 22.5023 19.1198C23.2695 18.6923 23.796 17.883 23.796 16.944C23.796 16.2623 23.52 15.6443 23.0753 15.192C23.3668 14.9604 23.6025 14.6661 23.7649 14.331C23.9273 13.9959 24.0123 13.6286 24.0135 13.2563Z"
            fill="#FFDB5E"
          />
        </svg>
        <span 
          color="#FFDB5E" 
          className="text-sm font-bold text-amber-200"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {tmpLikedNum}
        </span>
      </button>
    </div>
  );
};

export default SpeechBubble;
