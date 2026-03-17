import type { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import styles from './Card.module.css';

type CardProps = PropsWithChildren<HTMLAttributes<HTMLElement>>;

export function Card({ children, className = '', ...props }: CardProps) {
  return <section {...props} className={`${styles.card} ${className}`.trim()}>{children}</section>;
}

export function CardHeader({ children, className = '', ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div {...props} className={`${styles.header} ${className}`.trim()}>{children}</div>;
}

export function CardTitle({ children, className = '', ...props }: PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>) {
  return <h2 {...props} className={`${styles.title} ${className}`.trim()}>{children}</h2>;
}

export function CardDescription({ children, className = '', ...props }: PropsWithChildren<HTMLAttributes<HTMLParagraphElement>>) {
  return <p {...props} className={`${styles.description} ${className}`.trim()}>{children}</p>;
}

export function CardContent({ children, className = '', ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div {...props} className={`${styles.content} ${className}`.trim()}>{children}</div>;
}

export function CardActions({ children, className = '', ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div {...props} className={`${styles.actions} ${className}`.trim()}>{children}</div>;
}
