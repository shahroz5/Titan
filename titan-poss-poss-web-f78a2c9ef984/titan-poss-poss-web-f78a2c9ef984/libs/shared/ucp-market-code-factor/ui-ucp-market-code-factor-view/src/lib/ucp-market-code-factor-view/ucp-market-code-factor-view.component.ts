import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-ucp-market-code-factor-view',
  templateUrl: './ucp-market-code-factor-view.component.html',
  styleUrls: []
})
export class UcpMarketCodeFactorViewComponent {
  dialogData: any;

  constructor(
    public dialogRef: MatDialogRef<UcpMarketCodeFactorViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogData = data;
  }

  onClose() {
    this.dialogRef.close();
  }
}
