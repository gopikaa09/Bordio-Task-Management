import React, { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [],
    },
    /** Example purpose only, please remove */
    // {
    //     key: 'appsAccount.toolbar',
    //     path: `/frontEndTeam`,
    //     component: lazy(() => import('@/views/TeamsComponents')),
    //     authority: [],
    //     meta: {
    //         // header: 'Toolbar',
    //         headerContainer: true,
    //     },


    // },
    {
        key: 'appsAccount.toolbar',
        path: `/frontEndTeam/:category`,
        component: lazy(() => import('@/views/TeamsComponents')),
        authority: [],
        // meta: {
        //     pageContainerType: 'gutterless',
        //     footer: false,
        // },
        children: [
            {

                key: 'add-tasks',
                path: `add`,
                component: lazy(() => import('@/views/TeamsComponents/TaskCrudRoutes')),
                authority: [],

            },
        ]
    },

]