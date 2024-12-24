import { PiggyBank } from 'lucide-react';
import React from 'react';

function Logo() {
  return (
    <a href="">
      <PiggyBank className="stroke h-11 stroke-amber-500 stroke-[1.5]" />
      <span className="text-2xl font-bold text-amber-500">BudgetTracker</span>
    </a>
  );
}

export default Logo;
