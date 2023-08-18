import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { 
  AdvanceSearchTypesEnum,
  AdvanceStatusEnum,
  HistorySearchParamDetails,
  SelectDropDownOption,
  SubTransactionTypeEnum } from '@poss-web/shared/models';
import { Subject } from 'rxjs';

import { 
  FieldValidatorsService, 
} from '@poss-web/shared/util-field-validators';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Component({
  selector: 'poss-web-gep-search',
  templateUrl: './gep-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GepSearchComponent implements OnInit {
  destroy$ = new Subject<null>();
  data: any;
  gepHistorySearchForm: FormGroup;
  docNo:string;
  cnDocNo:string;
  fiscalyear:string;
  mobileNoOption:string;
  panNoOption: string;
  emailIdOption: string;
  ulpIdOption: string;
  gstNoOption: string;
  searchTypeOptions: SelectDropDownOption[] = [];
  subTxnTypeOptions: SelectDropDownOption[];
  statusOptions: SelectDropDownOption[];
  showSearchField: boolean;
  searchFieldPlaceholder: string;
  searchValue: {
    docNo: any;
    fiscalYear: any;
    searchType: any;
    searchField: any;
    startDate: any;
    endDate: any;
    fromNetAmount: any;
    toNetAmount: any;
  };
  currentDate = moment();

  selectedHistoryItem: any;
  @Input() currentFiscalYear: string;
  @Input() historySearchParams: HistorySearchParamDetails;
  @Input() businessDay;
  @Output() historySearchFormChange = new EventEmitter<any>();

  clearFilter: boolean;
  
  constructor(
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
  ) { }

  ngOnInit(): void {
    this.translate
    .get([
      'pw.gepHistory.docNumberLabel',
      'pw.gepHistory.fiscalYearLabel',
      'pw.gepHistory.cnDocNoLabel',
      'pw.gepHistory.mobileNoOptionLabel',
      'pw.gepHistory.ulpIdOptionLabel',
      'pw.gepHistory.panNoOptionLabel',
      'pw.gepHistory.gstNoOptionLabel',
      'pw.gepHistory.passportIdOption',
      'pw.gepHistory.emailIdOptionLabel',
      'pw.gepHistory.fromDocDateLabel',
      'pw.gepHistory.toDocDateLabel',
      'pw.gepHistory.subTxnTypeLabel',
      'pw.gepHistory.newGEPOptionLabel',
      'pw.gepHistory.manualGEPOptionLabel',
      'pw.abStatusMessages.approvalPending',
      'pw.abStatusMessages.cancelled',
      'pw.abStatusMessages.closed',
      'pw.abStatusMessages.confirmed',
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe((translatedMessages:any)=>{
      this.docNo = translatedMessages['pw.gepHistory.docNumberLabel'];
      this.fiscalyear = translatedMessages['pw.gepHistory.fiscalYearLabel'];
      this.cnDocNo = translatedMessages['pw.gepHistory.cnDocNoLabel'];
      this.mobileNoOption = translatedMessages['pw.gepHistory.mobileNoOptionLabel'];
      this.ulpIdOption = translatedMessages['pw.gepHistory.ulpIdOptionLabel'];
      this.panNoOption = translatedMessages['pw.gepHistory.panNoOptionLabel'];
      this.gstNoOption = translatedMessages['pw.gepHistory.gstNoOptionLabel'];
      this.emailIdOption = translatedMessages['pw.gepHistory.emailIdOptionLabel'];

      this.gepHistorySearchForm = new FormGroup({
        docNumber: new FormControl('',[
          this.fieldValidatorsService.requestNumberField(this.docNo)
        ]),
        fiscalYear: new FormControl('',[
          this.fieldValidatorsService.fiscalYearField(this.fiscalyear)
        ]),
        cnDocNo: new FormControl('',[
          this.fieldValidatorsService.requestNumberField(this.cnDocNo)
        ]),
        startDate: new FormControl(null),
        endDate: new FormControl(null),
        fromNetAmount: new FormControl(null),
        toNetAmount: new FormControl(null),
        status: new FormControl(
          AdvanceStatusEnum.ALL,
          this.fieldValidatorsService.remarkField('GEP Status')
        ),
        searchType: new FormControl(null),
        searchField: new FormControl(null),
        subTxnType: new FormControl(SubTransactionTypeEnum.NEW_GEP)
      });
  
      this.statusOptions = [
        {
          value: AdvanceStatusEnum.ALL,
          description: AdvanceStatusEnum.ALL
        },
        {
          value: AdvanceStatusEnum.APPROVAL_PENDING,
          description: translatedMessages['pw.abStatusMessages.approvalPending']
        },
        {
          value: AdvanceStatusEnum.CANCELLED,
          description: translatedMessages['pw.abStatusMessages.cancelled']
        },
        {
          value: AdvanceStatusEnum.CLOSED,
          description: translatedMessages['pw.abStatusMessages.closed']
        },
        {
          value: AdvanceStatusEnum.CONFIRMED,
          description: translatedMessages['pw.abStatusMessages.confirmed']
        }
      ];
    
      this.searchTypeOptions = [
        {
          value: AdvanceSearchTypesEnum.MOBILE_NO,
          description: this.mobileNoOption
        },
        {
          value: AdvanceSearchTypesEnum.PAN_NO,
          description: this.panNoOption
        },
        {
          value: AdvanceSearchTypesEnum.EMAIL_ID,
          description: this.emailIdOption
        },
        {
          value: AdvanceSearchTypesEnum.ULP_ID,
          description: this.ulpIdOption
        },
        {
          value: AdvanceSearchTypesEnum.GST_NO,
          description: this.gstNoOption
        }
      ];
    
      this.subTxnTypeOptions = [
        {
          value: SubTransactionTypeEnum.NEW_GEP,
          description: translatedMessages['pw.gepHistory.newGEPOptionLabel']
        },
        {
          value: SubTransactionTypeEnum.MANUAL_GEP,
          description: translatedMessages['pw.gepHistory.manualGEPOptionLabel']
        }
      ];
    })

    if (this.historySearchParams) {
      this.data = this.historySearchParams;
      this.gepHistorySearchForm.get('status').setValue(this.historySearchParams.status),
        this.gepHistorySearchForm.get('fiscalYear').setValue(
          this.historySearchParams.fiscalYear
        );

      this.gepHistorySearchForm.get('cnDocNo').setValue(this.historySearchParams.cnDocNo);
      this.gepHistorySearchForm.get('docNumber').setValue(this.historySearchParams.docNo);

      this.gepHistorySearchForm.get('fromNetAmount').setValue(
        this.historySearchParams.fromValue
      );
      this.gepHistorySearchForm.get('toNetAmount').setValue(
        this.historySearchParams.toValue
      );

      this.gepHistorySearchForm.get('startDate').setValue(
        this.historySearchParams.startDate
      );
      
      this.gepHistorySearchForm.get('endDate').setValue(
        this.historySearchParams.endDate
      );

      if (this.historySearchParams.searchType) {
        this.gepHistorySearchForm.get('searchType').setValue(
          this.historySearchParams.searchType
        );
        this.gepHistorySearchForm.get('searchField').setValue(
          this.historySearchParams.searchField
        );

        this.setSearchField({
          value: this.historySearchParams.searchType
        });
      }

      this.gepHistorySearchForm.get('subTxnType').setValue(this.historySearchParams.tepType);
      this.gepHistorySearchForm.updateValueAndValidity();

      this.historySearchFormChange.emit(this.gepHistorySearchForm);
    }
  }

  searchAdvanceHistory(){
    this.historySearchFormChange.emit(this.gepHistorySearchForm);
  }

  onSearchTypeChanged(event: any) {
    this.gepHistorySearchForm.get('searchField').reset();
    this.setSearchField(event);
  }

  setSearchField(event:any)
  {
    if (event) {
      if (event.value) {
        this.showSearchField = true;
      } else {
        this.showSearchField = false;
        this.gepHistorySearchForm.get('searchField').setValidators([]);
      }
      switch(event.value){
        case AdvanceSearchTypesEnum.MOBILE_NO:
          this.gepHistorySearchForm
            .get('searchField')
            .setValidators([
              this.fieldValidatorsService.mobileField(this.mobileNoOption),
              this.fieldValidatorsService.requiredField(this.mobileNoOption)
            ]);
          this.searchFieldPlaceholder = this.mobileNoOption;
          break;

        case AdvanceSearchTypesEnum.PAN_NO:
          this.gepHistorySearchForm
            .get('searchField')
            .setValidators([
              this.fieldValidatorsService.pancardField(this.panNoOption),
              this.fieldValidatorsService.requiredField(this.panNoOption)
            ]);
          this.searchFieldPlaceholder = this.panNoOption;
          break;

        case AdvanceSearchTypesEnum.EMAIL_ID:
          this.gepHistorySearchForm
            .get('searchField')
            .setValidators([
              this.fieldValidatorsService.emailField(this.emailIdOption),
              this.fieldValidatorsService.requiredField(this.emailIdOption)
            ]);
          this.searchFieldPlaceholder = this.emailIdOption;
          break;

        case AdvanceSearchTypesEnum.ULP_ID:
          this.gepHistorySearchForm
            .get('searchField')
            .setValidators([
              this.fieldValidatorsService.ulpIdField(this.ulpIdOption),
              this.fieldValidatorsService.ulpIdField(this.ulpIdOption)
            ]);
          this.searchFieldPlaceholder = this.ulpIdOption;
          break;

        case AdvanceSearchTypesEnum.GST_NO:
          this.gepHistorySearchForm
            .get('searchField')
            .setValidators([
              this.fieldValidatorsService.gstNumberField(this.gstNoOption),
              this.fieldValidatorsService.requiredField(this.gstNoOption)
            ]);
          this.searchFieldPlaceholder = this.gstNoOption;
          break;
      }
      this.gepHistorySearchForm.get('searchField').updateValueAndValidity();
    }
  }

  onSubTxnTypeChanged(event) {
    this.gepHistorySearchForm.get('subTxnType').patchValue(event.value);
  }

  clearDocRange() {
    this.gepHistorySearchForm.get('startDate').reset();
    this.gepHistorySearchForm.get('endDate').reset();
  }

}
