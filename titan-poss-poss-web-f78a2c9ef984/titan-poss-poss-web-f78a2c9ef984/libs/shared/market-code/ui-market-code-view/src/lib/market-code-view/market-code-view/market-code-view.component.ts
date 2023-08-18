import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-market-code-view',
  templateUrl: './market-code-view.component.html'
})
export class MarketCodeViewComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<MarketCodeViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    console.log('data', this.data);
  }
  onClose() {
    this.dialog.closeAll();
  }
}
