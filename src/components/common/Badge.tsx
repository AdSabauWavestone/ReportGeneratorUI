import type { PropsWithChildren } from 'react';
import styles from './Badge.module.css';

type BadgeVariant = 'default' | 'secondary' | 'outline';

export function Badge({ children, variant = 'default' }: PropsWithChildren<{ variant?: BadgeVariant }>) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>;
}
