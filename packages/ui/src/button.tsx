import type { ButtonHTMLAttributes } from "react";
import { cn } from "./cn";

const variants = {
  primary:
    "bg-accent text-white hover:bg-accent-hover focus-visible:ring-accent",
  secondary:
    "bg-paper-elevated text-ink border border-paper-line hover:bg-paper focus-visible:ring-ink/20",
  danger:
    "bg-danger text-white hover:bg-danger-hover focus-visible:ring-danger",
  ghost:
    "bg-transparent text-ink-muted hover:bg-paper hover:text-ink focus-visible:ring-ink/20",
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
