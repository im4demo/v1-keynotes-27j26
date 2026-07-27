import type { HTMLAttributes } from "react";
import { cn } from "./cn";

const gaps = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
} as const;

export type StackProps = HTMLAttributes<HTMLDivElement> & {
  gap?: keyof typeof gaps;
};

export function Stack({ gap = "md", className, ...props }: StackProps) {
  return (
    <div className={cn("flex flex-col", gaps[gap], className)} {...props} />
  );
}
