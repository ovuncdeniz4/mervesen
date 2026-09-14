import * as React from "react";
import { cn } from "cn";

/** Native select so server-action forms keep a real `name` value. */
function NativeSelect({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="native-select"
      className={cn(
        "h-11 w-full min-w-0 rounded-lg border border-input bg-paper px-2.5 text-base text-espresso outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 md:h-8 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { NativeSelect };
