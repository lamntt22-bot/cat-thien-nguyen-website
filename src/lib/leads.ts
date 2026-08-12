export const PHONE_RE = /^(\+84|0)\d{9,10}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface RegisterPayload {
  name: string;
  phone: string;
  email: string;
  product?: string;
  website?: string; // honeypot
}
