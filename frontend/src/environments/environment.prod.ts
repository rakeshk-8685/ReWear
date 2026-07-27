export const environment = {
  production: true,
  apiUrl: (window as any).__env?.apiUrl || 'https://rewear-api-dm0d.onrender.com/api',
  socketUrl: (window as any).__env?.socketUrl || 'https://rewear-api-dm0d.onrender.com',
  firebase: {
    apiKey: "AIzaSyB_9Ibym8TFomkz8bKOTxAYvYzrq_fRRfc",
    authDomain: "rewear-8a08c.firebaseapp.com",
    projectId: "rewear-8a08c",
    storageBucket: "rewear-8a08c.firebasestorage.app",
    messagingSenderId: "255770021363",
    appId: "1:255770021363:web:4e71b5bddd7bfc72829686",
    measurementId: "G-VCMCEYWJNW"
  }
};
