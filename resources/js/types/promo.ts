export interface Promo {
    id: number;
    name: string;
    type: 'DISKON' | 'PROMO';
    description: string;
    image: string | null;
    start_date: string;
    end_date: string;
    status: 'SEGERA HADIR' | 'BERLANGSUNG' | 'BERAKHIR';
    discount_percent: number | null;
}