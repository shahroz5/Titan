import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { MetalTypeEnum } from '@poss-web/shared/models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { POSS_WEB_DATE_FORMAT } from '@poss-web/shared/util-config';

@Component({
  selector: 'poss-web-update-metal-rates',
  templateUrl: './update-metal-rates.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateMetalRatesComponent implements OnChanges, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  currentDate: string;
  goldRateLabel: string;
  platinumRateLabel: string;
  silverLabel: string;
  enterPasswordLabel: string;
  noMetalRatesEnteredMessage: string;
  metalRates: FormGroup;
  @Input() isGoldRateAvailable: boolean;
  @Input() businessDate: number;

  @Output() saveMetalRates = new EventEmitter<any>();
  @Output() noMetalRatesProvided = new EventEmitter<any>();

  constructor(
    public translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    @Inject(POSS_WEB_DATE_FORMAT) private dateFormat
  ) {
    this.translate
      .get([
        'pw.boutiqueMasters.goldRate',
        'pw.boutiqueMasters.platinumRate',
        'pw.boutiqueMasters.silverRate',
        'pw.boutiqueMasters.enterPassword',
        'pw.boutiqueMasters.noMetalRatesEntered'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedLabels: string[]) => {
        this.goldRateLabel = translatedLabels['pw.boutiqueMasters.goldRate'];
        this.platinumRateLabel =
          translatedLabels['pw.boutiqueMasters.platinumRate'];
        this.silverLabel = translatedLabels['pw.boutiqueMasters.silverRate'];
        this.enterPasswordLabel =
          translatedLabels['pw.boutiqueMasters.enterPassword'];
        this.noMetalRatesEnteredMessage =
          translatedLabels['pw.boutiqueMasters.noMetalRatesEntered'];
      });

    this.metalRates = new FormGroup({
      goldRate: new FormControl('', [
        this.fieldValidatorsService.amountField(this.goldRateLabel)
      ]),
      platinumRate: new FormControl('', [
        this.fieldValidatorsService.amountField(this.platinumRateLabel)
      ]),
      silverRate: new FormControl('', [
        this.fieldValidatorsService.amountField(this.silverLabel)
      ]),
      enteredPassword: new FormControl(
        '',
        this.fieldValidatorsService.requiredField(this.enterPasswordLabel)
      )
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['businessDate']) {
      this.currentDate = null;
      if (!!this.businessDate) {
        this.currentDate = moment(Number(this.businessDate)).format(
          this.dateFormat
        );
      }
    }
    if (changes['isGoldRateAvailable']) {
      const goldRateValidator = this.metalRates.get('goldRate');
      goldRateValidator.clearValidators();
      if (!this.isGoldRateAvailable) {
        goldRateValidator.setValidators([
          this.fieldValidatorsService.amountField(this.goldRateLabel),
          this.fieldValidatorsService.requiredField(this.goldRateLabel)
        ]);
        goldRateValidator.updateValueAndValidity();
      } else {
        goldRateValidator.setValidators([
          this.fieldValidatorsService.amountField(this.goldRateLabel)
        ]);
        goldRateValidator.updateValueAndValidity();
      }
    }
  }

  save() {
    if (this.metalRates.valid) {
      const metalRatePayload = {
        applicableDate: moment(Number(this.businessDate)).format(),
        metalRates: {
          J: {
            metalTypeCode: MetalTypeEnum.GOLD,
            ratePerUnit: this.metalRates.value.goldRate
          },
          L: {
            metalTypeCode: MetalTypeEnum.PLATINUM,
            ratePerUnit: this.metalRates.value.platinumRate
          },
          P: {
            metalTypeCode: MetalTypeEnum.SILVER,
            ratePerUnit: this.metalRates.value.silverRate
          }
        },
        password: this.metalRates.value.enteredPassword
      };

      if (this.metalRates.value.goldRate === '') {
        delete metalRatePayload.metalRates.J;
      }
      if (this.metalRates.value.platinumRate === '') {
        delete metalRatePayload.metalRates.L;
      }
      if (this.metalRates.value.silverRate === '') {
        delete metalRatePayload.metalRates.P;
      }
      if (
        this.metalRates.value.goldRate !== '' ||
        this.metalRates.value.platinumRate !== '' ||
        this.metalRates.value.silverRate !== ''
      ) {
        this.saveMetalRates.emit(metalRatePayload);
      } else {
        this.noMetalRatesProvided.emit(this.noMetalRatesEnteredMessage);
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
