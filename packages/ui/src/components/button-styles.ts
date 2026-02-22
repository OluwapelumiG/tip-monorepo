import { tv, type VariantProps } from "tailwind-variants";

export const buttonStyles = tv({
  base: "font-semibold rounded-lg flex items-center justify-center transition-all active:scale-95",
  variants: {
    intent: {
      primary: "bg-blue-600 text-white",
      secondary: "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white",
      outline: "border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white",
    },
    size: {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "md",
  },
});

export type ButtonVariants = VariantProps<typeof buttonStyles>;
