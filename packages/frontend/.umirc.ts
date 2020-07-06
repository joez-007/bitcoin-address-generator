import {IConfig} from 'umi-types';

const config: IConfig = {
    treeShaking: true,
    routes: [
        {
            path: '/',
            component: '../layouts/index',
            routes: [
                {path: '/', component: '../pages/index'},
                {path: '/hd', component: '../pages/hd'},
                {path: '/p2sh', component: '../pages/p2sh'}
            ]
        }
    ],
    // CORS proxy
    proxy: {
        '/v1': {
            target: 'http://localhost:3000',
            changeOrigin: true
        }
    },
    plugins: [
        // ref: https://umijs.org/plugin/umi-plugin-react.html
        ['umi-plugin-react', {
            antd: true,
            dva: true,
            dynamicImport: {webpackChunkName: true},
            title: 'bitcoin-address-generator',
            dll: false,

            routes: {
                exclude: [
                    /models\//,
                    /services\//,
                    /model\.(t|j)sx?$/,
                    /service\.(t|j)sx?$/,
                    /components\//,
                ],
            },
        }],
    ],
}

export default config;
