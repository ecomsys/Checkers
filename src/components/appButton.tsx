import React from "react";
import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "accent" | "danger" | "none";
  className?: string;
  title?: string;
  disabled?: boolean;
};

export const AppButton = ({
  children,
  onClick,
  variant = "primary",
  className,
  title,
  disabled = false,
}: ButtonProps) => {
  const baseClasses =
    "rounded-xl font-semibold transition transform active:scale-95";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600 hover:shadow-xl",
    secondary:
      "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 hover:shadow-xl",
    accent:
      "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-xl",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-xl",
    none: ""
  };

  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        className,
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
};
