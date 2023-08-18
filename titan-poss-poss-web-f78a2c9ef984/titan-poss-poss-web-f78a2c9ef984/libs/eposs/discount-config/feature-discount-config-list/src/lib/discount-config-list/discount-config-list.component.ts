import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DiscountConfigFacade } from '@poss-web/eposs/discount-config/data-access-discount-config';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { FileuploadConfirmationPopupComponent } from '@poss-web/shared/components/ui-fileupload-confirmation-popup';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ConfigurationsMenuKeyEnum,
  CustomErrors,
  DiscountConfigList,
  DiscountLovTypesEnum,
  DropdownSearchOptionsEnum,
  FileGroupEnum,
  FileUploadPopupEnum,
  FileUploadTypeEnum,
  ListingActiveDeactiveStatus,
  NewFileUploadCount,
  NewFileUploadResponse,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PublishStatusListEnum,
  SelectDropDownOption,
  StatusListEnum
} from '@poss-web/shared/models';
import { POSS_WEB_AIRPAY_HOST_CONFIG_FILE_SIZE } from '@poss-web/shared/util-config';
import {
  getDiscountConfigRequestRouteUrl,
  getDiscountConfigDetailsViewRouteUrl,
  getDiscountConfigRquestRouteUrl,
  getDiscountsDashBoardRouteUrl,
  getFileStatusRouteUrl
} from '@poss-web/shared/util-site-routes';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
const csvExtn = 'csv';
const reqfileKey = 'reqFile';

@Component({
  selector: 'poss-web-discount-config-list',
  templateUrl: './discount-config-list.component.html',
  styleUrls: ['./discount-config-list.component.scss']
})
export class DiscountConfigListComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  private confirmSuccessNotificationTemplate: TemplateRef<any>;

  discountConfigList$: Observable<DiscountConfigList[]>;
  totalElements$: Observable<number>;
  error$: Observable<CustomErrors>;
  isLoading$: Observable<boolean>;
  filename: '';
  minPageSize: number;
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  @ViewChild('fileInput') fileInput;

  @ViewChild('fileInput1') fileInput1;
  searchPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  destroy$ = new Subject<null>();
  pageSizeOptions: number[];
  invalidSearch: boolean;
  isSearch: boolean;
  searchValue: string;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  filterForm = new FormGroup({
    searchBy: new FormControl('DiscountCode'),
    searchValue: new FormControl(),
    discountStatus: new FormControl('RUNNING'),
    publishStatus: new FormControl('NOT_PUBLISHED')
  });
  uploadResponse$: Observable<NewFileUploadResponse>;
  fileResponse: NewFileUploadCount;

  fileError: boolean;
  discountTypes: SelectDropDownOption[];
  statusList: SelectDropDownOption[] = [];
  publishStatusList: SelectDropDownOption[] = [];
  publishStatus: string;
  status: any;
  discountCode: string;
  discountType: string;
  noDataFoundMessage: any;
  discountId: any;
  occassionValue: string;
  dropdownSearchOptions = [];
  itemGroupLevelDiscLabel: string;
  statusList1: string;
  statusList2: string;
  statusList3: string;
  publishStatusList1: string;
  publishStatusList2: string;
  dropdownSearchOptions1: string;
  dropdownSearchOptions2: string;
  constructor(
    public router: Router,
    public discountConfigFacade: DiscountConfigFacade,
    private dialog: MatDialog,
    private appSettingFacade: AppsettingFacade,
    private fileFacade: FileFacade,
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    @Inject(POSS_WEB_AIRPAY_HOST_CONFIG_FILE_SIZE) public fileSize
  ) {
    this.translate
      .get(['pw.entity.discountsEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(
            [
              'pw.global.noDataFoundMessage',
              'pw.discountConfig.itemGroupLevelDiscLabel',
              'pw.discountConfig.statusList1',
              'pw.discountConfig.statusList2',
              'pw.discountConfig.statusList3',
              'pw.discountConfig.publishStatusList1',
              'pw.discountConfig.publishStatusList2',
              'pw.discountConfig.dropdownSearchOptions1',
              'pw.discountConfig.dropdownSearchOptions2'
            ],
            {
              entityName: entity['pw.entity.discountsEntity']
            }
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
            this.itemGroupLevelDiscLabel =
              translatedMsg['pw.discountConfig.itemGroupLevelDiscLabel'];
            this.statusList1 = translatedMsg['pw.discountConfig.statusList1'];
            this.statusList2 = translatedMsg['pw.discountConfig.statusList2'];
            this.statusList3 = translatedMsg['pw.discountConfig.statusList3'];
            this.publishStatusList1 =
              translatedMsg['pw.discountConfig.publishStatusList1'];
            this.publishStatusList2 =
              translatedMsg['pw.discountConfig.publishStatusList2'];
            this.dropdownSearchOptions1 =
              translatedMsg['pw.discountConfig.dropdownSearchOptions1'];
            this.dropdownSearchOptions2 =
              translatedMsg['pw.discountConfig.dropdownSearchOptions2'];
          });
      });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.filterForm.value.searchValue;
        const searchBy = this.filterForm.value.searchBy;
        if (searchValue && searchBy === 'Occasion') {
          this.occassionSearch(searchValue);
        } else if (searchValue && searchBy === 'DiscountCode') {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }

  occassionSearch(searchValue) {
    this.isSearch = true;
    this.initialPageEvent = this.searchPageEvent;
    this.searchValue = searchValue.toUpperCase();
    this.discountCode = '';
    this.occassionValue = this.searchValue.toUpperCase();
    this.discountConfigFacade.loadDiscountConfigList({
      pageIndex: this.initialPageEvent.pageIndex,
      pageSize: this.initialPageEvent.pageSize,
      occasion: this.occassionValue,
      status: this.filterForm.get('discountStatus').value,
      discountType: this.discountType,
      publishStatus: this.filterForm.get('publishStatus').value
    });
  }

  onSelectionChang($event) {
    const searchValue = this.filterForm.value.searchValue;
    const searchBy = this.filterForm.value.searchBy;
    if (searchValue && searchBy === 'Occasion') {
      this.occassionSearch(searchValue);
    } else if (searchValue && searchBy === 'DiscountCode') {
      this.search(searchValue);
    } else {
      this.clearSearch();
    }
  }
  search(searchValue: string) {
    this.isSearch = true;
    this.initialPageEvent = this.searchPageEvent;
    this.searchValue = searchValue.toUpperCase();
    console.log(this.searchValue, 'search val');
    this.discountCode = this.searchValue.toUpperCase();
    this.loadDiscountConfList();
  }
  clearSearch() {
    console.log('in clear ');

    this.invalidSearch = false;
    this.isSearch = false;
    this.filterForm.get('searchValue').reset();
    this.searchValue = '';
    this.discountCode = '';
    this.initialPageEvent = this.searchPageEvent;
    this.loadDiscountConfList();
  }
  selectChangeHandler(event: any) {
    this.filterForm.get('discountStatus').patchValue(event.value);
    this.loadDiscountConfList();
  }
  discountTypeChangeHandler(event: any) {
    this.discountType = event.value;
    this.loadDiscountConfList();
  }

  publishStatusChangeHandler(event) {
    this.filterForm.get('publishStatus').patchValue(event.value);
    this.loadDiscountConfList();
  }
  fileStatus() {
    this.router.navigate([getFileStatusRouteUrl()]);
  }
  publish(id) {
    this.discountConfigFacade.loadIsPublishedConfig(id);
  }

  toggleStatus = ListingActiveDeactiveStatus.NORMAL;
  onChangeToggle(event) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = event.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;

          this.discountConfigFacade.editDiscountDetails(event.id, {
            description: event.description,
            discountCode: event.discountCode,
            discountType: event.discountType,
            isActive: event.isActive,
            occasion: event.occasion
          });
        } else this.loadDiscountConfList();
      });
  }
  ngOnInit() {
    this.fileFacade.clearResponse();
    this.discountConfigFacade.resetDiscounts();

    this.fileFacade.clearResponse();
    this.isLoading$ = this.discountConfigFacade.getIsloading();
    this.discountConfigList$ = this.discountConfigFacade.getDiscountConfigList();
    this.totalElements$ = this.discountConfigFacade.getTotalDiscountConfigList();
    this.uploadResponse$ = this.fileFacade.getFileUploadResponse();
    this.discountConfigFacade.loadDiscountTypes(
      DiscountLovTypesEnum.DISCOUNT_TYPE
    );
    this.filterForm.get('discountStatus').setValue('RUNNING');
    this.discountConfigFacade
      .getIsPublished()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isPublished => {
        if (isPublished) {
          this.loadDiscountConfList();
          this.showSuccessMessageNotification(
            'pw.discountConfig.publishSuccessMsg'
          );
        } else this.overlayNotification.close();
      });
    this.discountConfigFacade
      .getDiscountConfigList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(details => {
        if (details) {
          console.log(details, 'list');
        }
      });

    this.dropdownSearchOptions = [
      {
        value: DropdownSearchOptionsEnum.DISCOUNT_CODE,
        description: this.dropdownSearchOptions1
      },
      {
        value: DropdownSearchOptionsEnum.OCCASION,
        description: this.dropdownSearchOptions2
      }
    ];
    this.statusList = [
      {
        description: this.statusList1,
        value: StatusListEnum.RUNNING
      },
      {
        description: this.statusList2,
        value: StatusListEnum.ACTIVE_AND_NOT_RUNNING
      },
      {
        description: this.statusList3,
        value: StatusListEnum.INACTIVE
      }
    ];

    this.publishStatusList = [
      {
        description: this.publishStatusList1,
        value: PublishStatusListEnum.PUBLISHED
      },
      {
        description: this.publishStatusList2,
        value: PublishStatusListEnum.NOT_PUBLISHED
      }
    ];

    this.discountConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isUpdated => {
        if (isUpdated) {
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotifications(
              'pw.discountConfig.discountEditSuccessMessage'
            );
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showNotifications('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showNotifications('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;

          this.loadDiscountConfList();
        }
      });

    this.discountConfigFacade
      .getDiscountTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(types => {
        if (types) {
          this.discountTypes = [];
          types.forEach(type => {
            this.discountTypes.push({
              value: type.code,
              description: type.value
            });
          });
        }
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

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
        this.searchPageEvent.pageSize = pageSize;

        this.loadDiscountConfList();
      });

    this.fileFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.uploadResponse$ = this.fileFacade.getFileUploadResponse();
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
                    label: this.itemGroupLevelDiscLabel
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
                      FileGroupEnum.CARD_DETAILS
                    );
                  }
                });
            } else if (fileResponse.uploadType === FileUploadTypeEnum.ASYNC) {
              this.showConfirmReceiveSuccessNotification();
            }
          }
        }
      });
    this.discountConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }
  showNotifications(key) {
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }
  selectedConfig(configId: string) {
    this.router.navigate([
      getDiscountConfigRequestRouteUrl('discount', configId)
    ]);
  }

  loadDiscountConfList() {
    console.log(this.initialPageEvent, 'this.initialPageEvent');

    this.discountConfigFacade.loadDiscountConfigList({
      pageIndex: this.initialPageEvent.pageIndex,
      pageSize: this.initialPageEvent.pageSize,
      discountCode: this.discountCode,
      status: this.filterForm.get('discountStatus').value,
      discountType: this.discountType,
      occasion: this.occassionValue,
      publishStatus: this.filterForm.get('publishStatus').value
    });
  }

  showSuccessMessageNotification(key: any) {
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
  loadPaginateData(pageEvent) {
    this.initialPageEvent = pageEvent;
    this.loadDiscountConfList();
  }

  back() {
    this.router.navigate([getDiscountsDashBoardRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.DISCOUNTS
      }
    });
  }

  requestTab() {
    this.router.navigate([getDiscountConfigRquestRouteUrl()]);
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
  uploadFile(event) {
    this.overlayNotification.close();
    const fileList: FileList = event.target.files;
    const formData: FormData = new FormData();
    if (fileList.length > 0) {
      const file: any = fileList[0];
      if (file.size > this.fileSize) {
        const errorKey = 'pw.fileUpload.maximumFileSizeErrorMessage3';
        this.failureNotification(errorKey);
      }
      const extn = file.name.split('.').pop();
      console.log(file.name, 'check file');

      if (extn !== csvExtn) {
        const errorKey = 'pw.fileUpload.CSVFileTypeErrorMessage';
        this.failureNotification(errorKey);
      }

      const type = file.name.substring(0, 3);

      formData.append(reqfileKey, file);
      if (extn === csvExtn && file.size < this.fileSize) {
        console.log(this.filename, 'check2');

        if (type) {
          formData.set(reqfileKey, file, file.name);
          this.fileFacade.loadFileUpload(
            formData,
            FileGroupEnum.BEST_DEAL_DISCOUNT
          );
          this.fileInput.nativeElement.value = '';
        }
      }
    }
  }

  uploadItemGroupDiscFile(event) {
    this.overlayNotification.close();
    const fileList: FileList = event.target.files;
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
            FileGroupEnum.ITEM_GROUP_DISC_CONFIG
          );
          this.fileInput1.nativeElement.value = '';
        }
      }
    }
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
              this.back();
            }
          });
      });
  }
  openViewPage(configId) {
    this.router.navigate([getDiscountConfigDetailsViewRouteUrl(configId)]);
  }
  errorHandler(error: CustomErrors) {
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
    this.loadDiscountConfList();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
