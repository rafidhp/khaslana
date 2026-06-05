import { useEffect } from 'react';

export function useMidtrans() {
    useEffect(() => {
        const existing = document.getElementById(
            'midtrans-script'
        );

        if (existing) {
            return;
        }
        const script = document.createElement('script');

        script.id = 'midtrans-script';
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute(
            'data-client-key',
            import.meta.env.VITE_MIDTRANS_CLIENT_KEY
        );

        script.async = true;
        document.body.appendChild(script);

        return () => {
            script.remove();
        };
    }, []);
}