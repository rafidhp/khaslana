import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Edit, Trash2, X, Ticket, Tag, Calendar, Info } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import DeleteConfirmationDialog from '@/components/khaslana/delete-confirmation-dialog';

interface Promo {
    id: number;
    name: string;
    type: 'DISKON' | 'PROMO';
    description: string;
    start_date: string;
    end_date: string;
    status: 'SEGERA HADIR' | 'BERLANGSUNG' | 'BERAKHIR';
    discount_percent: number | null;
}

interface Props {
    promos: Promo[];
}

export default function PromoManagement({ promos }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);

    const getTodayString = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        return new Date(now.getTime() - offset).toISOString().slice(0, 10);
    };

    const today = getTodayString();

    const { data, setData, post, put, delete: destroy, processing, reset, clearErrors, errors, transform } = useForm({
        name: '',
        type: 'DISKON',
        description: '',
        start_date: today,
        end_date: '',
        status: 'SEGERA HADIR',
        discount_percent: '',
    });

    const calculateStatus = (start: string, end: string) => {
        if (!start || !end) return 'SEGERA HADIR';
        if (today < start) return 'SEGERA HADIR';
        if (today > end) return 'BERAKHIR';
        return 'BERLANGSUNG';
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStart = e.target.value;
        let newEnd = data.end_date;

        if (newEnd && newStart > newEnd) {
            newEnd = newStart;
        }

        setData(prevData => ({
            ...prevData,
            start_date: newStart,
            end_date: newEnd,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            status: calculateStatus(newStart, newEnd) as any
        }));
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEnd = e.target.value;
        setData(prevData => ({
            ...prevData,
            end_date: newEnd,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            status: calculateStatus(prevData.start_date, newEnd) as any
        }));
    };

    const handleOpenCreate = () => {
        setIsEditing(false);
        setCurrentId(null);
        reset();
        clearErrors();
        setData('start_date', today);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (promo: Promo) => {
        setIsEditing(true);
        setCurrentId(promo.id);
        setData({
            name: promo.name,
            type: promo.type,
            description: promo.description,
            start_date: promo.start_date,
            end_date: promo.end_date,
            status: promo.status,
            discount_percent: promo.discount_percent ? promo.discount_percent.toString() : '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform((currentData) => ({
            ...currentData,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            status: calculateStatus(currentData.start_date, currentData.end_date) as any
        }));

        if (isEditing && currentId) {
            put(`/store-management/promo/${currentId}`, {
                onSuccess: () => setIsModalOpen(false)
            });
        } else {
            post('/store-management/promo', {
                onSuccess: () => setIsModalOpen(false)
            });
        }
    };

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const openDeleteDialog = (id: number) => {
        setDeleteId(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (deleteId) {
            destroy(`/store-management/promo/${deleteId}`, {
                preserveScroll: true,
                onSuccess: () => setIsDeleteDialogOpen(false)
            });
        }
    };

    const inputStyle = "w-full bg-[#1e1b26] border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#99ff33] focus:ring-1 focus:ring-[#99ff33] transition-all";

    return (
        <AppLayout breadcrumbs={[{ title: 'Manajemen Promo', href: '/store-management/promo' }]}>
            <Head title="Manajemen Promo" />

            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                <div>
                    <h1 className="font-semibold text-3xl">Manajemen Promo</h1>
                    <p className="text-[#adaaaa] mt-1">Kelola diskon dan penawaran toko Anda</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 bg-[#99ff33] text-black font-semibold px-5 py-2.5 rounded-xl hover:bg-[#88ee22] transition active:scale-95 cursor-pointer"
                >
                    <Plus className="size-5" /> Tambah Promo
                </button>
            </div>

            {promos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-[#191720] border border-zinc-800 rounded-2xl border-dashed">
                    <Ticket className="size-16 text-zinc-700 mb-4" />
                    <h3 className="text-xl font-medium text-white mb-1">Belum Ada Promo</h3>
                    <p className="text-zinc-500">Mulai buat promo pertama Anda untuk menarik pelanggan.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {promos.map((promo) => (
                        <div key={promo.id} className="bg-[#191720] border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between hover:border-[#99ff33]/50 transition-colors">
                            <div>
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${promo.status === 'BERLANGSUNG' ? 'bg-[#99ff33]/20 text-[#99ff33]' :
                                        promo.status === 'SEGERA HADIR' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {promo.status}
                                    </span>
                                    {promo.type === 'DISKON' && promo.discount_percent && (
                                        <span className="font-bold text-[#99ff33] bg-[#99ff33]/10 px-2 py-0.5 rounded">-{promo.discount_percent}%</span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{promo.name}</h3>
                                <p className="text-[#adaaaa] text-sm line-clamp-2 mb-4">{promo.description}</p>
                            </div>

                            <div className="border-t border-zinc-800 pt-4 flex gap-2">
                                <button onClick={() => handleOpenEdit(promo)} className="flex-1 bg-[#222] hover:bg-[#333] text-white py-2 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer">
                                    <Edit className="size-4" /> Edit
                                </button>
                                <button
                                    onClick={() => openDeleteDialog(promo.id)}
                                    className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer"
                                >
                                    <Trash2 className="size-4" /> Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-[#191720] border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-zinc-800 shrink-0 bg-[#1e1b26]">
                            <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Promo' : 'Buat Promo Baru'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-[#99ff33] transition">
                                <X className="size-6" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar bg-[#191720]">
                            <form id="promoForm" onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">Nama Promo</label>
                                    <input type="text" required value={data.name} onChange={e => setData('name', e.target.value)} className={inputStyle} placeholder="Cth: Promo Kemerdekaan" />
                                    {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name}</span>}
                                </div>

                                <div className="grid grid-cols-2 gap-4 cursor-pointer">
                                    <div>
                                        <label className="block text-sm text-zinc-400 mb-2">Tipe Penawaran</label>

                                        {/* Perbaikan: Menggunakan Komponen Select UI Custom */}
                                        <Select
                                            value={data.type}
                                            onValueChange={(value) => setData('type', value as 'DISKON' | 'PROMO')}
                                        >
                                            <SelectTrigger className="w-full bg-[#1e1b26] border-zinc-700 text-white h-[50px] rounded-xl focus:ring-[#99ff33] px-4 cursor-pointer">
                                                <SelectValue placeholder="Pilih Tipe" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#1e1b26] border-zinc-700 text-white rounded-xl">
                                                <SelectItem value="DISKON" className="focus:bg-[#99ff33]/20 focus:text-[#99ff33] cursor-pointer">Diskon (%)</SelectItem>
                                                <SelectItem value="PROMO" className="focus:bg-[#99ff33]/20 focus:text-[#99ff33] cursor-pointer">Promo Reguler</SelectItem>
                                            </SelectContent>
                                        </Select>

                                    </div>
                                    {data.type === 'DISKON' && (
                                        <div>
                                            <label className="block text-sm text-zinc-400 mb-2">Nilai Diskon (%)</label>
                                            <input type="number" required min="1" max="100" value={data.discount_percent} onChange={e => setData('discount_percent', e.target.value)} className={inputStyle} placeholder="1 - 100" />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">Deskripsi & Syarat</label>
                                    <textarea required rows={3} value={data.description} onChange={e => setData('description', e.target.value)} className={`${inputStyle} resize-none`} placeholder="Masukkan syarat dan ketentuan..."></textarea>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-zinc-400 mb-2">Tanggal Mulai</label>
                                        {/* Perbaikan: Inject colorScheme: 'dark' ke kalender OS bawaan */}
                                        <input
                                            type="date"
                                            required
                                            min={today}
                                            value={data.start_date}
                                            onChange={handleStartDateChange}
                                            style={{ colorScheme: 'dark' }}
                                            className={`${inputStyle} cursor-pointer [&::-webkit-calendar-picker-indicator]:filter-none`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-zinc-400 mb-2">Tanggal Berakhir</label>
                                        <input
                                            type="date"
                                            required
                                            min={data.start_date || today}
                                            value={data.end_date}
                                            onChange={handleEndDateChange}
                                            style={{ colorScheme: 'dark' }}
                                            className={`${inputStyle} cursor-pointer [&::-webkit-calendar-picker-indicator]:filter-none`}
                                        />
                                    </div>
                                </div>

                                <div className="bg-[#13111a] p-4 rounded-xl border border-zinc-800 flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-2">
                                        <Info className="text-zinc-500 size-5" />
                                        <span className="text-sm text-zinc-400">Status Promo Otomatis:</span>
                                    </div>
                                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${data.status === 'BERLANGSUNG' ? 'bg-[#99ff33]/20 text-[#99ff33]' :
                                        data.status === 'SEGERA HADIR' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {data.status}
                                    </span>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-zinc-800 flex justify-end gap-3 shrink-0 bg-[#1e1b26]">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-zinc-700 text-white hover:bg-zinc-800 transition cursor-pointer">Batal</button>
                            <button type="submit" form="promoForm" disabled={processing} className="px-5 py-2.5 rounded-xl bg-[#99ff33] text-black font-bold hover:bg-[#88ee22] disabled:opacity-50 transition cursor-pointer">
                                {processing ? 'Menyimpan...' : 'Simpan Promo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <DeleteConfirmationDialog
                open={isDeleteDialogOpen}
                title="Hapus Promo?"
                description="Apakah Anda yakin ingin menghapus promo ini? Tindakan ini tidak dapat dibatalkan."
                onConfirm={confirmDelete}
                onCancel={() => setIsDeleteDialogOpen(false)}
            />
        </AppLayout>
    );
}