export const Opacity = ({
  children,
  className,
}: {
  children: any;
  className?: any;
}) => (
  <div
    className={`opacity-0 animate-[opacity1_0.2s_forwards_ease-in-out] ${className}`}
  >
    {children}
  </div>
);
