export const DropDownIcon = ({ color }: { color?: string }) => (
  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1L5 5L9 1"
      className="group-hover:stroke-[#EA002A]"
      stroke={`#${color}`}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LocationIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.5455 10.7727C19.5455 16.8182 11.7727 22 11.7727 22C11.7727 22 4 16.8182 4 10.7727C4 8.71127 4.81891 6.73425 6.27658 5.27658C7.73425 3.81891 9.71127 3 11.7727 3C13.8342 3 15.8112 3.81891 17.2689 5.27658C18.7265 6.73425 19.5455 8.71127 19.5455 10.7727Z"
      stroke="#EA002A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.5 12.5C12.6046 12.5 13.5 11.6046 13.5 10.5C13.5 9.39543 12.6046 8.5 11.5 8.5C10.3954 8.5 9.5 9.39543 9.5 10.5C9.5 11.6046 10.3954 12.5 11.5 12.5Z"
      stroke="#EA002A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
