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

const ForgotPasswordPage: Page = () => {
    const [email, setEmail] = useState('');
    const { layoutConfig } = useContext(LayoutContext);
    const msgs = useRef<Message>(null);
    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const clearMessages = () => {
        msgs.current?.clear();
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await sendActivationLink({ email });
    };

    const sendActivationLink = async (user: UserInterface) => {
        await authService.passwordRecoveryLink(user).then(() => {
            clearMessages();
            msgs.current?.show(
                [{
                    sticky: true,
                    severity: 'success',
                    detail: 'The password recovery link is successfully sent. Please check your emails! ',
                    closable: false
                }]);
        }, (error) => {
            console.log(error);
            if (error.status === 404) {
                clearMessages();
                msgs.current?.show(
                    [{
                        sticky: true,
                        severity: 'error',
                        detail: "This email doesn't exist in our database!",
                        closable: false
                    }]);
            } else {
                clearMessages();
                msgs.current?.show(
                    [{
                        sticky: true,
                        severity: 'error',
                        detail: 'Something went wrong, please try again later!',
                        closable: false
                    }]);
            }
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
                            <div className="text-900 text-3xl font-medium mb-3">Password recovery</div>
                            <span className="text-600 font-medium">Enter your email to receive a link to update your password</span>
                        </div>

                        <div>
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                    Email
                                </label>
                                <InputText
                                    id="email1"
                                    type="text"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className="w-full mb-5"
                                    style={{ padding: '1rem' }} />

                                <Button label="Submit" className="w-full p-3 text-xl" type='submit'></Button>
                            </form>
                        </div>
                        <div className='mt-3'>
                            <Link href={'/auth/login'} className="font-medium no-underline text-right cursor-pointer">
                                <i className="pi pi-sign-in"></i>
                                <span className='ml-2'>Login</span>
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

ForgotPasswordPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default ForgotPasswordPage;
