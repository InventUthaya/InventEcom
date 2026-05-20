export const MenuButton = ({
  color,
  text,
}: {
  color: string;
  text: string;
}) => (
  <div
    className={`capitalize cursor-pointer py-3 px-4 sm:px-4 md:px-8 lg:px-15 bg-white rounded-lg shadow-[0px_2px_14px_rgba(83,_83,_83,_0.1)] font-semibold font-figtree text-sm`}
    style={{ color: `#${color}` }}
  >
    {text}
  </div>
);
