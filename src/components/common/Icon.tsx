import styles from './Icon.module.css';

type IconProps = {
  name: string;
  className?: string;
  fill?: boolean;
};

export function Icon({ name, className = '', fill = false }: IconProps) {
  return (
    <span className={`material-symbols-outlined ${fill ? styles.fill : ''} ${styles.icon} ${className}`.trim()}>
      {name}
    </span>
  );
}
