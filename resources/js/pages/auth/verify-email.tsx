// Components
import { Form, Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Verifikasi email"
            description="Silakan periksa dan verifikasi email Anda terlebih dahulu dengan menekan link yang kami berikan di email Anda."
        >
            <Head title="Email verification" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Link verifikasi baru berhasil dikirim ke email Anda, silakan periksa email Anda sekarang.
                </div>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button
                            disabled={processing}
                            variant="secondary"
                            className='
                                bg-[#99FF33]
                                border border-[#99FF33]
                                hover:bg-[#1E1B26]
                                text-[#1E1B26] hover:text-[#99FF33]
                                transition-colors duration-200
                                hover:cursor-pointer
                            '
                        >
                            {processing && <Spinner />}
                            Kirim ulang verifikasi email
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-sm cursor-pointer"
                        >
                            Keluar
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
