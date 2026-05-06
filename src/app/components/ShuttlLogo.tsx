import logoImg from "../../../Logo.png";

interface ShuttlLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ShuttlLogo({ size = "lg", className = "" }: ShuttlLogoProps) {
  const heights = {
    sm: "h-8",
    md: "h-10",
    lg: "h-16",
  };

  return (
    <img
      src={logoImg}
      alt="Shutt'L Up "
      className={`${heights[size]} w-auto object-contain ${className}`}
    />
  );
}
