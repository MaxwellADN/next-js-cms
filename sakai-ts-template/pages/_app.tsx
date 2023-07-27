import type { AppProps } from 'next/app';
import type { Page } from '../types/types';
import React from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import '../styles/style.scss';
import { Provider } from 'react-redux';
import store from '../store';

type Props = AppProps & {
    Component: Page;
};



export default function MyApp({ Component, pageProps }: Props) {
    if (Component.getLayout) {
        return (
            <Provider store={store}>
                <LayoutProvider>{Component.getLayout(<Component {...pageProps} />)}</LayoutProvider>
            </Provider>
        );
    } else {
        return (
            <Provider store={store}>
                <LayoutProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </LayoutProvider>
            </Provider>
        );
    }
}
