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


import { Component, Input, OnInit} from '@angular/core';
import { CmdbMode } from '../../../../framework/modes.enum';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { TypeService } from '../../../../framework/services/type.service';

@Component({
  selector: 'cmdb-task-basic-step',
  templateUrl: './task-basic-step.component.html',
  styleUrls: ['./task-basic-step.component.scss']
})
export class TaskBasicStepComponent implements OnInit {

  @Input()
  set preData(data: any) {
    if (data !== undefined) {
      this.basicForm.patchValue(data);
    }
  }

  @Input() public mode: CmdbMode;
  public modes = CmdbMode;

  public basicForm: FormGroup;

  constructor(private typeService: TypeService) {
    this.basicForm = new FormGroup({
      name: new FormControl('', Validators.required),
      label: new FormControl('', Validators.required),
      description: new FormControl(''),
      active: new FormControl(true)
    });
  }

  public get name() {
    return this.basicForm.get('name');
  }

  public get label() {
    return this.basicForm.get('label');
  }

  ngOnInit() {
    if (this.mode === CmdbMode.Create) {
      this.basicForm.get('label').valueChanges.subscribe(value => {
        this.basicForm.get('name').setValue(value.replace(/ /g, '-').toLowerCase());
        this.basicForm.get('name').markAsDirty({onlySelf: true});
        this.basicForm.get('name').markAsTouched({onlySelf: true});
      });
    } else if (this.mode === CmdbMode.Edit) {
      this.basicForm.markAllAsTouched();
    }
  }
}
