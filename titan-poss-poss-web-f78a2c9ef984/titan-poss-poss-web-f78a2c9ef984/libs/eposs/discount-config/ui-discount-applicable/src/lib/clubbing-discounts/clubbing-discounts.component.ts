import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import {
  ClubbingDiscountsConfig,
  DiscountTypeEnum
} from '@poss-web/shared/models';
import { take, takeUntil } from 'rxjs/operators';
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-clubbing-discounts',
  templateUrl: './clubbing-discounts.component.html',
  styleUrls: ['./clubbing-discounts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClubbingDiscountsComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() enableClubbingBillLevelDiscountOption: boolean;
  @Input() enableClubbingDiscountOption: boolean;
  @Input() selectedDiscount: DiscountTypeEnum;
  @Input() config: ClubbingDiscountsConfig;
  @Input() clubbingDiscountTypes;

  @Output() update = new EventEmitter<ClubbingDiscountsConfig>();
  @Output() formDirtyCheck = new EventEmitter<any>();
  @Output() formValidityCheck = new EventEmitter<any>();
  types = [
    {
      description: 'Type 1',
      value: 'TYPE1'
    },
    {
      description: 'Type 2',
      value: 'TYPE2'
    },
    {
      description: 'Type 3',
      value: 'TYPE3'
    }
  ];
  destroy$ = new Subject();

  form: FormGroup;
  typeLabel: string;

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService
  ) {
    this.translateService
      .get(['pw.discountApplicable.typeLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedLabels: any) => {
        this.typeLabel = translatedLabels['pw.discountApplicable.typeLabel'];
      });
  }
  ngOnInit() {
    this.createForm();
  }

  createForm() {
    console.log(
      'Value at form creation ',
      this.enableClubbingBillLevelDiscountOption
    );
    this.form = new FormGroup({
      type: new FormControl(
        this.config.discountType,
        !this.enableClubbingBillLevelDiscountOption
          ? [this.fieldValidatorsService.requiredField('Type')]
          : []
      ),
      isClubbedOtherDiscounts: new FormControl(
        this.config.isClubbedOtherDiscounts,
        !this.enableClubbingBillLevelDiscountOption
          ? [this.fieldValidatorsService.requiredField('')]
          : []
      ),
      isClubbedOtherBillLevelDiscounts: new FormControl(
        this.config.isClubbedOtherBillLevelDiscounts
      )
    });


    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {

      const value = this.form.value;
      if (this.enableClubbingBillLevelDiscountOption) {
        this.update.emit({
          discountType: null,
          isClubbedOtherDiscounts: null,
          isClubbedOtherBillLevelDiscounts:
            value.isClubbedOtherBillLevelDiscounts
        });
      } else {
        this.update.emit({
          discountType: value.type ? value.type : null,
          isClubbedOtherDiscounts: value.isClubbedOtherDiscounts,
          isClubbedOtherBillLevelDiscounts: null
        });
      }
      this.formValidityCheck.emit(this.form.invalid);
    });

    this.formValidityCheck.emit(this.form.invalid);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDiscount']) {
      this.createForm();
    }
  }
  ngAfterViewInit(): void {
    this.form.valueChanges.pipe(take(1)).subscribe(val => {
      this.formDirtyCheck.emit(this.form.dirty);
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
