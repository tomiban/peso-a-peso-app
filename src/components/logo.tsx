import { PiggyBank } from 'lucide-react';
import React from 'react';

const Logo = () => {
  return (
    <div className="group flex items-center">
      <div className="relative mr-2 flex h-10 w-10 items-center justify-center">
        <div className="absolute inset-0">
          <div className="h-full w-full rounded-full border-2 border-primary/40 opacity-75 shadow-lg backdrop-blur-sm" />
        </div>
        <div className="relative flex h-full w-full items-center justify-center rounded-full border-2 border-primary bg-primary/5">
          <PiggyBank className="h-6 w-6 text-primary transition-colors duration-300 ease-in-out group-hover:text-blue-500" />
        </div>
      </div>

      <div className="flex flex-col">
        <h1 className="relative text-2xl font-black tracking-tight">
          <span className="animate-gradient-x bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent drop-shadow-sm [text-shadow:_0_1px_3px_rgb(0_0_0_/_20%)]">
            PESO A PESO
          </span>
        </h1>
        <span className="relative bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-center text-xs font-medium tracking-[0.15em] text-transparent">
          Gestión Financiera
          <span className="absolute bottom-[-0.2em] left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </span>
      </div>
    </div>
  );
};

export default Logo;
