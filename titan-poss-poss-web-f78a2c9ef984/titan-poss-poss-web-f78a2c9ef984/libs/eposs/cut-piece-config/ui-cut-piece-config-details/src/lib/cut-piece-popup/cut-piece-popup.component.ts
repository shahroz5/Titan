import {
  Component,
  Inject,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-cut-piece-popup',
  templateUrl: './cut-piece-popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CutPiecePopupComponent implements OnInit, OnDestroy {
  form: FormGroup;
  cutPieceTepTranslatedLabel: string;
  destroy$ = new Subject<null>();
  constructor(
    public dialogRef: MatDialogRef<CutPiecePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService
  ) {
    this.translate
      .get(['pw.cutPieceConfig.cutPieceTepPercentage'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.cutPieceTepTranslatedLabel =
          translatedMsg['pw.cutPieceConfig.cutPieceTepPercentage'];
      });
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      cutPiece: new FormControl(this.data ? this.data.cutPieceTepPercent : '', [
        this.fieldValidatorsService.percentageField(
          this.cutPieceTepTranslatedLabel
        )
      ])
    });
  }
  apply() {
    this.dialogRef.close({
      cutPieceTepPercentage: this.form.get('cutPiece').value
    });
  }
  close() {
    this.dialogRef.close();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
