'using client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ParamProps, TaskParam } from '@/types/task';
import React, { useId, useState } from 'react';

function StringParam({ param, value, updateNodeParamValue }: ParamProps) {
   const id = useId();
   const [internalValue, setInternalValue] = useState(value);
   return (
      <div className="space-y-1 p-1 w-full">
         <Label htmlFor={id} className="text-xs flex">
            {param.name}
            {param.required && <p className="text-red-500">*</p>}
         </Label>
         <Input
            className="text-xs"
            onBlur={e => updateNodeParamValue(e.target.value)} // to stop many re renders
            value={internalValue}
            placeholder="Enter value here"
            onChange={e => setInternalValue(e.target.value)}
            id={id}
         />
         {param.helperText && (
            <p className="text-muted-foreground text-xs">{param.helperText}</p>
         )}
      </div>
   );
}

export default StringParam;
