import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

const CardRoot: React.FC<CardProps> = ({ hover = false, className = '', children, ...props }) => {
  return (
    <div className={`${hover ? 'transition-all duration-300 hover:shadow-2xl hover:-translate-y-1' : ''} glass-card rounded-2xl overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => (
  <div className={`px-6 pt-6 border-b border-border pb-4 ${className}`} {...props}>{children}</div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className = '', children, ...props }) => (
  <h3 className={`text-lg font-semibold text-textMain ${className}`} {...props}>{children}</h3>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => (
  <div className={`px-6 py-6 ${className}`} {...props}>{children}</div>
);

const Card = Object.assign(CardRoot, { Header: CardHeader, Title: CardTitle, Content: CardContent });

export default Card;
