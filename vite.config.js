import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  
  plugins: [react() , tailwindcss(),],
  base :"/e-commerce_app/",
   server: {
    host: '0.0.0.0',  // مهم لتسمح بالوصول من الهاتف
    port: 5173        // أو أي بورت تستخدمه
  }
})
