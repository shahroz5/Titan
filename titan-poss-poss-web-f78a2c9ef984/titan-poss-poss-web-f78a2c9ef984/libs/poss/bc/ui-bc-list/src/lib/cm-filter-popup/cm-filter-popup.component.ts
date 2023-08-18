import {
  Component,
  Inject,
  OnDestroy
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-cm-filter-popup',
  templateUrl: './cm-filter-popup.component.html'
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CmFilterPopupComponent implements OnDestroy {
  filterForm: FormGroup;
  destroy$: Subject<null> = new Subject<null>();
  cmNoHeader: string;
  customerNameHeader: string;
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translate
      .get(['pw.bc.cmNoHeaderLabel', 'pw.bc.customerNameHeaderLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedLabels: any) => {
        this.cmNoHeader = translatedLabels['pw.bc.cmNoHeaderLabel'];
        this.customerNameHeader =
          translatedLabels['pw.bc.customerNameHeaderLabel'];
      });
    this.filterForm = new FormGroup({
      reqDocNo: new FormControl(data.reqDocNo, [
        this.fieldValidatorsService.requestNumberField(this.cmNoHeader)
      ]),
      customerName: new FormControl(
        data.customerName,
        this.fieldValidatorsService.nameWithSpaceField(this.customerNameHeader)
      )
    });
  }



  clear() {
    this.filterForm.patchValue({
      reqDocNo: null,
      customerName: null
    });
  }

  apply() {
    this.dialogRef.close({
      reqDocNo: this.filterForm.get('reqDocNo').value,
      customerName: this.filterForm.get('customerName').value
    });
  }

  close() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
