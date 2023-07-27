/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import React, { FormEventHandler, useContext, useRef, useState } from 'react';
import AppConfig from '../../../layout/AppConfig';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Page } from '../../../types/types';
import authService from '../../../services/auth.service';
import { CONNECTED_USER } from '../../../constants/api.constant';
import Link from 'next/link';
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';
import { UserInterface } from '../../../interfaces/user.interface';
import Layout from '../../../layout/layout';

const RegisterPage: Page = () => {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreeWithTerms, setAgreeWithTerms] = useState(false);
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const msgs = useRef<Message>(null);
    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const clearMessages = () => {
        msgs.current?.clear();
    };

    const handleFullnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFullname(e.target.value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    };

    const handleAgreeWithTerms = (e: CheckboxChangeEvent) => {
        const isChecked = e.checked
        setChecked(isChecked!);
        setAgreeWithTerms(isChecked!);
    };


    const handleSubmit = async (event: any) => {
        event.preventDefault();
        if (!agreeWithTerms) {
            clearMessages();
            msgs.current?.show(
                [{
                    sticky: true,
                    severity: 'warn',
                    detail: 'You need to agree to terms and conditions before signing up!',
                    closable: false
                }]);
        } else {
            await registerUser({ fullname, email, password, agreeWithTerms })
        }
    };

    const registerUser = async (user: UserInterface) => {
        await authService.register(user).then((result) => {
            localStorage.setItem(CONNECTED_USER, JSON.stringify(result.data, null, 2));
            router.push('/');
        }, (error) => {
            console.log(error);
        });
    }

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />

                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="flex align-items-center justify-content-between">
                                <Messages ref={msgs} />
                            </div>
                            {/* <img src="/demo/images/login/avatar.png" alt="Image" height="50" className="mb-3" /> */}
                            <div className="text-900 text-3xl font-medium mb-3">Create your account</div>
                            <span className="text-600 font-medium">Sign up to continue</span>
                        </div>

                        <div>
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="fullname" className="block text-900 text-xl font-medium mb-2">
                                    Fullname
                                </label>
                                <InputText
                                    id="fullname"
                                    type="text"
                                    placeholder="Email address"
                                    value={fullname}
                                    onChange={handleFullnameChange}
                                    className="w-full md:w-30rem mb-5"
                                    style={{ padding: '1rem' }} />

                                <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                    Email
                                </label>
                                <InputText
                                    id="email1"
                                    type="text"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className="w-full md:w-30rem mb-5"
                                    style={{ padding: '1rem' }} />

                                <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                    Password
                                </label>
                                <Password
                                    inputId="password1"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    placeholder="Password"
                                    toggleMask
                                    className="w-full mb-5"
                                    inputClassName="w-full p-3 md:w-30rem">
                                </Password>

                                <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                    <div className="flex align-items-center">
                                        <Checkbox
                                            inputId="agreeWithTerms"
                                            checked={agreeWithTerms}
                                            onChange={handleAgreeWithTerms}
                                            className="mr-2"
                                        ></Checkbox>
                                        <label htmlFor="agreeWithTerms">
                                            <Link href="#">
                                                Agree to terms and conditions
                                            </Link>
                                        </label>
                                    </div>
                                </div>

                                <Button label="Sign Up" className="w-full p-3 text-xl" type='submit'></Button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

RegisterPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default RegisterPage;
