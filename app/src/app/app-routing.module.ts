/*
* dataGerry - OpenSource Enterprise CMDB
* Copyright (C) 2019 NETHINKS GmbH
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConnectionComponent } from './connection/connection.component';
import { AuthComponent } from './auth/auth.component';
import { ConnectionGuard } from './connection/guards/connection.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [ConnectionGuard],
    data: {
      breadcrumb: 'Dashboard'
    },
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'connection',
    component: ConnectionComponent
  },
  {
    path: 'login',
    canActivate: [ConnectionGuard],
    component: AuthComponent
  },
  {
    path: 'search',
    data: {
      breadcrumb: 'Search'
    },
    canActivate: [ConnectionGuard],
    loadChildren: () => import('./search/search.module').then(m => m.SearchModule)
  },
  {
    path: 'framework',
    data: {
      breadcrumb: 'Framework'
    },
    canActivate: [ConnectionGuard],
    loadChildren: () => import('./framework/framework.module').then(m => m.FrameworkModule)
  },
  {
    path: 'user',
    data: {
      breadcrumb: 'User'
    },
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
  },
  {
    path: 'error',
    loadChildren: () => import('./error/error.module').then(m => m.ErrorModule)
  },
  {
    path: '**',
    redirectTo: 'error/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
