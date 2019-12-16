import React from 'react';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

// const Overview = React.lazy(() => import('./Views/Overview'));
const Users = React.lazy(() => import('./Views/Users'));
const Clients = React.lazy(() => import('./Views/Clients'));
const Processors = React.lazy(() => import('./Views/Processors'));
const Orders = React.lazy(() => import('./Views/Orders'));


const routes = [
    // { path: '/overview', exact: true, name: 'Overview', component: Overview },
    { path: '/users', exact: true, name: 'Users', component: Users },
    { path: '/clients', exact: true, name: 'Clients', component: Clients },
    { path: '/processors', exact: true, name: 'Processors', component: Processors },
    { path: '/reports', exact: true, name: 'Reports', component: Orders },
];

export default routes;