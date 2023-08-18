import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Inject,
  TemplateRef
} from '@angular/core';
import {
  PayerBankDetails,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  CustomErrors,
  FileNamesEnum,
  FilePathEnum,
  OverlayNotificationEventType,
  FileGroupEnum,
  NewFileUploadResponse,
  FileUploadCount,
  FileUploadPopupEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  FileUploadTypeEnum,
  ConfigurationsMenuKeyEnum
} from '@poss-web/shared/models';
import { PayerBankFacade } from '@poss-web/shared/payer-bank/data-access-payer-bank';
import { Subject, Observable } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import {
  getConfigurationHomeRouteUrl,
  getFileStatusRouteUrl
} from '@poss-web/shared/util-site-routes';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { FileuploadConfirmationPopupComponent } from '@poss-web/shared/components/ui-fileupload-confirmation-popup';
import { POSS_WEB_PAYER_BANK_FILE_SIZE } from '@poss-web/shared/util-config';
import { FileDownloadService } from '@poss-web/shared/util-common';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
const csvExtn = 'csv';
const reqfileKey = 'reqFile';
@Component({
  selector: 'poss-web-payer-bank-list',
  templateUrl: './payer-bank-list.component.html'
})
export class PayerBankListComponent implements OnInit, OnDestroy {
  banksList: PayerBankDetails[] = [];
  banksDetails: PayerBankDetails[] = [];
  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  payerBanks = null;
  hasUpdated = false;
  payerBankPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  totalElements$: Observable<number>;
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  invalidSearch = false;
  @ViewChild('fileInput') fileInput;
  fileResponse: FileUploadCount;

  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  private confirmSuccessNotificationTemplate: TemplateRef<any>;
  constructor(
    private payerBankFacade: PayerBankFacade,
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private appsettingFacade: AppsettingFacade,
    private dialog: MatDialog,
    private fileDownloadService: FileDownloadService,
    private alertPopupService: AlertPopupServiceAbstraction,
    @Inject(POSS_WEB_PAYER_BANK_FILE_SIZE) public fileSize,
    private fileFacade: FileFacade
  ) {}

  ngOnInit() {
    this.payerBankFacade.resetFileData();
    this.fileFacade.clearResponse();
    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.payerBankPageEvent.pageSize = pageSize;
        this.loadPayerBanks();
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
    this.payerBankFacade
      .getBankDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((bankDetails: PayerBankDetails[]) => {
        this.banksDetails = bankDetails;
      });
    this.fileFacade
      .getFileUploadResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fileResponse: NewFileUploadResponse) => {
        if (fileResponse) {
          if (fileResponse.hasError) {
            this.alertPopupService.open({
              type: AlertPopupTypeEnum.ERROR,
              message: fileResponse.message
            });
          } else {
            if (
              fileResponse.uploadType === FileUploadTypeEnum.SYNC &&
              fileResponse.records
            ) {
              this.fileResponse = fileResponse.records;
              const fileError = fileResponse.hasError;
              const dialogRef = this.dialog.open(
                FileuploadConfirmationPopupComponent,
                {
                  width: '420px',
                  data: {
                    fileUploadResponse: this.fileResponse
                      ? this.fileResponse
                      : {},
                    isFileError: fileError,
                    label: 'Banks'
                  }
                }
              );
              dialogRef
                .afterClosed()
                .pipe(takeUntil(this.destroy$))
                .subscribe(data => {
                  if (data === FileUploadPopupEnum.DOWNLOAD) {
                    this.fileFacade.downloadErrorLog(
                      this.fileResponse.errorLogId,
                      FileGroupEnum.PAYER_BANK
                    );
                  }
                });
              if (
                this.fileResponse.failureCount !== this.fileResponse.totalCount
              )
                this.loadPayerBanks();
            } else if (fileResponse.uploadType === FileUploadTypeEnum.ASYNC) {
              this.showConfirmReceiveSuccessNotification();
              this.loadPayerBanks();
            }
          }
        }
      });

    this.payerBankFacade
      .getErrorLog()
      .pipe(takeUntil(this.destroy$))
      .subscribe(errorlog => {
        if (errorlog) {
          this.fileDownloadService.downloadErrorFile(
            errorlog,
            this.fileResponse.errorLogId
          );
        }
      });

    this.payerBankFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.fileInput.nativeElement.value = '';
          this.errorHandler(error);
        }
      });
    this.isLoading$ = this.payerBankFacade.getIsLoading();
    this.totalElements$ = this.payerBankFacade.getTotalElements();
  }

  showConfirmReceiveSuccessNotification() {
    const key = 'pw.fileUpload.fileUploadStatusMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.CUSTOM,
            message: translatedMsg,
            hasBackdrop: true,
            hasClose: true,
            template: this.confirmSuccessNotificationTemplate
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.overlayNotification.close();
            }
          });
      });
  }
  fileStatus() {
    this.router.navigate([getFileStatusRouteUrl()]);
  }
  search(searchValue) {
    this.payerBankFacade.searchPayerBank(searchValue.toUpperCase());
  }
  paginate(pageEvent: PageEvent) {
    this.payerBankPageEvent = pageEvent;
    this.loadPayerBanks();
  }
  loadPayerBanks() {
    this.payerBankFacade.loadPayerBanks(this.payerBankPageEvent);
  }
  back() {
    this.payerBankFacade.resetFileData();
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.BANKING_REVENUE_MENU_KEY
      }
    });
  }
  uploadFile(event) {
    this.overlayNotification.close();
    this.overlayNotification.close();
    const fileList: FileList = event.target.files;
    const formData: FormData = new FormData();
    if (fileList.length > 0) {
      const file: File = fileList[0];
      if (file.size > this.fileSize) {
        const errorKey = 'pw.payerBanks.maximumFileSizeErrorMessage';
        this.showNotifications(errorKey);
        this.fileInput.nativeElement.value = '';
      }
      const extn = file.name.split('.').pop();
      if (extn !== csvExtn) {
        const errorKey = 'pw.fileUpload.CSVFileTypeErrorMessage';
        this.showNotifications(errorKey);
        this.fileInput.nativeElement.value = '';
      }
      const type = file.name.substring(0, 3);
      formData.append(reqfileKey, file);
      if (extn === csvExtn && file.size < this.fileSize) {
        if (type) {
          formData.set(reqfileKey, file, file.name);
          this.fileFacade.loadFileUpload(formData, FileGroupEnum.PAYER_BANK);
          this.fileInput.nativeElement.value = '';
        }
      }
    }
  }

  showNotifications(key: string) {
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: false
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }
  downloadFile() {
    this.fileDownloadService.download(
      FileNamesEnum.PAYER_BANKS,
      FilePathEnum.PAYER_BANKS
    );
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
