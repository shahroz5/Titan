import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable, Subject } from 'rxjs';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { AlertPopupServiceAbstraction, AlertPopupTypeEnum, ConfigurationsMenuKeyEnum, CustomErrors, EmployeeLoanConfigList, FileGroupEnum, FileNamesEnum, FilePathEnum, FileUploadCount, FileUploadPopupEnum, FileUploadTypeEnum, NewFileUploadResponse, OverlayNotificationEventRef, OverlayNotificationEventType, OverlayNotificationServiceAbstraction, OverlayNotificationType, SortItem } from '@poss-web/shared/models';
import { take, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import {
  getConfigurationHomeRouteUrl,
  getFileStatusRouteUrl
} from '@poss-web/shared/util-site-routes';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FileuploadConfirmationPopupComponent } from '@poss-web/shared/components/ui-fileupload-confirmation-popup';
import { FileDownloadService } from '@poss-web/shared/util-common';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { POSS_WEB_EMP_LOAN_CONFIG_FILE_SIZE } from '@poss-web/shared/util-config';
import { EmployeeLoanConfigurationFacade } from '@poss-web/eposs/employee-loan-config/data-access-employee-loan-config';


const csvExtn = 'csv';
const reqfileKey = 'reqFile';
@Component({
  selector: 'poss-web-employee-loan-config-detail',
  templateUrl: './employee-loan-config-detail.component.html',
  styleUrls: []
})
export class EmployeeLoanConfigDetailComponent implements OnInit, OnDestroy {

  empLoanConfigDetails = [];
  empLoanConfigPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  pageSize: number;
  pageEvent: PageEvent;
  totalConfigDetailsCount$: Observable<number>;
  filename: '';
  destroy$: Subject<null> = new Subject<null>();
  defaultSort: SortItem = { colId: 'createdDate', sort: 'Desc' };
  uploadResponse$: Observable<any>;
  updateResponse$: Observable<any>;
  totalElements$: Observable<number>;
  empLoanConfigList$: Observable<EmployeeLoanConfigList[]>;
  isLoading$: Observable<boolean>;
  permission$: Observable<any[]>;

  fileResponse: FileUploadCount;
  fileUploadErrorMsg: '';
  statusUpdateMsg: '';
  templatePath: '';
  statusFailedMsg: '';
  successText: '';
  failedText: '';
  fileError: boolean;
  empLoanConfigLabel: string;
  count = 0;

  configList: any[] = [];
  length = 0;


  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  private confirmSuccessNotificationTemplate: TemplateRef<any>;

  constructor(
    private fileFacade: FileFacade,
    private appSettingFacade: AppsettingFacade,
    private dialog: MatDialog,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private empLoanConfigurationFacade: EmployeeLoanConfigurationFacade,
    private translate: TranslateService,
    private router: Router,
    private alertPopupService: AlertPopupServiceAbstraction,
    private fileDownloadService: FileDownloadService,
    private permissionfacade: PermissionFacade,
    @Inject(POSS_WEB_EMP_LOAN_CONFIG_FILE_SIZE) public fileSize
  ) {
    this.translate
      .get([
        'pw.fileUpload.empLoanConfigFileName',
        'pw.fileUpload.uploadFailedMsg',
        'pw.employeeLoanConfiguration.statusUpdateMsg',
        'pw.employeeLoanConfiguration.templatePath',
        'pw.employeeLoanConfiguration.statusFailedMsg',
        'pw.employeeLoanConfiguration.successText',
        'pw.employeeLoanConfiguration.failedText',
        'pw.employeeLoanConfiguration.empLoanConfigurationLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.empLoanConfigLabel = translatedMessages['pw.employeeLoanConfiguration.empLoanConfigurationLabel'];
        this.filename = translatedMessages['pw.fileUpload.empLoanConfigFileName'];
        this.fileUploadErrorMsg =
          translatedMessages['pw.fileUpload.uploadFailedMsg'];
        this.templatePath =
          translatedMessages['pw.employeeLoanConfiguration.templatePath'];
        this.statusUpdateMsg =
          translatedMessages['pw.employeeLoanConfiguration.statusUpdateMsg'];
        this.statusFailedMsg =
          translatedMessages['pw.employeeLoanConfiguration.statusFailedMsg'];
        this.successText =
          translatedMessages['pw.employeeLoanConfiguration.successText'];
        this.failedText =
          translatedMessages['pw.employeeLoanConfiguration.failedText'];
      });
  }

  ngOnInit() {
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.empLoanConfigPageEvent.pageSize = data;
        this.pageSize = data;
        this.loadConfiguration(this.defaultSort);
      });
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });
    this.fileFacade.clearResponse();
    this.permission$ = this.permissionfacade.getPermissionforURL();
    this.componentInit();
  }

  componentInit() {
    this.fileFacade.clearResponse();
    this.uploadResponse$ = this.fileFacade.getFileUploadResponse();
    this.empLoanConfigList$ = this.empLoanConfigurationFacade.GetEmpLoanConfigList();
    this.isLoading$ = this.empLoanConfigurationFacade.getIsLoading();

    this.totalElements$ = this.empLoanConfigurationFacade.getTotalElements();
    this.fileFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.empLoanConfigurationFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.uploadResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe((fileResponse: NewFileUploadResponse) => {
        if (fileResponse) {
          if (fileResponse.hasError) {
            this.alertPopupService.open({
              type: AlertPopupTypeEnum.ERROR,
              message: fileResponse.message
            });
          } else {
            this.fileResponse = fileResponse.records;
            if (
              fileResponse.uploadType === FileUploadTypeEnum.SYNC &&
              this.fileResponse
            ) {
              this.fileError = fileResponse.hasError;
              const dialogRef = this.dialog.open(
                FileuploadConfirmationPopupComponent,
                {
                  width: '420px',
                  data: {
                    fileUploadResponse: this.fileResponse
                      ? this.fileResponse
                      : {},
                    isFileError: this.fileError,
                    label: 'Employee Loan Config'
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
                      FileGroupEnum.EMPLOYEE_LOAN_CONFIG
                    );
                  }
                });
              if (
                this.fileResponse.failureCount !== this.fileResponse.totalCount
              )
                this.loadConfiguration(this.defaultSort);
            } else if (fileResponse.uploadType === FileUploadTypeEnum.ASYNC) {
              this.showConfirmReceiveSuccessNotification();
              this.loadConfiguration(this.defaultSort);
            }
          }
        }
      });
    this.totalElements$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        if (data) {
          this.count = data;
        }
      });

    this.empLoanConfigList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: EmployeeLoanConfigList[]) => {
        this.empLoanConfigDetails = data;
        this.length = data.length;
      });
    this.empLoanConfigurationFacade.getConfigListUpdated().pipe(takeUntil(this.destroy$))
    .subscribe((data: boolean) => {
      if (data) {
        this.loadConfiguration(this.defaultSort);
      }
    })
  }

  fileStatus() {
    this.router.navigate([getFileStatusRouteUrl()]);
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true, // optional
        error: error
      })
      .events.pipe(take(1))
      .subscribe((event: OverlayNotificationEventRef) => {
        // Action based event
      });
  }

  sort(sortItem: SortItem) {
    if (sortItem) {
      this.defaultSort = sortItem;
    } else {
      this.defaultSort = { colId: 'createdDate', sort: 'Desc' };
    }
    this.loadConfiguration(this.defaultSort);
  }

  loadConfiguration(sortField?: SortItem, locationCode?: string) {
    this.empLoanConfigurationFacade.loadEmpLoanConfigList(
      this.empLoanConfigPageEvent,
      sortField,
    );
  }

  downloadFile() {
    this.fileDownloadService.download(
      FileNamesEnum.EMPLOANCONFIG,
      FilePathEnum.EMPLOANCONFIG
    );
  }

  uploadFile(data: { event: any; fileInput: any }) {
    this.overlayNotification.close();
    const fileList: FileList = data.event.target.files;
    const formData: FormData = new FormData();
    if (fileList.length > 0) {
      const file: any = fileList[0];
      if (file.size > this.fileSize) {
        const errorKey = 'pw.fileUpload.maximumFileSizeErrorMessage3';
        this.failureNotification(errorKey);
      }
      const extn = file.name.split('.').pop();

      if (extn !== csvExtn) {
        const errorKey = 'pw.fileUpload.CSVFileTypeErrorMessage';
        this.failureNotification(errorKey);
      }

      const type = file.name.substring(0, 3);

      formData.append(reqfileKey, file);
      if (extn === csvExtn && file.size < this.fileSize) {

        if (type) {
          formData.set(reqfileKey, file, file.name);
          this.fileFacade.loadFileUpload(
            formData,
            FileGroupEnum.EMPLOYEE_LOAN_CONFIG
          );
          data.fileInput.nativeElement.value = '';
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
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            // Action based event
          });
      });
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
              this.loadConfiguration(this.defaultSort);
            }
          });
      });
  }
  failureNotification(key: string) {
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
          .subscribe((event: OverlayNotificationEventRef) => {
            // Action based event
          });
      });
  }
  deleteEmpConfig(id: string) {
    this.empLoanConfigurationFacade.deleteEmpLoanConfig(id);
  }
  back() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.GLOBAL_MENU_KEY
      }
    });
  }
  paginate(pageEvent: PageEvent) {
    this.empLoanConfigPageEvent = pageEvent;
    this.loadConfiguration(this.defaultSort);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
