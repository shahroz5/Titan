import { TranslateService } from '@ngx-translate/core';
import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
  Input
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-location-mapping-discount-form',
  templateUrl: './location-mapping-discount-form.component.html',
  styleUrls: ['./location-mapping-discount-form.component.scss']
})
export class LocationMappingDiscountFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  currentDate = moment();
  offerStartDateLabel: string;
  offerEndDateLabel: string;
  previewStartDateLabel: string;
  previewEndDateLabel: string;
  destroy$ = new Subject();

  @Output() formReady = new EventEmitter<FormGroup>();
  @Input() isPreviewApplicable: boolean;
  previewStartDate: any;
  previewEndDate: any;
  offerStartDate: any;
  offerEndDate: any;
  check = false;
  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService
  ) {
    this.translateService
      .get([
        'pw.locationMapping.offerStartDateLabel',
        'pw.locationMapping.offerEndDateLabel',
        'pw.locationMapping.previewStartDateLabel',
        'pw.locationMapping.previewEndDateLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedLabels: any) => {
        this.offerStartDateLabel =
          translatedLabels['pw.locationMapping.offerStartDateLabel'];
        this.offerEndDateLabel =
          translatedLabels['pw.locationMapping.offerEndDateLabel'];
        this.previewStartDateLabel =
          translatedLabels['pw.locationMapping.previewStartDateLabel'];
        this.previewEndDateLabel =
          translatedLabels['pw.locationMapping.previewEndDateLabel'];
      });
  }

  ngOnInit(): void {
    console.log(this.isPreviewApplicable, 'isPreviewApplicable');

    this.form = new FormGroup({
      offerStartDate: new FormControl(
        null,
        this.fieldValidatorsService.requiredField(this.offerStartDateLabel)
      ),
      offerEndDate: new FormControl(
        null,
        this.fieldValidatorsService.requiredField(this.offerEndDateLabel)
      ),
      previewStartDate: new FormControl(
        { value: null, disabled: true },
        this.isPreviewApplicable
          ? this.fieldValidatorsService.requiredField(
              this.previewStartDateLabel
            )
          : []
      ),
      previewEndDate: new FormControl(
        { value: null, disabled: true },
        this.isPreviewApplicable
          ? this.fieldValidatorsService.requiredField(this.previewEndDateLabel)
          : []
      )
    });
    const offerStartCtrl = this.form.get('offerStartDate');
    const offerEndCtrl = this.form.get('offerEndDate');
    offerEndCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.form.get('previewStartDate').enable();
      this.form.get('previewEndDate').enable();
    });

    this.formReady.emit(this.form);
  }

  checkSubSet() {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
