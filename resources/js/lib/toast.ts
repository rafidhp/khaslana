import { toast } from "sonner";

const baseStyle = {
    background: '#1E1B26',
    color: '#FFFFFF',
};

export const showSuccessToast = (
    title: string,
    description?: string,
) => {
    toast.success(title, {
        description,
        style: {
            ...baseStyle,
            border: '1px solid rgba(153,255,51,0.5)',
        },
    });
};

export const showErrorToast = (
    title: string,
    description?: string,
) => {
    toast.error(title, {
        description,
        style: {
            ...baseStyle,
            border: '1px solid rgba(255,0,0,0.3)',
        },
    });
};

export const showInfoToast = (
    title: string,
    description?: string,
) => {
    toast(title, {
        description,
        style: {
            ...baseStyle,
            border: '1px solid rgba(255,255,255,0.15)',
        },
    });
};