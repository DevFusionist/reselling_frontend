type SlantedDividerProps = {
  color?: string;
  direction?: "up" | "down";
  angle?: number; // degrees
  height?: string; // tailwind height class
};

export default function SlantedDivider({
  color = "white",
  direction = "down",
  angle = 3,
  height = "h-24",
}: SlantedDividerProps) {
  const rotate = direction === "down" ? angle : -angle;

  return (
    <div className={`relative w-full ${height} overflow-hidden`}>
      <div
        className="absolute inset-0 origin-top-left"
        style={{
          backgroundColor: color,
          transform: `rotate(${rotate}deg)`,
        }}
      ></div>
    </div>
  );
}
