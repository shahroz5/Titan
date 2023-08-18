import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BillCancelFacade } from '@poss-web/poss/bc/data-access-bc';

import {
  SelectDropDownOption,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  BcTypesEnum,
  CustomErrors,
  BcHistorySearchByEnum,
  CashMemoHistoryDetails,
  bcHistoryDetails,
  bcHistoryRequestPayload,
  SharedBodEodFeatureServiceAbstraction
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';

import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';

@Component({
  selector: 'poss-web-bc-history-form',
  templateUrl: './bc-history-form.component.html'
})
export class BcHistoryFormComponent implements OnInit {
  destroy$: Subject<null> = new Subject<null>();
  searchForm: FormGroup;
  mobileNo: string;
  fiscalYear: string;
  cmNoHeader: string;
  docNo: string;
  utcOffset = moment().startOf('day').utcOffset();
  searchTypes: SelectDropDownOption[] = [];
  showSearchField: boolean;
  searchFieldPlaceholder: string;
  panNoOption: string;
  emailIdOption: string;
  ulpIdOption: string;
  gstNoOption: string;
  cmLocationLabel: any;
  countryFiscalYear: number;

  searchValue: {
    docNo: any;
    fiscalYear: any;
    searchType: any;
    searchField: any;
    fromDocDate: any;
    toDocDate: any;
    refDocNo: any;
  };

  BcHistory$: Observable<bcHistoryDetails[]>;
  bcHistoryDetails: bcHistoryDetails;
  isHistoryDetailsLoading$: Observable<boolean>;
  subTxnTypes: SelectDropDownOption[];

  noDataFoundMessageHistory: any;
  currentDate = moment();

  subTxnTypeLabel: string;
  minPageSize: number;
  BCHistory$: Observable<CashMemoHistoryDetails[]>;
  historyItems: bcHistoryDetails[] = [];
  totalElements: number;
  fiscal: any;
  totalElementlength: number;
  historyItemlength: bcHistoryDetails[];
  @Input() currentFiscalYear: string;
  @Output() onHistorySearchFormChange = new EventEmitter<any>();
  @Input() historySearchParams : bcHistoryRequestPayload;
  businessDate: moment.Moment;
  data: bcHistoryRequestPayload;

  constructor(
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private billcancelfacade: BillCancelFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction
  ) {}

  ngOnInit(): void {

    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(businessDate => {
        this.businessDate = moment(businessDate);
      });

    this.translate
      .get([
        'pw.bc.cmNoHeader',
        'pw.bc.fiscalYear',
        'pw.bc.mobileNoOption',
        'pw.bc.ulpIdOption',
        'pw.bc.panNoOption',
        'pw.bc.gstNoOption',
        'pw.bc.passportIdOption',
        'pw.bc.emailIdOption',
        'pw.bc.newCm',
        'pw.bc.manualCm',
        'pw.bc.subTxnType',
        'pw.bc.txnType',
        'pw.bc.cashMemolable'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.fiscalYear = translatedMessages['pw.bc.fiscalYear'];
        this.cmNoHeader = translatedMessages['pw.bc.cmNoHeader'];
        this.mobileNo = translatedMessages['pw.bc.mobileNoOption'];
        this.panNoOption = translatedMessages['pw.bc.panNoOption'];
        this.emailIdOption = translatedMessages['pw.bc.emailIdOption'];
        this.ulpIdOption = translatedMessages['pw.bc.ulpIdOption'];
        this.gstNoOption = translatedMessages['pw.bc.gstNoOption'];

        this.searchForm = new FormGroup({
          cmNoHeader: new FormControl(null, [
            this.fieldValidatorsService.numbersField(this.cmNoHeader)
          ]),
          fiscalYear: new FormControl(this.currentFiscalYear),
          searchField: new FormControl(null),
          searchType: new FormControl(null),
          fromDocDate: new FormControl(null),
          toDocDate: new FormControl(null),
          refDocNo: new FormControl(null),
          subTxnType: new FormControl(BcTypesEnum.CASH_MEMO)
        });

        this.searchTypes = [
          {
            value: BcHistorySearchByEnum.MOBILE_NO,
            description: translatedMessages['pw.bc.mobileNoOption']
          },
          {
            value: BcHistorySearchByEnum.PAN_NO,
            description: translatedMessages['pw.bc.panNoOption']
          },
          {
            value: BcHistorySearchByEnum.EMAIL_ID,
            description: translatedMessages['pw.bc.emailIdOption']
          },
          {
            value: BcHistorySearchByEnum.ULP_ID,
            description: translatedMessages['pw.bc.ulpIdOption']
          },
          {
            value: BcHistorySearchByEnum.GST_NO,
            description: translatedMessages['pw.bc.gstNoOption']
          }
        ];
      });

      if(this.historySearchParams) {
        this.data = this.historySearchParams;
        this.searchForm.get('cmNoHeader').setValue(
          this.historySearchParams.docNo
        );
          this.searchForm.get('fiscalYear').setValue(
            this.historySearchParams.fiscalYear
          );
          this.searchForm.get('refDocNo').setValue(
            this.historySearchParams.refDocNo
          );
          this.searchForm.get('fromDocDate').setValue(
            this.historySearchParams.fromDocDate
          );
          this.searchForm.get('toDocDate').setValue(
            this.historySearchParams.toDocDate
          );

        this.onHistorySearchFormChange.emit(this.searchForm);

      }

  }

  onSubTxnTypeChanged(event) {
    this.searchForm.get('subTxnType').patchValue(event.value);
  }
  onSearchTypeChanged(event: any) {
    this.searchForm.get('searchField').reset();
    if (event) {
      if (event.value) {
        this.showSearchField = true;
      } else {
        this.showSearchField = false;
        this.searchForm.get('searchField').setValidators([]);
      }
      if (event.value === BcHistorySearchByEnum.MOBILE_NO) {
        this.searchForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.mobileField(this.mobileNo),
            this.fieldValidatorsService.requiredField(this.mobileNo)
          ]);
        this.searchFieldPlaceholder = this.mobileNo;
      } else if (event.value === BcHistorySearchByEnum.PAN_NO) {
        this.searchForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.pancardField(this.panNoOption),
            this.fieldValidatorsService.requiredField(this.panNoOption)
          ]);
        this.searchFieldPlaceholder = this.panNoOption;
      } else if (event.value === BcHistorySearchByEnum.EMAIL_ID) {
        this.searchForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.emailField(this.emailIdOption),
            this.fieldValidatorsService.requiredField(this.emailIdOption)
          ]);
        this.searchFieldPlaceholder = this.emailIdOption;
      } else if (event.value === BcHistorySearchByEnum.ULP_ID) {
        this.searchForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.ulpIdField(this.ulpIdOption),
            this.fieldValidatorsService.ulpIdField(this.ulpIdOption)
          ]);
        this.searchFieldPlaceholder = this.ulpIdOption;
      } else if (event.value === BcHistorySearchByEnum.GST_NO) {
        this.searchForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.gstNumberField(this.gstNoOption),
            this.fieldValidatorsService.requiredField(this.gstNoOption)
          ]);
        this.searchFieldPlaceholder = this.gstNoOption;
      }
      this.searchForm.get('searchField').updateValueAndValidity();
    }
  }

  searchHistory() {
    this.onHistorySearchFormChange.emit(this.searchForm);
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
  }
  clearDocRange() {
    this.searchForm.get('fromDocDate').reset();
    this.searchForm.get('toDocDate').reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
