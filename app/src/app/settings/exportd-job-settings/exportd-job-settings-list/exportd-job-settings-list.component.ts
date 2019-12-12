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


import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { BehaviorSubject, Subject } from 'rxjs';
import { ExportdJobService } from '../../services/exportd-job.service';
import { ExportdJob } from '../../models/exportd-job';
import { Router } from '@angular/router';
import { ToastService } from '../../../layout/toast/toast.service';
import { ModalComponent } from '../../../layout/helpers/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, timer } from 'rxjs';
import { ExecuteState } from '../../models/modes_job.enum';

@Component({
  selector: 'cmdb-task-settings-list',
  templateUrl: './exportd-job-settings-list.component.html',
  styleUrls: ['./exportd-job-settings-list.component.scss']
})
export class ExportdJobSettingsListComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, {static: false})
  public dtElement: DataTableDirective;
  public dtOptions: any = {};
  public dtTrigger: Subject<any> = new Subject();
  private reloadDt: boolean = true;
  public taskList: BehaviorSubject<ExportdJob[]> = new BehaviorSubject<ExportdJob[]>([]);

  public modes = ExecuteState;
  private subscription: Subscription;

  constructor(private taskService: ExportdJobService, private router: Router,
              private toast: ToastService, private modalService: NgbModal) { }

  ngOnInit() {
    this.dtOptions = {
      ordering: true,
      order: [[1, 'desc']],
      dom:
        '<"row" <"col-sm-2" l><"col" f> >' +
        '<"row" <"col-sm-12"tr>>' +
        '<\"row\" <\"col-sm-12 col-md-5\"i> <\"col-sm-12 col-md-7\"p> >',
      language: {
        search: '',
        searchPlaceholder: 'Filter...'
      }
    };

    this.subscription = timer(0, 10000).subscribe(result => {
      this.taskService.getTaskList().subscribe((list: ExportdJob[]) => {
        this.taskList.next(list);
        this.rerender(this.reloadDt);
        this.reloadDt = false;
      });
    });
  }

  public run_job_manual(job: ExportdJob) {
    job.running = true;
    job.state = ExecuteState.RUNNING;
    this.taskService.putTask(job).subscribe(value => console.log(value),
      error => {},
      () =>
        this.taskService.run_task(job.public_id).subscribe(resp => console.log(resp),
          error => {},
          () => this.taskService.getTaskList().subscribe((list: ExportdJob[]) => {
            this.taskList.next(list);
            this.toast.show(`Exportd Job was started: Exportd ID: ${job.public_id}`);
          }))
    );
  }

  public delTask(itemID: number) {

    const modalComponent = this.modalService.open(ModalComponent);
    modalComponent.componentInstance.title = 'Delete Exportd Job';
    modalComponent.componentInstance.modalMessage = 'Are you sure you want to delete this Exportd Job?';
    modalComponent.componentInstance.buttonDeny = 'Cancel';
    modalComponent.componentInstance.buttonAccept = 'Delete';
    modalComponent.result.then((result) => {
      if (result) {
        this.taskService.deleteTask(itemID).subscribe(resp => console.log(resp),
          error => {},
          () => this.taskService.getTaskList().subscribe((list: ExportdJob[]) => {
            this.taskList.next(list);
          }));
      }
    });
  }

  private rerender(reload: boolean = true): void {
    if (!reload) {
      return;
    } else if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    } else {
      this.dtTrigger.next();
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    this.subscription.unsubscribe();
  }
}