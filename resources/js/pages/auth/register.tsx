import { Form, Head } from '@inertiajs/react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import React from 'react';

import Google from '@/assets/icons/login/google.svg';
import KhaslanaLogo from '@/assets/images/khaslana.svg';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirm, setShowConfirm] = React.useState(false);
    // const [isNamaClicked, setIsNamaClicked] = React.useState(false);
    // const [isUsernameClicked, setIsUsernameClicked] = React.useState(false);

    return (
        <div className="min-h-screen flex bg-[#1E1B26]">
            <Head title="Register" />
            <div className="hidden lg:flex flex-1 items-center justify-center m-10 rounded-2xl bg-[linear-gradient(180deg,#000000_40%,rgba(153,255,51,0.9)_100%)]">
                <div className="flex flex-col items-center gap-3">
                    <img src={KhaslanaLogo} className="w-[360px]" />
                    <p className="text-white font-bold pt-8 text-6xl">Khaslana</p>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center px-6 lg:px-16 py-12 relative">
                <a href="/" className="absolute top-10 left-6 flex items-center gap-2 text-[#99FF33]">
                    <ArrowLeft className="w-5 h-5" />
                    Beranda
                </a>
                <div className="w-full">
                    <div className="flex flex-col gap-2 mb-6">
                        <h1 className="text-white text-[42px] font-medium">
                            Buat akun
                        </h1>
                        <p className="text-[#989898] text-[14px]">
                            Sudah punya akun?{" "}
                            <TextLink href={login()} className="text-[#99FF33] no-underline">
                                Login
                            </TextLink>
                        </p>
                    </div>
                    <Form
                        {...store.form()}
                        resetOnSuccess={['password', 'password_confirmation']}
                        className="flex flex-col gap-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="flex flex-col md:flex-row gap-3.5 w-full">
                                    <div className="flex flex-1 bg-blue items-center gap-3 bg-[#322F39] border border-[#3A3845] rounded-[16px] px-5 py-3 focus-within:border-[#99FF33] transition">
                                        <input
                                            name="name"
                                            placeholder="Nama lengkap"
                                            // onFocus={() => setIsNamaClicked(true)}
                                            // onBlur={() => setIsNamaClicked(false)}
                                            className="bg-transparent outline-none text-white text-[16px] placeholder:text-[#A3A3A3]"
                                        />
                                    </div>
                                    <InputError message={errors.name} />
                                    <div className="flex flex-1 bg-red items-center gap-3 bg-[#322F39] border border-[#3A3845] rounded-[16px] px-5 py-3 focus-within:border-[#99FF33] transition">
                                        <input
                                            name="username"
                                            placeholder="Username"
                                            // onFocus={() => setIsUsernameClicked(true)}
                                            // onBlur={() => setIsUsernameClicked(false)}
                                            className="bg-transparent outline-none text-white text-[16px] placeholder:text-[#A3A3A3]"
                                        />
                                    </div>
                                    <InputError message={errors.username} />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-3 bg-[#322F39] border border-[#3A3845] rounded-[16px] px-5 py-3 focus-within:border-[#99FF33] transition">
                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="Email"
                                            className="flex-1 bg-transparent outline-none text-white text-[16px] placeholder:text-[#A3A3A3]"
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-3 bg-[#322F39] border border-[#3A3845] rounded-[16px] px-5 py-3 focus-within:border-[#99FF33] transition">
                                        <input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            className="flex-1 bg-transparent outline-none text-white text-[16px] placeholder:text-[#A3A3A3]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="opacity-60 hover:opacity-100 transition"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-3 bg-[#322F39] border border-[#3A3845] rounded-[16px] px-5 py-3 focus-within:border-[#99FF33] transition">
                                        <input
                                            name="password_confirmation"
                                            type={showConfirm ? "text" : "password"}
                                            placeholder="Confirm Password"
                                            className="flex-1 bg-transparent outline-none text-white text-[16px] placeholder:text-[#A3A3A3]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="opacity-60 hover:opacity-100 transition"
                                        >
                                            {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password_confirmation} />
                                </div>
                                <div className="flex items-center gap-2 px-1 text-[14px] text-[#989898]">
                                    <input type="checkbox" name="terms" id='terms' className="accent-[#99FF33] w-[18px] h-[18px]" />
                                    <label htmlFor="terms" className='hover:cursor-pointer'>
                                        Saya setuju terhadap{" "}
                                        <span className="text-[#99FF33] underline underline-offset-2">
                                            syarat dan ketentuan
                                        </span>
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn-primary-khaslana hover:cursor-pointer w-full mt-4 py-4 rounded-full text-black hover:text-[#99FF33] font-bold"
                                >
                                    {processing && <Spinner />}
                                    Buat akun
                                </button>
                                <button
                                    type="button"
                                    className="btn-secondary-khaslana hover:cursor-pointer gap-2"
                                >
                                    <img src={Google} className="w-6 h-6 pb-1" />
                                    Google
                                </button>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </div>
    );
}