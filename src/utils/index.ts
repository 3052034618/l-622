import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('zh-CN').format(num);
}

export function formatPercent(value: number): string {
  return `${value}%`;
}

export function formatCountdown(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'warning',
    confirmed: 'primary',
    completed: 'success',
    cancelled: 'slate',
    locked: 'warning',
    normal: 'success',
    abnormal: 'danger',
    approved: 'success',
    rejected: 'danger',
    escalated: 'danger',
    recheck_required: 'warning',
  };
  return colors[status] || 'slate';
}

export function getStatusText(status: string): string {
  const texts: Record<string, string> = {
    pending: '待确认',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消',
    locked: '锁定中',
    normal: '正常',
    abnormal: '异常',
    approved: '已通过',
    rejected: '已驳回',
    escalated: '已越级',
    recheck_required: '需复检',
    waived: '候补',
  };
  return texts[status] || status;
}

export function getRoleText(role: string): string {
  const texts: Record<string, string> = {
    employee: '员工',
    doctor: '医生',
    hr: 'HR管理员',
    admin: '系统管理员',
  };
  return texts[role] || role;
}

export function getGenderText(gender: string): string {
  return gender === 'male' ? '男' : '女';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}

export function getInitials(name: string): string {
  return name.charAt(0).toUpperCase();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone: string): boolean {
  const re = /^1[3-9]\d{9}$/;
  return re.test(phone);
}
