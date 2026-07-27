import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export type ContainerProps = HTMLAttributes<HTMLDivElement>;

export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-3xl px-4 sm:px-6", className)}
      {...props}
    />
  );
}
