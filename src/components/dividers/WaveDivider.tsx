type WaveDividerProps = {
  color?: string; // tailwind color class
  position?: "top" | "bottom";
};

export default function WaveDivider({
  color = "white",
  position = "bottom",
}: WaveDividerProps) {
  const rotateClass = position === "top" ? "rotate-180" : "";

  return (
    <div className={`w-full overflow-hidden leading-none ${rotateClass}`}>
      <svg
        className="w-full"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          fill={color}
          d="M0,256L48,245.3C96,235,192,213,288,218.7C384,224,480,256,576,256C672,256,768,224,864,181.3C960,139,1056,85,1152,80C1248,75,1344,117,1392,138.7L1440,160V320H0Z"
        />
      </svg>
    </div>
  );
}
