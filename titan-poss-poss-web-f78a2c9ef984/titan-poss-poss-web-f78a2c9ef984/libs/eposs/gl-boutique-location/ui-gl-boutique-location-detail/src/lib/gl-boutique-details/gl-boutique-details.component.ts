import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Params } from '@angular/router';
import { GlBoutiqueLocationList } from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-gl-boutique-details',
  templateUrl: './gl-boutique-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlBoutiqueDetailsComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() routeParam: Observable<Params>;
  @Input() glBoutiqueLocations: GlBoutiqueLocationList;
  @Input() selectedLocation;
  @Input() addedLocations;
  @Output() formOutput = new EventEmitter<GlBoutiqueLocationList>();
  @Output() clickEvent = new EventEmitter();
  @Output() toggle = new EventEmitter();
  glBoutiqueDetailsForm: FormGroup;
  destroy$ = new Subject();
  glCodeLabel: any;
  pifSeriesNoLabel: any;
  fitCodeLabel: any;
  locationCodeLabel: any;
  costCenterLabel: any;
  isNew: boolean;
  locationCode: any;
  islocatonValue: boolean;
  isActive: boolean;

  constructor(
    public fb: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService
  ) {
    this.translationService
      .get([
        'pw.glBoutique.glCode',
        'pw.glBoutique.pifSeriesNo',
        'pw.glBoutique.fitCode',
        'pw.glBoutique.locationCode',
        'pw.glBoutique.costCenter'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.glCodeLabel = translatedMsg['pw.glBoutique.glCode'];
        this.pifSeriesNoLabel = translatedMsg['pw.glBoutique.pifSeriesNo'];
        this.fitCodeLabel = translatedMsg['pw.glBoutique.fitCode'];
        this.locationCodeLabel = translatedMsg['pw.glBoutique.locationCode'];
        this.costCenterLabel = translatedMsg['pw.glBoutique.costCenter'];
      });
  }

  ngOnInit() {
    console.log(this.locationCode, 'locationCode');

    this.routeParam.subscribe(param => {
      if (param['_loc'] === 'new') {
        this.locationCode = null;
        this.isNew = true;
      } else {
        this.isNew = false;
      }
    });

    console.log(this.glBoutiqueLocations, 'glBoutiqueLocations');
    this.locationCode = this.glBoutiqueLocations.locationCode;

    this.isActive = this.glBoutiqueLocations.isActive;
    this.initForm(this.glBoutiqueLocations);
    if(this.isNew){
      this.glBoutiqueDetailsForm.controls['pifSeriesNo'].enable();
    } else {
      this.glBoutiqueDetailsForm.controls['pifSeriesNo'].disable();
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['selectedLocation'] &&
      changes['selectedLocation'].currentValue !== undefined
    ) {
      this.locationCode = this.selectedLocation.id;
      console.log(this.selectedLocation, 'selectedLocation');
    }
  }
  initForm(glBoutiqueLocationDetails: GlBoutiqueLocationList) {
    this.glBoutiqueDetailsForm = new FormGroup({
      glCode: new FormControl(glBoutiqueLocationDetails.glCode, [
        this.fieldValidatorsService.giftCardPinField(this.glCodeLabel),
        this.fieldValidatorsService.requiredField(this.glCodeLabel)
      ]),
      pifSeriesNo: new FormControl(glBoutiqueLocationDetails.pifSeriesNo, [
        this.fieldValidatorsService.giftCardPinField(this.pifSeriesNoLabel),
        this.fieldValidatorsService.requiredField(this.pifSeriesNoLabel)
      ]),
      locationCode: new FormControl({
        value: this.locationCode,
        disabled: true
      }),
      fitCode: new FormControl(glBoutiqueLocationDetails.fitCode, [
        this.fieldValidatorsService.giftCardPinField(this.fitCodeLabel),
        this.fieldValidatorsService.requiredField(this.fitCodeLabel)
      ]),
      costCenter: new FormControl(glBoutiqueLocationDetails.costCenter, [
        this.fieldValidatorsService.costCenterPinField(this.costCenterLabel)
        // this.fieldValidatorsService.numbersField(this.costCenterLabel),
        // this.fieldValidatorsService.maxLength(6, this.costCenterLabel),
        // this.fieldValidatorsService.minLength(6, this.costCenterLabel),
        // this.fieldValidatorsService.requiredField(this.costCenterLabel)
      ])
    });
  }
  emitClickEvent() {
    this.clickEvent.emit(null);
  }
  clear() {
    this.locationCode = null;
  }
  onSubmit() {
    if (this.glBoutiqueDetailsForm.valid) {
      const values = this.glBoutiqueDetailsForm.getRawValue();

      this.formOutput.emit({
        glCode: values.glCode,
        pifSeriesNo: values.pifSeriesNo,
        locationCode: this.selectedLocation
          ? this.locationCode
          : this.glBoutiqueLocations.locationCode,
        fitCode: values.fitCode,
        costCenter: values.costCenter,
        isActive: this.isActive
      });
    }
  }
  getActiveStatus(status) {
    this.isActive = status;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
