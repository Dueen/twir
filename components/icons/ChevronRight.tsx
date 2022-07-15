import * as React from "react";

type ChevronRightProps = React.PropsWithChildren<{
  className?: string;
}>;

const ChevronRight: React.FC<ChevronRightProps> = ({ className }) => {
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
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
};

export default ChevronRight;
