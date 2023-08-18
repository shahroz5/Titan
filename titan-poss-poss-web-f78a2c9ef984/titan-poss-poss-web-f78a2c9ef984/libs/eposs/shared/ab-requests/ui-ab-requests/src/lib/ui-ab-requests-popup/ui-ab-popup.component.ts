import {
  Component,
  OnInit,
  OnDestroy,
  Inject
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-ui-ab-popup',
  templateUrl: './ui-ab-popup.component.html',
  styleUrls: ['./ui-ab-popup.component.scss']
})
export class UiAbPopupComponent implements OnInit, OnDestroy {
  params: any;
  remarksControl: FormControl;
  destroy$: Subject<null> = new Subject<null>();
  remarksPlaceHolder: string;

  constructor(
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    public dialogRef: MatDialogRef<UiAbPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
    this.translate
      .get(['pw.remarksPopup.remarksPlaceHolder'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.remarksPlaceHolder =
          translatedMessages['pw.remarksPopup.remarksPlaceHolder'];
      });
  }

  ngOnInit(): void {
    this.remarksControl = new FormControl('', [
      this.fieldValidatorsService.requiredField(this.remarksPlaceHolder),
      this.fieldValidatorsService.remarkField(this.remarksPlaceHolder),
      this.fieldValidatorsService.minLength(5, this.remarksPlaceHolder),
      this.fieldValidatorsService.maxLength(250, this.remarksPlaceHolder)
    ]);
  }



  closePopup() {
    this.dialogRef.close();
  }

  clearRemarks() {
    this.remarksControl.reset();
  }
  applyRemarks() {
    this.dialogRef.close({
      remarks: this.remarksControl.value
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
