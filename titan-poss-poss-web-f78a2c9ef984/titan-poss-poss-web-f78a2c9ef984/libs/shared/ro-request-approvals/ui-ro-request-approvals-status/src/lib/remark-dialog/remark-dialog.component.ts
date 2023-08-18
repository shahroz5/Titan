import {
  Component,
  ViewChildren,
  ViewContainerRef,
  QueryList,
  OnDestroy,
  OnInit,
  Inject
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-remark-dialog',
  templateUrl: './remark-dialog.component.html'
})
export class RemarkDialogComponent implements OnInit, OnDestroy {
  params: any;
  remarksControl: FormControl;

  @ViewChildren('input', { read: ViewContainerRef })
  public inputs: QueryList<any>;
  destroy$: Subject<null> = new Subject<null>();
  remarksPlaceHolder: string;
  readOnly: any;
  constructor(
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    public dialogRef: MatDialogRef<RemarkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.translate
      .get(['pw.remarksPopup.remarksPlaceHolder'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.remarksPlaceHolder =
          translatedMessages['pw.remarksPopup.remarksPlaceHolder'];
      });
    this.params = data;
    this.readOnly = data.readOnly;
  }
  ngOnInit(): void {
    this.remarksControl = new FormControl(
      this.params.value,
      this.readOnly
        ? []
        : [
            this.fieldValidatorsService.requiredField(this.remarksPlaceHolder),
            this.fieldValidatorsService.remarkField(this.remarksPlaceHolder)
          ]
    );
  }

  closePopup() {
    this.remarksControl.reset();
    this.dialogRef.close({
      type: 'clear',
      data: null
    });
    // this.params.api.stopEditing();
  }
  closeReadOnlyPopup() {
    this.dialogRef.close();
  }

  clearRemarks() {
    this.remarksControl.reset();
  }
  applyRemarks() {
    // this.params.api.stopEditing();
    if (this.remarksControl.valid) {
      this.dialogRef.close({
        type: 'apply',
        data: this.remarksControl.value
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
