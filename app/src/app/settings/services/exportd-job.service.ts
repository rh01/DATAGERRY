/*
* DATAGERRY - OpenSource Enterprise CMDB
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


import { Injectable } from '@angular/core';
import { ApiCallService } from '../../services/api-call.service';
import { ExportdJob } from '../models/exportd-job';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExportdJobService {

  private servicePrefix: string = 'exportdjob';
  private taskList: ExportdJob[];

  constructor(private api: ApiCallService) {
    this.getTaskList().subscribe((list: ExportdJob[]) => {
      this.taskList = list;
    });
  }

  public findTask(publicID: number): ExportdJob {
    return this.taskList.find(task => task.public_id === publicID);
  }

  public getTask(publicID: number) {
    return this.api.callGetRoute<ExportdJob>(this.servicePrefix + '/' + publicID);
  }

  public getTaskList() {
    return this.api.callGetRoute<ExportdJob[]>(this.servicePrefix + '/');
  }

  // CRUD calls
  public postTask(taskInstance: ExportdJob): Observable<any> {
    return this.api.callPostRoute<ExportdJob>(this.servicePrefix + '/', taskInstance);
  }

  public putTask( taskInstance: ExportdJob): Observable<any> {
    return this.api.callPutRoute(this.servicePrefix + '/', taskInstance);
  }

  public deleteTask(publicID: number) {
    return this.api.callDeleteRoute<number>(this.servicePrefix + '/' + publicID);
  }

  public run_task(publicID: number) {
    return this.api.callGetRoute<ExportdJob>(this.servicePrefix + '/manual/' + publicID);
  }
}
