type GradientDividerProps = {
  from?: string; // tailwind classes
  to?: string;
  height?: string; // tailwind height
  direction?: "top" | "bottom";
};

export default function GradientDivider({
  from = "transparent",
  to = "white",
  height = "h-32",
  direction = "bottom",
}: GradientDividerProps) {
  const gradient =
    direction === "bottom"
      ? `bg-gradient-to-b from-${from} to-${to}`
      : `bg-gradient-to-t from-${from} to-${to}`;

  return <div className={`w-full ${height} ${gradient}`} />;
}
