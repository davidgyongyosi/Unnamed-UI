/**
 * Alert component types and definitions
 */

export type NxAlertType = 'info' | 'success' | 'warning' | 'error';

export interface NxAlertConfig {
  type: NxAlertType;
  message?: string;
  description?: string;
  closable?: boolean;
  showIcon?: boolean;
  banner?: boolean;
  icon?: string;
}

export interface NxAlertIcons {
  info: string;
  success: string;
  warning: string;
  error: string;
}