import { CircleDollarSign } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Logo = () => {
  return (
    <Link href={'/'} className={`flex items-center p-2`}>
      <div className="relative mr-2 flex items-center justify-center">
        <div className="absolute -left-0.5 -top-0.5">
          <div className="h-8 w-8 rounded-full border-2 border-primary/40 opacity-60" />
        </div>
        <div className="relative">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary">
            <CircleDollarSign className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Text container */}
      <div className="flex flex-col">
        <h1 className="relative text-2xl font-black tracking-tight">
          <span className="animate-gradient-x bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
            PESO A PESO
          </span>
        </h1>
        <span className="relative bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-center text-xs font-medium tracking-widest text-transparent">
          Gestión Financiera
          <span className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </span>
      </div>
    </Link>
  );
};

export default Logo;
