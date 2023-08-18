import { Component, Inject, OnDestroy } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { subBrandEnum, DialogDataSubbrand } from '@poss-web/shared/models';

import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-sub-brand-details-view',
  templateUrl: './sub-brand-details-view.component.html',
  styleUrls: ['./sub-brand-details-view.component.scss']
})
export class SubBrandDetailsViewComponent implements OnDestroy {
  dialogData: DialogDataSubbrand;
  destroy$: Subject<null> = new Subject<null>();
  readOnly: boolean;
  subBrandEnum: subBrandEnum;
  brandCode: string;
  description: string;
  isActive: boolean;
  parentBrandCode: string;
  /// below is dynamic form specific code
  public currentStyle: string[];
  public formFields: any;
  /// above is dynamic form specific code
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SubBrandDetailsViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogData = data;
  }


  onClose() {
    this.dialogRef.close();
  }

  onCreate() {
    let mode = '';
    if (this.dialogData.subBrandDetails.brandCode !== subBrandEnum.NEW) {
      mode = subBrandEnum.edit;
    } else {
      mode = subBrandEnum.new;
    }

    this.dialogRef.close({
      brandCode: this.brandCode,
      description: this.description,
      parentBrandCode: this.parentBrandCode,
      isActive: this.isActive,
      mode: mode
    });
  }
  deleteButton() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
