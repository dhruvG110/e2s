import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border text-sm font-semibold uppercase tracking-[0.12em] ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "gradient-bg glow-button border-transparent text-white",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-[0_14px_35px_rgba(200,65,65,0.22)] hover:-translate-y-0.5 hover:bg-destructive/90",
        outline:
          "border-border bg-secondary/55 text-foreground hover:-translate-y-0.5 hover:border-primary/45 hover:bg-secondary/80",
        secondary:
          "border-border/80 bg-secondary text-secondary-foreground hover:-translate-y-0.5 hover:bg-secondary/85",
        ghost:
          "border-transparent bg-transparent text-foreground hover:border-border/60 hover:bg-secondary/60",
        link: "border-transparent p-0 text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-4 text-[11px]",
        lg: "h-12 px-8 text-[13px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
