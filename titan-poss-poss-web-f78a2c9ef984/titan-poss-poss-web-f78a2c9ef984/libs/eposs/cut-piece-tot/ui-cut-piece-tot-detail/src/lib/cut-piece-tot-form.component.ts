import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  CutPieceTot,
  CutPieceTotFormData
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-cut-piece-tot-form',
  templateUrl: './cut-piece-tot-form.component.html',
  styles: [
    `
      .pw-ml-10 {
        margin-left: 10px;
      }
    `
  ]
})
export class CutPieceTotFormComponent implements OnInit, OnDestroy {
  l3TOTDeductionTranslate: string;
  constructor(
    public fb: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translationService
      .get(['pw.cutPieceTot.l3TOTDeduction'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.l3TOTDeductionTranslate =
          translatedMsg['pw.cutPieceTot.l3TOTDeduction'];
      });
  }
  @Input() cutPieceTot: CutPieceTot[];
  @Input() cutPieceTotDetailsFormOutput: CutPieceTot[];

  @Output() formData = new EventEmitter<CutPieceTotFormData[]>();

  destroy$ = new Subject<null>();
  cutPieceTotDetailsForm: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.cutPieceTotDetailsForm = new FormGroup({
      cutPieceTotDetailsFormArray: this.fb.array([])
    });

    this.cutPieceTot.forEach(data => {
      this.addNewCutPieceTotDetailsFormArray(
        data.configId,
        data.configDetails.data.l3DeductionPercent.toString()
      );
    });
  }

  addNewCutPieceTotDetailsFormArray(configId: string, val: string) {
    this.cutPieceTotDetailsFormArray.push(
      this.fb.group({
        l3DeductionPercent: new FormControl(val, [
          this.fieldValidatorsService.requiredField(
            this.l3TOTDeductionTranslate
          ),
          this.fieldValidatorsService.percentageField(
            this.l3TOTDeductionTranslate
          )
        ]),
        configId: new FormControl(configId)
      })
    );
  }

  get cutPieceTotDetailsFormArray() {
    return this.cutPieceTotDetailsForm.get(
      'cutPieceTotDetailsFormArray'
    ) as FormArray;
  }

  onSubmit() {
    if (this.cutPieceTotDetailsForm.valid) {
      const values = this.cutPieceTotDetailsForm.getRawValue();
      this.cutPieceTotDetailsForm.markAsPristine();

      this.formData.emit(values.cutPieceTotDetailsFormArray);
    } else {
      this.alertPopupService.open({
        type: AlertPopupTypeEnum.ERROR,
        message: 'pw.inventoryMasters.invalidAlert'
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
