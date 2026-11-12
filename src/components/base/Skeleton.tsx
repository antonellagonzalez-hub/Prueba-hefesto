import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils/cn";

const skeletonVariants = cva("animate-pulse bg-muted motion-reduce:animate-none", {
  variants: {
    shape: {
      line: "h-4 w-full rounded",
      avatar: "h-10 w-10 rounded-full",
      block: "h-24 w-full rounded-md",
    },
  },
  defaultVariants: { shape: "line" },
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof skeletonVariants> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ shape, className, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(skeletonVariants({ shape }), className)}
      {...props}
    />
  ),
);
Skeleton.displayName = "Skeleton";

export { Skeleton, skeletonVariants };
