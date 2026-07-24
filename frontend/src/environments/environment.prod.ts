export const environment = {
  production: true,
  apiUrl: (window as any).__env?.apiUrl || 'https://rewear-api.onrender.com/api',
  socketUrl: (window as any).__env?.socketUrl || 'https://rewear-api.onrender.com'
};
