import { Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';

@Component({
  selector: 'poss-web-pre-melting-details',
  templateUrl: './pre-melting-details.component.html',
  styleUrls: []
})
export class PreMeltingDetailsComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();

  constructor(
    public dialogRef: MatDialogRef<PreMeltingDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {}
  ngOnInit() {
    if (!this.data) {
      this.data.karatage = 0;
      this.data.purity = 0;
      this.data.weight = 0;
    }
  }
  close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
