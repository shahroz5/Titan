import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  CNSearchEnum,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  ConfigurationsMenuKeyEnum,
  LocationSettingAttributesEnum,
  FileNamesEnum,
  FilePathEnum,
  SaveCnActionPayload,
  CNDirectSearchEnum
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { getConfigurationHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { TranslateService } from '@ngx-translate/core';
import { PageEvent } from '@angular/material/paginator';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { CnDirectFacade } from '@poss-web/eposs/credit-note-direct/data-access-credit-note-direct';
import { POSS_WEB_AIRPAY_HOST_CONFIG_FILE_SIZE } from '@poss-web/shared/util-config';
import { FileDownloadService } from '@poss-web/shared/util-common';
import { ErrorGridPopupComponent } from '@poss-web/shared/components/ui-error-grid-popup';
import { MatDialog } from '@angular/material/dialog';

const csvExtn = 'csv';
const reqfileKey = 'reqFile';
const errorCode = {
  code1: 'ERR-SALE-377',
  code2: 'ERR-SALE-379'
};
@Component({
  selector: 'poss-web-credit-note-direct',
  templateUrl: './credit-note-direct.component.html'
})
export class CreditNoteDirectComponent implements OnInit, OnDestroy {
  CNSearchEnumRef = CNSearchEnum;
  destroy$ = new Subject<null>();
  count$: Observable<number>;
  isLoading$: Observable<boolean>;
  searchResult$: Observable<any>;
  searchPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  firstSearchPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  currentFiscalYear: string;
  searchValue: {
    locationCode: any;
    cnNumber: any;
    fiscalYear: any;
    pageEvent: { page: number; size: number };
  };
  isUpload = false;
  operation: string;
  cnNoLabel: any;
  fiscalYearLabel: any;
  locationCodeLabel: any;
  subtitle: any;
  constructor(
    private router: Router,
    private appsettingFacade: AppsettingFacade,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private locationSettingsFacade: LocationSettingsFacade,
    private cnDirectFacade: CnDirectFacade,
    private fileDownloadService: FileDownloadService,

    @Inject(POSS_WEB_AIRPAY_HOST_CONFIG_FILE_SIZE) public fileSize,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cnDirectFacade.loadReset();
    this.getTranslatedMsg();
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.COUNTRY_FISCAL_YEAR)
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: string) => {
        this.currentFiscalYear = fiscalYear;
      });

    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });

    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.searchPageEvent.pageSize = pageSize;
        this.firstSearchPageEvent.pageSize = pageSize;
      });

    this.cnDirectFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          if (
            error.code === errorCode.code1 ||
            error.code === errorCode.code2
          ) {
            if (error.errorCause && error.errorCause?.length > 0) {
              const notEligibleCns = [];
              for (const cn of error.errorCause) {
                notEligibleCns.push({
                  cnNo: cn.docNo,
                  fiscalYear: cn.fiscalYear,
                  locationCode: cn.locationCode
                });
              }
              const columnDefs = [
                {
                  field: 'cnNo',
                  headerName: this.cnNoLabel,
                  flex: 1
                },
                {
                  field: 'fiscalYear',
                  headerName: this.fiscalYearLabel,
                  flex: 1
                },
                {
                  field: 'locationCode',
                  headerName: this.locationCodeLabel,
                  flex: 1
                }
              ];

              this.callPopup(columnDefs, notEligibleCns);
            }
          }
          this.errorHandler(error);
        }
      });

    this.cnDirectFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          if (this.operation === CNDirectSearchEnum.ACTIVATE) {
            this.showNotifications('pw.creditNoteDirect.activateSuccessMsg');
          }
          if (this.operation === CNDirectSearchEnum.SUSPEND) {
            this.showNotifications('pw.creditNoteDirect.suspendSuccessMsg');
          }
          if (this.operation === CNDirectSearchEnum.ACTIVATE_TRANSFERRED_CN) {
            this.showNotifications(
              'pw.creditNoteDirect.activateTransferesSuccessMsg'
            );
          }
          if (this.operation === CNDirectSearchEnum.REMOVE_GOLD_RATE) {
            this.showNotifications(
              'pw.creditNoteDirect.removeGoldRateSuccessMsg'
            );
          }
          if (!this.isUpload) {
            this.cnDirectFacade.searchCn(this.searchValue);
          } else {
            this.cnDirectFacade.uploadCn({
              pageEvent: {
                page: this.searchPageEvent.pageIndex,
                size: this.searchPageEvent.pageSize
              }
            });
          }
        }
      });
    this.searchResult$ = this.cnDirectFacade.getCnList();
    this.isLoading$ = this.cnDirectFacade.getIsloading();
    this.count$ = this.cnDirectFacade.getTotalElements();
  }
  getTranslatedMsg() {
    this.translate
      .get([
        'pw.creditNote.cnNoLabel',
        'pw.creditNote.fiscalYearLabel',
        'pw.creditNoteDirect.subtitle',
        'pw.creditNote.locationCodeLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.cnNoLabel = translatedMessages['pw.creditNote.cnNoLabel'];
        this.locationCodeLabel =
          translatedMessages['pw.creditNote.locationCodeLabel'];
        this.fiscalYearLabel =
          translatedMessages['pw.creditNote.fiscalYearLabel'];
        this.subtitle = translatedMessages['pw.creditNoteDirect.subtitle'];
      });
  }
  downloadFileFormat() {
    this.fileDownloadService.download(
      FileNamesEnum.CN_SEARCH_FILE,
      FilePathEnum.CN_SEARCH_FILE
    );
  }
  searchFn(searchForm) {
    this.searchPageEvent = this.firstSearchPageEvent;
    this.isUpload = false;
    this.searchValue = {
      locationCode:
        searchForm.get('location')?.value !== ''
          ? searchForm.get('location')?.value
          : null,
      cnNumber:
        searchForm.get('cnNumber')?.value !== ''
          ? searchForm.get('cnNumber')?.value
          : null,
      fiscalYear:
        searchForm.get('fiscalYear')?.value !== ''
          ? searchForm.get('fiscalYear')?.value
          : null,
      pageEvent: {
        page: this.firstSearchPageEvent.pageIndex,
        size: this.firstSearchPageEvent.pageSize
      }
    };
    if (
      this.searchValue?.locationCode === null &&
      this.searchValue?.fiscalYear === null &&
      this.searchValue?.cnNumber === null
    ) {
      this.showAlertNotification('pw.creditNoteDirect.alertMessage');
    } else if (
      (this.searchValue?.fiscalYear !== null &&
        this.searchValue?.cnNumber === null &&
        this.searchValue?.fiscalYear !== null &&
        this.searchValue?.locationCode === null) ||
      (this.searchValue?.locationCode !== null &&
        this.searchValue?.fiscalYear === null) ||
      (this.searchValue?.cnNumber !== null &&
        this.searchValue?.fiscalYear === null)
    ) {
      this.showAlertNotification('pw.creditNoteDirect.alertMessage');
    } else {
      this.cnDirectFacade.searchCn(this.searchValue);
    }
  }
  searchPaginated(pageEvent) {
    this.searchPageEvent = pageEvent;
    this.searchValue = {
      ...this.searchValue,
      pageEvent: {
        page: pageEvent.pageIndex,
        size: pageEvent.pageSize
      }
    };
    if (!this.isUpload) {
      this.cnDirectFacade.searchCn(this.searchValue);
    } else {
      this.cnDirectFacade.uploadCn({
        pageEvent: {
          page: pageEvent.pageIndex,
          size: pageEvent.pageSize
        }
      });
    }
  }
  uploadCnFn(event) {
    this.isUpload = true;
    this.searchPageEvent = this.firstSearchPageEvent;
    const fileList: FileList = event.target.files;
    const formData: FormData = new FormData();
    if (fileList.length > 0) {
      const file: File = fileList[0];
      if (file.size > this.fileSize) {
        const errorKey = 'pw.fileUpload.maximumFileSizeErrorMessage3';
        this.showAlertNotification(errorKey);
      }
      const extn = file.name.split('.').pop();
      if (extn !== csvExtn) {
        const errorKey = 'pw.fileUpload.CSVFileTypeErrorMessage';
        this.showAlertNotification(errorKey);
      }
      const name = file.name.substring(0, 3);

      formData.append(reqfileKey, file);
      if (extn === csvExtn && file.size < this.fileSize) {
        if (name) {
          formData.set(reqfileKey, file, file.name);
          this.cnDirectFacade.uploadCn({
            file: formData,
            pageEvent: {
              page: this.firstSearchPageEvent.pageIndex,
              size: this.firstSearchPageEvent.pageSize
            }
          });
        }
      }
    }
  }
  save(saveCnActionPayload: SaveCnActionPayload) {
    this.operation = saveCnActionPayload.operation;
    this.cnDirectFacade.saveCnStatus(saveCnActionPayload);
  }

  showNotifications(key) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  showAlertNotification(key: string): void {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            hasClose: true,
            hasBackdrop: true,
            message: translatedMsg
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }
  callPopup(columnDefs, rowData) {
    this.dialog.open(ErrorGridPopupComponent, {
      autoFocus: false,
      width: '500px',
      disableClose: true,
      data: {
        title: '',
        subTitle: this.subtitle,
        columnDefs: columnDefs,
        rowData: rowData,
        buttonText: 'OK'
      }
    });
  }
  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasBackdrop: true,
        hasClose: true,
        error: error
      })
      .events.pipe(take(1))
      .subscribe();
  }

  back() {
    this.cnDirectFacade.loadReset();
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.CREDIT_NOTE_CONFIGURATION_MENU_KEY
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
