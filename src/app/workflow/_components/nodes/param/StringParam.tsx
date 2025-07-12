"using client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ParamProps } from "@/types/task";
import React, { useEffect, useId, useState } from "react";

function StringParam({
   param,
   value,
   updateNodeParamValue,
   disabled,
}: ParamProps) {
   const id = useId();
   const [internalValue, setInternalValue] = useState(value);

   useEffect(() => {
      setInternalValue(value);
   }, [value]);

   let Component: any = Input;
   if (param.variant === "textarea") {
      Component = Textarea;
   }
   return (
      <div className="space-y-1 p-1 w-full">
         <Label htmlFor={id} className="text-xs flex">
            {param.name}
            {param.required && <p className="text-red-500">*</p>}
         </Label>
         <Component
            disabled={disabled}
            className="text-xs"
            onBlur={(e: any) => updateNodeParamValue(e.target.value)} // to stop many re renders
            value={internalValue}
            placeholder="Enter value here"
            onChange={(e: any) => setInternalValue(e.target.value)}
            id={id}
         />
         {param.helperText && (
            <p className="text-muted-foreground text-xs">{param.helperText}</p>
         )}
      </div>
   );
}

export default StringParam;
