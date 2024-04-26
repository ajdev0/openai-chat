import Link from "next/link";
import React from "react";

type Props = {};

const Start: React.FC<Props> = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <h2 className="text-center font-ibm text-[#FFA34D] text-4xl font-black">
        Techy Chat
      </h2>
      <p className="text-center text-wrap max-w-[660px] font-ibm">
        👋 Hey there! I'm Techy, your software engineering guru. Need help with
        coding? Just ask! I'll explain everything in simple terms with
        real-world examples. Let's dive in!
      </p>

      <Link
        href="/chat"
        className="font-ibm bg-gradient-to-t  from-[#FFA34D] to-[#ff7c00] px-4 py-2 rounded shadow"
      >
        Start Chat
      </Link>
    </div>
  );
};

export default Start;
