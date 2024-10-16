import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function separate(connectionString: string) {
  const parsed = new URL(connectionString);
  return {
    host: parsed.host.split(':')[0],
    port: Number(parsed.port),
    user: parsed.username,
    password: encodeURIComponent(parsed.password),
    database: parsed.pathname.slice(1),
  };
}
