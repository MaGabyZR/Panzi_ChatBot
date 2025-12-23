const TypingIndicator = () => {
   return (
      <div className="flex self-start gap-1 px-3 py-3 bg-purple-200 rounded-xl">
         <Dot />
         <Dot className="[animation-delay:0.2s]" />
         <Dot className="[animation-delay:0.4s]" />
      </div>
   );
};

//dots animation.
type DotProps = {
   className?: string;
};
//resusable component for the dots.
const Dot = ({ className }: DotProps) => (
   <div
      className={`w-2 h-2 rounded-full bg-purple-600 animate-pulse ${className}`}
   ></div>
);

export default TypingIndicator;
