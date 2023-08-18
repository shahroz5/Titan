import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { LovMaster, LovMasterType } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-lovmaster-view',
  templateUrl: './lovmaster-view.component.html',
  styleUrls: ['./lovmaster-view.component.scss']
})
export class LovmasterViewComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<LovmasterViewComponent>,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
    this.dialogData = data.data;

    data.lovMasterType.forEach(element => {
      this.lovMasterType.push({
        value: element.value,
        name: this.translateService.instant(element.name)
      });
    });
  }
  dialogData: LovMaster;
  lovMasterType: LovMasterType[] = [];

  ngOnInit(): void {
    this.lovMasterType = this.lovMasterType.filter(data => {
      return this.dialogData.lovType === data.value.split('|')[0];
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
