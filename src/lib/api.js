const envUrl = (import.meta.env && import.meta.env.VITE_BACKEND_URL) ? String(import.meta.env.VITE_BACKEND_URL).trim() : '';
// Fallback to window.__BACKEND_URL if provided, otherwise to the live backend URL for this session
const runtimeUrl = (typeof window !== 'undefined' && window.__BACKEND_URL) ? window.__BACKEND_URL : '';
const defaultUrl = 'https://ta-01kah1p7rqn5ywg640y5x8a7qt-8000.wo-wie5k1u5sy03vfwu97vkf6.w.modal.host';

export const API = envUrl || runtimeUrl || defaultUrl;
