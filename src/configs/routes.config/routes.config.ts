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
    {
        key: 'timeSheets',
        path: '/timeSheets',
        component: lazy(() => import('@/views/TimeSheets/MyTimeSheets')),
        authority: [],
        children: [
            {
                key: 'timeSheets',
                path: '/timeSheets/add',
                component: lazy(() => import('@/views/TimeSheets/MyTimeSheets/')),
                authority: [],
            }
        ]
    },
]