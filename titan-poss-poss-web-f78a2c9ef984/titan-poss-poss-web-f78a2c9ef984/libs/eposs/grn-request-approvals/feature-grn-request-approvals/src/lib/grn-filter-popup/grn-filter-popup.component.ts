import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import {
  grnRequestEnum,
  LocationSettingAttributesEnum,
  SelectDropDownOption
} from '@poss-web/shared/models';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
@Component({
  selector: 'poss-web-grn-filter-popup',
  templateUrl: './grn-filter-popup.component.html'
})
export class GrnFilterPopupComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  fiscalYear: string;
  locationCode: string;
  currentDate = moment();
  destroy$ = new Subject();
  grnRequestEnum = grnRequestEnum;
  grnTypeArray: SelectDropDownOption[] = [];
  currentFiscalYear: string;

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<GrnFilterPopupComponent>,
    private locationSettingsFacade: LocationSettingsFacade,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.translate
      .get([
        'pw.grnRequestApproval.locationCode',
        'pw.grnRequestApproval.fiscalYear',
        'pw.grnRequestApproval.mfgDefect',
        'pw.grnRequestApproval.regularDefect',
        'pw.grnRequestApproval.all'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.locationCode =
          translatedMessages['pw.grnRequestApproval.locationCode'];
        this.fiscalYear =
          translatedMessages['pw.grnRequestApproval.fiscalYear'];

        this.grnTypeArray.push(
          {
            value: grnRequestEnum.ALL,
            description: translatedMessages['pw.grnRequestApproval.all']
          },

          {
            value: grnRequestEnum.MFG_DEFECT,
            description: translatedMessages['pw.grnRequestApproval.mfgDefect']
          },
          {
            value: grnRequestEnum.REGULAR,
            description:
              translatedMessages['pw.grnRequestApproval.regularDefect']
          }
        );
      });

    this.filterForm = new FormGroup({
      srcLocationCode: new FormControl(
        this.data?.srcLocationCode ? this.data.srcLocationCode : '',
        this.fieldValidatorsService.locationCodeField(this.locationCode)
      ),
      destLocationCode: new FormControl(
        this.data?.destLocationCode ? this.data.destLocationCode : '',
        this.fieldValidatorsService.locationCodeField(this.locationCode)
      ),
      startDate: new FormControl(
        this.data?.startDate ? this.data.startDate : ''
      ),
      endDate: new FormControl(this.data?.endDate ? this.data.endDate : ''),
      fiscalYear: new FormControl(
        this.data?.fiscalYear ? this.data.fiscalYear : ''
      ),
      grnType: new FormControl(
        this.data?.grnType ? this.data?.grnType : grnRequestEnum.ALL
      )
    });
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.COUNTRY_FISCAL_YEAR)
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: string) => {
        this.currentFiscalYear = fiscalYear;
        const fisCalYearCtrl = this.filterForm.get('fiscalYear');
        fisCalYearCtrl.setValidators([
          this.fieldValidatorsService.fiscalYearField('Fiscal Year'),
          this.fieldValidatorsService.max(
            Number(this.currentFiscalYear),
            'Fiscal Year'
          )
        ]);
        fisCalYearCtrl.updateValueAndValidity();
      });

    this.filterForm
      .get('startDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const endDate = this.filterForm.get('endDate');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'EndDate')
        ]);
        endDate.updateValueAndValidity();
      });
  }
  close() {
    this.dialogRef.close();
  }
  clear() {
    this.filterForm.reset();
  }
  apply() {
    this.dialogRef.close({
      type: 'apply',
      data: this.createResponse()
    });
  }
  onDropDownValueChange(changeEvent) {
    this.filterForm.get('grnType').patchValue(changeEvent.value);
  }

  createResponse() {
    if (this.isFormEmpty() === false) {
      return {
        srcLocationCode: this.filterForm.get('srcLocationCode').value,
        destLocationCode: this.filterForm.get('destLocationCode').value,
        startDate: this.filterForm.get('startDate').value,
        endDate: this.filterForm.get('endDate').value,
        fiscalYear: this.filterForm.get('fiscalYear').value,
        grnType: this.filterForm.get('grnType').value
      };
    } else {
      return null;
    }
  }

  isFormEmpty() {
    if (
      this.filterForm.get('srcLocationCode').value === null &&
      this.filterForm.get('destLocationCode').value === null &&
      this.filterForm.get('startDate').value === null &&
      this.filterForm.get('endDate').value === null &&
      this.filterForm.get('fiscalYear').value === null &&
      this.filterForm.get('grnType').value === null
    ) {
      return true;
    } else {
      return false;
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
