import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-cut-piece-form',
  templateUrl: './cut-piece-form.component.html'
})
export class CutPieceFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  currentDate = moment();
  offerStartDateLabel: string;
  offerEndDateLabel: string;
  previewStartDateLabel: string;
  previewEndDateLabel: string;
  destroy$ = new Subject();
  cutPieceTepTranslatedLabel: string;

  @Output() formReady = new EventEmitter<FormGroup>();

  constructor(
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
      cutPiece: new FormControl('', [
        this.fieldValidatorsService.percentageField(
          this.cutPieceTepTranslatedLabel
        ),
        this.fieldValidatorsService.requiredField(
          this.cutPieceTepTranslatedLabel
        )
      ])
    });

    this.formReady.emit(this.form);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
