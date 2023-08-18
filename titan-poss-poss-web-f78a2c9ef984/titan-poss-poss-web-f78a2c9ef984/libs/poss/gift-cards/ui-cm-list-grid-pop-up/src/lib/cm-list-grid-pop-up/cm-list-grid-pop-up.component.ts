import { ChangeDetectionStrategy, Component, Inject, OnChanges, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CancellableCashMemoData } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-cm-list-grid-pop-up',
  templateUrl: './cm-list-grid-pop-up.component.html',
  styleUrls: ['./cm-list-grid-pop-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CmListGridPopUpComponent implements OnChanges, OnInit {
  
  selectedCM: CancellableCashMemoData;
  gcCashMemoList: any[];

  constructor(public dialogRef: MatDialogRef<CmListGridPopUpComponent>,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: { gcCashMemoList: CancellableCashMemoData[] }) { }

  ngOnChanges() {
    this.gcCashMemoList = this.data.gcCashMemoList;
  }

  ngOnInit() {
    this.gcCashMemoList = this.data.gcCashMemoList;
  }

  getSelectedCM(selectedCM: CancellableCashMemoData) {
    this.selectedCM = selectedCM;
    this.dialogRef.close(this.selectedCM);
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

}
