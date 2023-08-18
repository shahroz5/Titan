import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  OverlayNotificationServiceAbstraction,
  CustomErrors,
  OverlayNotificationType,
  Report,
  ReportStatus,
  SelectDropDownOption,
  SharedBodEodFeatureServiceAbstraction,
  LocationSummaryList,
  InvoiceResult,
  InvoiceListResponse,
  InvoiceListPayload,
  DocumentTransactionTypesEnum,
  FileData
} from '@poss-web/shared/models';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { getHomeUrl } from '@poss-web/shared/util-site-routes';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReportsFacade } from '@poss-web/shared/reports/data-access-reports';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { MatDialog } from '@angular/material/dialog';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { PasswordConfigFacade } from '@poss-web/eposs/password-config/data-access-password-config';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { DocumentsSearchFacade } from '@poss-web/eposs/digitization-documents-search/data-access-documents-search';

@Component({
  selector: 'poss-web-documents-search',
  templateUrl: './documents-search.component.html',
  styleUrls: ['./documents-search.component.scss']
})
export class DocumentsSearchComponent implements OnInit, OnDestroy {
  currentDate = moment();
  documentsSearchForm: FormGroup;
  error$: Observable<CustomErrors>;
  isLoading$: Observable<boolean>;
  isLoadingReports$: Observable<boolean>;
  pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  destroy$ = new Subject<null>();
  pageSizeOptions: number[];
  reports: Report[] = [];
  invoiceList: InvoiceResult[] = [];
  totalReports = 0;
  totalInvoices = 0;
  allOptions = ReportStatus.ALL;
  reportStatusOptions: SelectDropDownOption[] = [];
  noDataFoundMessage;
  @ViewChild('storeIdSearchBox', { static: true })
  storeIdSearchBox: ElementRef;
  fromDate = this.currentDate;
  toDate = this.currentDate;
  selectedTab = 0;
  boutiqueUser: any;
  businessDate: any;
  transactionTypes: any[] = [
    {
      value: DocumentTransactionTypesEnum.CM,
      description: DocumentTransactionTypesEnum.CM
    },
    {
      value: DocumentTransactionTypesEnum.AB,
      description: DocumentTransactionTypesEnum.AB
    },
    {
      value: DocumentTransactionTypesEnum.GC,
      description: DocumentTransactionTypesEnum.GC
    },
    {
      value: DocumentTransactionTypesEnum.GEP,
      description: DocumentTransactionTypesEnum.GEP
    },
    {
      value: DocumentTransactionTypesEnum.TEP,
      description: DocumentTransactionTypesEnum.TEP
    },
    {
      value: DocumentTransactionTypesEnum.ADV,
      description: DocumentTransactionTypesEnum.ACCEPT_ADVANCE
    },
    {
      value: DocumentTransactionTypesEnum.GRF,
      description: DocumentTransactionTypesEnum.GRF
    },
    {
      value: DocumentTransactionTypesEnum.GRN,
      description: DocumentTransactionTypesEnum.GRN
    }
  ];
  currentFiscalYear: string;
  locationCodes$: Observable<LocationSummaryList[]>;
  locationForSelection: SelectionDailogOption[] = [];
  selectLocationLableText: string;
  searchLocationPlaceHolder: string;

  constructor(
    private reportsFacade: ReportsFacade,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private router: Router,
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    public profiledatafacade: ProfileDataFacade,
    private bodEodService: SharedBodEodFeatureServiceAbstraction,
    private dialog: MatDialog,
    private selectionDialog: SelectionDialogService,
    private passwordConfigFacade: PasswordConfigFacade,
    private bodeodFacade: SharedBodEodFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private documentsSearchFacade: DocumentsSearchFacade
  ) {
    this.translate
      .get([
        'pw.entity.documentsEntity',
        'pw.passwordConfig.selectLocationPlaceHolder',
        'pw.passwordConfig.searchByLocationPlaceHolder'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.selectLocationLableText =
          entity['pw.passwordConfig.selectLocationPlaceHolder'];
        this.searchLocationPlaceHolder =
          entity['pw.passwordConfig.searchByLocationPlaceHolder'];
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.documentsEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  clearSearch() {
    this.documentsSearchForm.get('docNo').reset();
    this.pageEvent.pageIndex = 0;
  }

  ngOnInit() {
    this.documentsSearchFacade.resetInvoiceList();
    this.passwordConfigFacade.loadLocationCodes();
    this.bodeodFacade.loadLatestBusinessDay();
    this.locationCodes$ = this.passwordConfigFacade.getLocationCodes();
    this.documentsSearchForm = new FormGroup({
      storeId: new FormControl(null, [
        this.fieldValidatorsService.locationCodeField('Location code')
      ]),
      docNo: new FormControl(null, [
        this.fieldValidatorsService.requestNumberField('Doc No.')
      ]),
      fromDate: new FormControl(null),
      toDate: new FormControl(null),
      transactionType: new FormControl(null, [
        this.fieldValidatorsService.requiredField('Transaction Type')
      ]),
      fiscalYear: new FormControl(null, [
        this.fieldValidatorsService.fiscalYearField('Fiscal Year')
      ])
    });

    this.bodEodService
      .getFiscalYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: number) => {
        if (fiscalYear) {
          this.currentFiscalYear = fiscalYear.toString();
        } else {
          this.currentFiscalYear = moment().year().toString();
        }
      });

    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.businessDate = moment(data);
      });

    this.reportsFacade
      .getReports()
      .pipe(takeUntil(this.destroy$))
      .subscribe(reports => {
        this.reports = reports;
      });

    this.documentsSearchFacade
      .getInvoiceListResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((invoiceListData: InvoiceListResponse) => {
        if (invoiceListData) {
          this.totalInvoices = invoiceListData.totalElements
            ? invoiceListData.totalElements
            : 0;
          this.invoiceList =
            invoiceListData.results && invoiceListData.results.length > 0
              ? invoiceListData.results
              : [];
        }
      });

    this.reportsFacade
      .getTotalReports()
      .pipe(takeUntil(this.destroy$))
      .subscribe(totalReports => {
        this.totalReports = totalReports;
      });

    this.isLoading$ = this.documentsSearchFacade.getIsLoading();

    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.pageEvent.pageSize = pageSize;
        if (this.reports.length) {
          this.loadInvoiceList();
        }
      });

    this.documentsSearchFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.locationCodes$
      .pipe(takeUntil(this.destroy$))
      .subscribe((locations: LocationSummaryList[]) => {
        if (locations) {
          this.locationForSelection = locations.map(location => ({
            id: location.locationCode,
            description: location.locationCode + ' - ' + location.description
          }));
        }
      });
  }

  fromDateChange(event) {
    this.fromDate = event?.value;
    this.toDate = null;
  }

  toDateChange(event) {
    if (event?.value) {
      this.toDate = event?.value;
    }
  }

  searchDocs() {
    this.pageEvent.pageIndex = 0;
    this.loadInvoiceList();
  }

  openLocationSelectionPopup() {
    this.dialog.closeAll();
    this.selectionDialog
      .open({
        title: this.selectLocationLableText,
        placeholder: this.searchLocationPlaceHolder,
        options: this.locationForSelection
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          this.documentsSearchForm
            .get(['storeId'])
            .patchValue(selectedOption.id);
        }
      });
  }

  getDocumentName(documentPath: string): string {
    let documentName = '';
    if (documentPath) {
      const documentNameFirstIndex = documentPath.lastIndexOf('/') + 1;
      documentName = documentPath.substring(documentNameFirstIndex);
    }
    return documentName;
  }

  downloadReport(data: InvoiceResult) {
    let fileData: FileData = {
      id: data.documentId,
      name: this.getDocumentName(data?.documentName),
      locationCode: data.locationCode
    };
    this.documentsSearchFacade.downloadDocument(fileData);
  }

  loadInvoiceList() {
    const txnType = this.documentsSearchForm.get('transactionType').value
      ? this.documentsSearchForm.get('transactionType').value
      : null;
    const requestPayload: InvoiceListPayload = {
      docNo: this.documentsSearchForm.get('docNo').value,
      fiscalYear: this.documentsSearchForm.get('fiscalYear').value,
      fromDocDate: this.documentsSearchForm.get('fromDate').value
        ? moment(this.documentsSearchForm.get('fromDate').value).format()
        : '',
      toDocDate: this.documentsSearchForm.get('toDate').value
        ? moment(this.documentsSearchForm.get('toDate').value).format()
        : '',
      locationCode: this.documentsSearchForm.get('storeId').value
    };
    this.documentsSearchFacade.loadInvoiceList(
      requestPayload,
      txnType,
      this.pageEvent.pageIndex,
      this.pageEvent.pageSize
    );
  }

  loadPaginateData(event: PageEvent) {
    this.pageEvent = event;
    this.loadInvoiceList();
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
  }

  onTransactionTypeChange(event: any) {
    this.documentsSearchForm.get('transactionType').patchValue(event.value);
  }

  back() {
    this.router.navigate([getHomeUrl()]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
