import { Form, Head } from '@inertiajs/react';
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import React from 'react';
import Google from '@/assets/icons/login/google.svg';
import KhaslanaLogo from '@/assets/images/khaslana.svg';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register, home, googleAuth } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleGoogleLogin = () => {
        window.location.href = googleAuth().url;
    };

    return (
        <div className="min-h-screen flex bg-[#1E1B26]">
            <Head title='Login'>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="hidden lg:flex flex-1 items-center justify-center m-10 rounded-2xl bg-[linear-gradient(180deg,#000000_40%,rgba(153,255,51,0.9)_100%)]">
                <div className="flex flex-col items-center gap-3">
                    <img src={KhaslanaLogo} className="w-[360px]" />
                    <p className="text-white font-bold pt-8 text-6xl">Khaslana</p>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center px-6 lg:px-16 py-12 relative">
                <a
                    href={home().url}
                    className="absolute top-10 left-6 flex items-center gap-2 text-[#99FF33] group transition-all duration-300"
                >
                    <ChevronLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-2" />
                    Beranda
                </a>
                <div className="w-full">
                    <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-medium mb-16">
                        Selamat datang kembali
                    </h1>
                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="flex flex-col gap-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="flex items-center gap-3 bg-[#322F39] border border-[#3A3845] rounded-full px-5 py-3 focus-within:border-[#99FF33]">
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        tabIndex={1}
                                        autoFocus
                                        className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-[#A3A3A3]"
                                    />
                                </div>
                                <InputError message={errors.email} />
                                <div className="flex items-center gap-3 bg-[#322F39] border border-[#3A3845] rounded-full px-5 py-3 focus-within:border-[#99FF33]">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        tabIndex={2}
                                        className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-[#A3A3A3]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="opacity-60 hover:opacity-100 transition hover:cursor-pointer"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5 text-white" />
                                        ) : (
                                            <Eye className="w-5 h-5 text-white" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                                <div className="flex justify-between items-center text-sm px-1">
                                    <div className="flex items-center gap-2 text-[14px] text-[#989898]">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            id='remember'
                                            value="1"
                                            className="accent-[#99FF33] w-[18px] h-[18px]"
                                        />
                                        <Label htmlFor='remember' className='hover:cursor-pointer'>
                                            Ingat saya
                                        </Label>
                                    </div>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-[#C1C1C1] hover:text-[#99FF33]"
                                        >
                                            Lupa Password?
                                        </TextLink>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    tabIndex={3}
                                    className="btn-primary-khaslana hover:cursor-pointer w-full mt-4 py-4 rounded-full text-black hover:text-[#99FF33] font-bold"
                                >
                                    {processing && <Spinner />}
                                    Masuk
                                </button>
                                <button
                                    onClick={handleGoogleLogin}
                                    type="button"
                                    className="btn-secondary-khaslana hover:cursor-pointer gap-2"
                                >
                                    <img src={Google} className="w-6 h-6 pb-1" />
                                    Google
                                </button>
                                {canRegister && (
                                    <div className="text-center text-sm text-[#C1C1C1] mt-3">
                                        Belum punya akun?{" "}
                                        <TextLink
                                            href={register()}
                                            className="text-[#99FF33] no-underline hover:no-underline"
                                        >
                                            Buat akun
                                        </TextLink>
                                    </div>
                                )}
                            </>
                        )}
                    </Form>

                    {status && (
                        <div className="mt-4 text-center text-sm text-green-500">
                            {status}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}