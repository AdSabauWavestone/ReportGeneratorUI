import type { InputHTMLAttributes, PropsWithChildren, TextareaHTMLAttributes } from 'react';
import styles from './Field.module.css';

export function Label({ children, htmlFor }: PropsWithChildren<{ htmlFor?: string }>) {
  return <label className={styles.label} htmlFor={htmlFor}>{children}</label>;
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${styles.input} ${props.className ?? ''}`.trim()} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${styles.textarea} ${props.className ?? ''}`.trim()} />;
}
