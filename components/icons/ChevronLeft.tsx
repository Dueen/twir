import * as React from "react";

type ChevronLeftProps = React.PropsWithChildren<{
  className?: string;
}>;

const ChevronLeft: React.FC<ChevronLeftProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="3"
      strokeLinecap="square"
      strokeLinejoin="bevel"
      className={className}
    >
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );
};

export default ChevronLeft;
