import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface Common {
  variant?: Variant;
  size?: "md" | "lg" | "sm";
  children: ReactNode;
  className?: string;
}

export function Button({ variant = "secondary", size = "md", className, children, ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`btn ${className ?? ""}`} data-variant={variant} data-size={size} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({ to, variant = "secondary", size = "md", className, children }: Common & { to: string }) {
  return (
    <Link to={to} className={`btn ${className ?? ""}`} data-variant={variant} data-size={size}>
      {children}
    </Link>
  );
}
