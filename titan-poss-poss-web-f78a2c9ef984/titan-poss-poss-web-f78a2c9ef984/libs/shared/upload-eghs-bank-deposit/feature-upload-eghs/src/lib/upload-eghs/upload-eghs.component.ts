import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AlertPopupServiceAbstraction,
  CustomErrors,
  FileNamesEnum,
  FilePathEnum,
  FileUploadCount,
  FileUploadPopupEnum,
  AlertPopupTypeEnum,
  NewFileUploadResponse,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PossHomeKeyEnum,
  FileUploadTypeEnum
} from '@poss-web/shared/models';
import { UploadeGHSFacade } from '@poss-web/shared/upload-eghs-bank-deposit/data-access-upload-eghs';
import {
  POSS_APP_TYPE,
  POSS_WEB_UPLOAD_EGHS_FILE_SIZE
} from '@poss-web/shared/util-config';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import {
  getFileStatusRouteUrl,
  getPossHomeRouteUrl,
} from '@poss-web/shared/util-site-routes';
import { MatDialog } from '@angular/material/dialog';
import { FileuploadConfirmationPopupComponent } from '@poss-web/shared/components/ui-fileupload-confirmation-popup';
import { ErrorGridPopupComponent } from '@poss-web/shared/components/ui-error-grid-popup';
import { FileDownloadService } from '@poss-web/shared/util-common';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import * as moment from 'moment';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
const txtExtn = 'txt';
const reqfileKey = 'reqFile';
@Component({
  selector: 'poss-web-upload-eghs',
  templateUrl: './upload-eghs.component.html'
})
export class UploadEGHSComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput;
  fileResponse: FileUploadCount;

  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  dateFormat: string;
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  private confirmSuccessNotificationTemplate: TemplateRef<any>;
  bankNameTranLabel: string;
  paymentModeTranLabel: string;
  chequeNoTranLabel: string;
  collectionDateTranLabel: string;
  locationCodeTranLabel: string;
  headerTranLabel: string;
  subHeadingTranLabel: string;
  errorMessageLabel: string;
  openErrorPopup = false;
  constructor(
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private uploadeGHSFacade: UploadeGHSFacade,
    private router: Router,
    private dialog: MatDialog,
    private appSettingFacade: AppsettingFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    @Inject(POSS_WEB_UPLOAD_EGHS_FILE_SIZE) public fileSize,
    private fileDownloadService: FileDownloadService,
    private fileFacade: FileFacade,
    @Inject(POSS_APP_TYPE) private appType
  ) {
    this.translate
      .get([
        'pw.uploadeGHS.bankNameLabel',
        'pw.uploadeGHS.paymentModeLabel',
        'pw.uploadeGHS.chequeNoLabel',
        'pw.uploadeGHS.collectionDateLabel',
        'pw.uploadeGHS.locationCodeLabel',
        'pw.uploadeGHS.headerLabel',
        'pw.uploadeGHS.subHeaderLabel',
        'pw.uploadeGHS.errorMessagesLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: any) => {
        this.bankNameTranLabel = translatedMsg['pw.uploadeGHS.bankNameLabel'];
        this.paymentModeTranLabel =
          translatedMsg['pw.uploadeGHS.paymentModeLabel'];
        this.chequeNoTranLabel = translatedMsg['pw.uploadeGHS.chequeNoLabel'];
        this.collectionDateTranLabel =
          translatedMsg['pw.uploadeGHS.collectionDateLabel'];
        this.locationCodeTranLabel =
          translatedMsg['pw.uploadeGHS.locationCodeLabel'];
        this.headerTranLabel = translatedMsg['pw.uploadeGHS.headerLabel'];
        this.subHeadingTranLabel =
          translatedMsg['pw.uploadeGHS.subHeaderLabel'];
        this.errorMessageLabel =
          translatedMsg['pw.uploadeGHS.errorMessagesLabel'];
      });
  }

  ngOnInit(): void {
    this.uploadeGHSFacade.resetUploadEghs();
    this.fileFacade.clearResponse();
    this.isLoading$ = this.fileFacade.getIsLoading();
    this.appSettingFacade
      .getDateFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe((dateFormat: string) => {
        this.dateFormat = dateFormat;
      });
    this.fileFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          if (error.code === 'ERR-SALE-300') {
            let i = 1;
            const pendingDates = [];
            for (const date of error.errorCause) {
              pendingDates.push({
                sno: i++,
                bussinessDate: moment(date).format(this.dateFormat)
              });
            }

            const columnDefs = [
              {
                field: 'sno',
                headerName: 'SNO',
                flex: 1
              },
              {
                field: 'bussinessDate',
                headerName: 'BusinessDate',
                flex: 1
              }
            ];
            if (!this.openErrorPopup) this.callPopup(columnDefs, pendingDates);
          } else {
            this.errorHandler(error);
          }
        }
      });
    this.fileFacade
      .getFileUploadResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fileResponse: NewFileUploadResponse) => {
        if (fileResponse) {
          if (
            fileResponse.hasError &&
            fileResponse.records.failureCount === 0
          ) {
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
              const fileError = false;
              const dialogRef = this.dialog.open(
                FileuploadConfirmationPopupComponent,
                {
                  width: '420px',
                  disableClose: true,
                  data: {
                    fileUploadResponse: this.fileResponse
                      ? this.fileResponse
                      : {},
                    isFileError: fileError,
                    label: 'Upload-Eghs'
                  }
                }
              );
              dialogRef
                .afterClosed()
                .pipe(takeUntil(this.destroy$))
                .subscribe(data => {
                  if (data === FileUploadPopupEnum.ERROR) {
                    const columnDefs = [
                      {
                        field: 'bankName',
                        headerName: this.bankNameTranLabel,
                        flex: 1
                      },
                      {
                        field: 'type',
                        headerName: this.paymentModeTranLabel,
                        flex: 1
                      },
                      {
                        field: 'chequeNo',
                        headerName: this.chequeNoTranLabel,
                        flex: 1
                      },
                      {
                        field: 'collectionDate',
                        headerName: this.collectionDateTranLabel,
                        flex: 1
                      },
                      {
                        field: 'locationCode',
                        headerName: this.locationCodeTranLabel,
                        flex: 1
                      },
                      {
                        field: 'errorMessage',
                        headerName: this.errorMessageLabel,
                        flex: 1
                      }
                    ];
                    const rowData = [];
                    for (const error of fileResponse.errors) {
                      rowData.push({
                        chequeNo: error.errorDetails.chequeNo,
                        bankName: error.errorDetails.bankName,
                        type: error.errorDetails.type,
                        locationCode: error.errorDetails.locationCode,
                        collectionDate: moment(
                          error.errorDetails.collectionDate
                        ).format(this.dateFormat),
                        errorMessage: error.errorMessage
                      });
                    }

                    const dialogRef = this.dialog.open(
                      ErrorGridPopupComponent,
                      {
                        autoFocus: false,
                        width: '720px',
                        disableClose: true,
                        data: {
                          title: this.headerTranLabel,
                          subTitle: this.subHeadingTranLabel,
                          columnDefs: columnDefs,
                          rowData: rowData,
                          buttonText: 'OK'
                        }
                      }
                    );
                    dialogRef
                      .afterClosed()
                      .pipe(takeUntil(this.destroy$))
                      .subscribe(res => {
                        if (res === 'ok') {
                        }
                      });
                  }
                });
            }
            // } else if (fileResponse !== undefined) {
            //   this.showConfirmReceiveSuccessNotification();
            // }
          }
        }
      });
  }
  downloadFile() {
    this.fileDownloadService.download(
      FileNamesEnum.UPLOAD_EGHS,
      FilePathEnum.UPLOAD_EGHS
    );
  }
  callPopup(columnDefs, rowData) {
    this.openErrorPopup = true;
    const dialogRef = this.dialog.open(ErrorGridPopupComponent, {
      autoFocus: false,
      width: '500px',
      disableClose: true,
      data: {
        title: '',
        subTitle:
          'EGHS BANKING DETAILS NOT UPLOADED FOR FOLLOWING BUSINESS DATES',
        columnDefs: columnDefs,
        rowData: rowData,
        buttonText: 'OK'
      }
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.openErrorPopup = false;
        if (res === 'ok') {
        }
      });
  }
  fileStatus() {
    this.router.navigate([getFileStatusRouteUrl()]);
  }
  // showConfirmReceiveSuccessNotification() {
  //   const key = 'pw.fileUpload.fileUploadStatusMessage';
  //   this.translate
  //     .get(key)
  //     .pipe(take(1))
  //     .subscribe((translatedMsg: string) => {
  //       this.overlayNotification
  //         .show({
  //           type: OverlayNotificationType.CUSTOM,
  //           message: translatedMsg,
  //           hasBackdrop: true,
  //           hasClose: true,
  //           template: this.confirmSuccessNotificationTemplate
  //         })
  //         .events.pipe(take(1))
  //         .subscribe((event: OverlayNotificationEventRef) => {
  //           if (event.eventType === OverlayNotificationEventType.CLOSE) {
  //             this.overlayNotification.close();
  //           }
  //         });
  //     });
  // }
  back() {
    this.uploadeGHSFacade.resetUploadEghs();
    this.router.navigate([getPossHomeRouteUrl()], {
      queryParams: {
        menu: PossHomeKeyEnum.EGHS_BANK_DEPOSIT
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
  uploadFile(event) {
    this.overlayNotification.close();
    const fileList: FileList = event.target.files;
    const formData: FormData = new FormData();
    if (fileList.length > 0) {
      const file: File = fileList[0];
      if (file.size > this.fileSize) {
        const errorKey = 'pw.uploadeGHS.maximumFileSizeErrorMessage';
        this.showNotifications(errorKey);
        this.fileInput.nativeElement.value = '';
      }
      const extn = file.name.split('.').pop();
      if (extn !== txtExtn) {
        const errorKey = 'pw.uploadeGHS.textFileTypeErrorMessage';
        this.showNotifications(errorKey);
        this.fileInput.nativeElement.value = '';
      }

      const type = file.name.substring(0, 3);
      formData.append(reqfileKey, file);
      if (extn === txtExtn && file.size < this.fileSize) {
        this.fileFacade.loadFileUpload(formData, null, null, this.appType);
        this.fileInput.nativeElement.value = '';
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
            hasClose: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
