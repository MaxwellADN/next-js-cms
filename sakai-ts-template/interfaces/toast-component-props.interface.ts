export interface ToastComponentPropsInterface {
    severity?: 'success' | 'info' | 'warn' | 'error' | undefined;
    summary: string;
    detail: string;
}