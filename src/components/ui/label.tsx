import * as React from "react";

import { cn } from "@/lib/utils";

// shadcn/ui Label, using a native <label> instead of the Radix primitive so it
// ships no client-side JavaScript. Styling and API are unchanged.
function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-base leading-snug font-semibold text-ink select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Label };
