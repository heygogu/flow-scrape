import { Loader2Icon } from 'lucide-react';
import React from 'react';

function loading() {
   return (
      <div className="flex h-screen justify-center items-center w-full">
         <Loader2Icon size={30} className="animate-spin stroke-primary" />
      </div>
   );
}

export default loading;
