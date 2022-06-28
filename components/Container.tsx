import * as React from "react";

type ContainerProps = React.PropsWithChildren<{
  className?: string;
  children: React.ReactNode;
}>;

export const Container: React.FC<ContainerProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className="lg:px-8" {...props}>
      <div className="lg:max-w-4xl">
        <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
          {children}
        </div>
      </div>
    </div>
  );
};
