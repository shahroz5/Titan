import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewInit,
  TemplateRef
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import {
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  AlertPopupServiceAbstraction,
  OverlayNotificationEventType,
  DocumentListResponse,
  FileTypeEnum,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { FilePreviewComponent } from '@poss-web/shared/components/ui-file-upload';
import { FormGroup, FormControl } from '@angular/forms';
import { fromEvent, Observable, Subject } from 'rxjs';
import { takeUntil, take, debounceTime, startWith, map } from 'rxjs/operators';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ABRequestsFacade } from '@poss-web/eposs/shared/ab-requests/data-access-ab-requests';
import { FileDownloadPopupComponent } from '@poss-web/shared/file-upload/ui-file-download-popup';
import { FileDownloadService } from '@poss-web/shared/util-common';

@Component({
  selector: 'poss-web-ab-requests',
  templateUrl: './ab-requests.component.html'
})
export class AbRequestsComponent implements OnInit, OnDestroy, AfterViewInit {
  currentDate = moment();
  @Input() actionType;
  pageIndex = 0;
  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  filterForm: FormGroup;
  downloadFileDetails: DocumentListResponse;
  filesList: DocumentListResponse[];
  uploadedFilesLocationCode = '';
  year: any;
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  pageSize: number;
  pageSizeOptions: number[];
  minPageSize: any;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  @ViewChild('searchReq', { static: true })
  searchReq: ElementRef;
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  searchValue: any;
  count$: Observable<number>;
  productGrid$: Observable<any>;
  status: any;
  hasNotification: boolean;
  eventType: string;
  bulkDocNo = [];
  imageUrl: string;
  defaultImageUrl = 'assets/img/product-default-image.svg';

  bulkResponse = null;
  constructor(
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private appSettingFacade: AppsettingFacade,
    public fileFacade: FileFacade,
    private dialog: MatDialog,
    private fieldValidatorsService: FieldValidatorsService,
    private fileDownloadService: FileDownloadService,
    private facade: ABRequestsFacade,
    private alertPopUpService: AlertPopupServiceAbstraction
  ) {
    this.filterForm = new FormGroup({
      searchFormControl: new FormControl(
        '',
        this.fieldValidatorsService.numbersField('Req. Number')
      ),
      // docDate: new FormControl(),
      location: new FormControl(
        '',
        this.fieldValidatorsService.alphabetsField('Location')
      )
    });
  }

  ngOnInit(): void {
    this.overlayNotification.close();

    this.facade.reset();
    this.facade.loadLocations();

    this.fileFacade
      .getDocumentsLst()
      .pipe(takeUntil(this.destroy$))
      .subscribe(docs => {
        if (docs?.length > 0) {
          this.filesList = docs;
          this.openFileDownloadPopup();
        } else if (docs?.length == 0) {
          this.showAlertPopUp('No Attachments Available');
        }
      });

    this.fileFacade
      .getDocumentUrlById()
      .pipe(takeUntil(this.destroy$))
      .subscribe(docUrl => {
        if (docUrl) {
          if (docUrl) {
            this.imageUrl = docUrl;
            this.showPopup();
          }
        }
      });

    this.fileFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.filteredOptions = this.filterForm.controls[
      'location'
    ].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.componentInit();

    this.facade.loadABRequests({
      page: this.pageIndex,
      size: this.pageSize,
      approvalStatus: 'PENDING',
      body: {
        dateRangeType: 'ALL',
        filterParams: {}
      },
      workflowType: this.actionType
    });
  }

  showAlertPopUp(message: string) {
    this.alertPopUpService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
  ngAfterViewInit(): void {
    /**
     * Event Handler for search Box input with debounce
     */
    console.log('inside int');

    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.filterForm.controls['location'].value;
        // this.binToBinTransferFacade.resetLoadedHistory();
        if (searchValue !== '') {
          this.searchValue = searchValue;
          if (this.filterForm.controls['location'].valid) {
            console.log('call req');
            this.loadAbRequests(0);
          } else {
            console.log('dont call req');
          }
        } else this.clear();
      });
    fromEvent(this.searchReq.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.filterForm.controls['searchFormControl'].value;
        // this.binToBinTransferFacade.resetLoadedHistory();
        if (searchValue !== '') {
          // this.searchValue = searchValue;
          if (this.filterForm.controls['searchFormControl'].valid) {
            console.log(' call req');
            this.loadAbRequests(0);
          } else {
            console.log('dont call req');
          }
        } else this.clearSearch();
      });
  }

  locationSelected(event: any, option: string) {
    if (event.isUserInput) {
      this.filterForm.controls['location'].patchValue(option);
    }
    console.log(this.filterForm.controls['location'].value);
    this.loadAbRequests(0);
  }

  showPopup(): void {
    this.dialog.open(FilePreviewComponent, {
      height: '490px',
      width: '700px',
      autoFocus: false,
      data: {
        defaultImageUrl: this.defaultImageUrl,
        imageUrl: this.imageUrl,
        previewHeader: 'File upload'
      }
    });
  }

  getUploadedFiles(data) {
    this.uploadedFilesLocationCode = data.locationCode;
    this.fileFacade.loadDocumentsList({
      customerId: null,
      docType: 'AB',
      fileType: 'OTHERS',
      id: data.id,
      locationCode: data.locationCode
    });
  }

  loadAbRequests(pageIndex) {
    this.filterForm.markAllAsTouched();
    this.filterForm.updateValueAndValidity();
    let valid = {};
    let body;

    if (this.filterForm.valid) {
      if (this.filterForm.get('location').value) {
        valid = {
          ...valid,
          locationCode: this.filterForm.get('location').value.toUpperCase()
        };
      }
      if (this.filterForm.get('searchFormControl').value) {
        body = {
          docNo: Number(this.filterForm.get('searchFormControl').value),
          dateRangeType: 'ALL',
          // startDate: this.filterForm
          //   .get('docDate')
          //   .value.startOf('day')
          //   .valueOf(),
          // endDate: this.filterForm.get('docDate').value.endOf('day').valueOf(),
          filterParams: valid
        };
      } else {
        body = {
          dateRangeType: 'ALL',
          // startDate: this.filterForm
          //   .get('docDate')
          //   .value.startOf('day')
          //   .valueOf(),
          // endDate: this.filterForm.get('docDate').value.endOf('day').valueOf(),
          filterParams: valid
        };
      }

      this.facade.loadABRequests({
        page: pageIndex,
        size: this.pageSize,
        approvalStatus: 'PENDING',

        body: body,
        workflowType: this.actionType
      });
    }
  }
  onPaginate(event) {
    console.log('event', event);
    this.pageSize = event.size;
    this.loadAbRequests(event.page);
  }
  approveEvent(event) {
    console.log(event);
    this.eventType = event.type;
    if (event.type === 'bulk') {
      if (event.result[0].approved) {
        this.status = 'APPROVED';
      } else {
        this.status = 'REJECTED';
      }
      for (let i = 0; i < event.result.length; i++) {
        this.facade.approveABRequests({
          approved: event.result[i].approved,
          body: {
            approvedData: {
              data: {},
              type: this.actionType
            },
            approverRemarks: event.result[i].approverRemarks
          },
          processId: event.result[i].processId,
          taskId: event.result[i].taskId,
          taskName: event.result[i].taskName,
          docNo: event.result[i].reqNo
        });
        console.log(i);
        if (i === event.result.length - 1) this.bulkResponse = true;
      }

      // this.facade.loadBulkApprove({
      //   bulkApproverRequestObjectDto: event.result
      // });
    } else if (event.type === 'single') {
      this.facade.approveABRequests({
        approved: event.result.approved,
        body: {
          approvedData: {
            data: {},
            type: this.actionType
          },
          approverRemarks: event.result.approverRemarks
        },
        processId: event.result.processId,
        taskId: event.result.taskId,
        taskName: event.result.taskName,
        docNo: event.result.reqNo
      });
    }
  }
  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true, // optional
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  _filter(value: string): string[] {
    if (value) {
      const filterValue = value.toLowerCase();
      console.log(this.options);
      const opts = this.options;
      console.log(opts);
      return opts.filter(option => option.toLowerCase().includes(filterValue));
    } else return this.options;
  }
  componentInit() {
    // this.filteredOptions = this.filterForm.controls[
    //   'location'
    // ].valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value))
    // );
    this.facade
      .hasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.errorHandler(data);
        }
      });
    this.isLoading$ = this.facade.getisLoading();

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSize = data;
      });
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;

        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
        console.log(this.minPageSize);
      });
    this.facade
      .getLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(locations => {
        if (locations)
          locations.forEach(element => {
            this.options.push(element.locationCode);
          });
      });
    this.productGrid$ = this.facade.getABRequest();
    this.count$ = this.facade.getabCancelCount();
    this.facade
      .getABDetail()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data && this.eventType === 'single') {
          this.status = data.data.taskStatus;
          this.bulkDocNo.push(data.docNo);
          this.showConfirmIssueSuccessNotification();
        } else if (data && this.eventType === 'bulk') {
          this.bulkDocNo.push(data.docNo);
        }
        if (this.eventType === 'bulk' && this.bulkResponse === true) {
          this.showConfirmIssueSuccessNotification();
        }
      });
  }

  showConfirmIssueSuccessNotification(): void {
    const key = 'pw.stockIssueNotificationMessages.confirmSuccessMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe(() => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.CUSTOM,
            hasBackdrop: true,
            hasClose: true,
            template: this.confirmSuccessNotificationTemplate
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.facade.reset();
              this.status = null;
              this.eventType = null;
              this.bulkDocNo = [];
              this.bulkResponse = null;
              this.overlayNotification.close();
              this.loadAbRequests(0);
            }
          });
      });
  }

  filter() {
    this.filteredOptions = this.filterForm.controls['location'].value.pipe(
      startWith(''),
      map((value: string) => this._filter(value))
    );
  }
  clearSearch() {
    this.filterForm.get('searchFormControl').reset();
    this.loadAbRequests(0);
    // this.loadBasedOnType();
  }
  clear() {
    this.filterForm.get('location').reset();
    this.loadAbRequests(0);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.fileFacade.clearResponse();
  }

  openFileDownloadPopup() {
    const dialogRef = this.dialog.open(FileDownloadPopupComponent, {
      height: 'auto',
      width: '700px',
      autoFocus: false,
      data: {
        files: this.filesList
      }
    });
    dialogRef.componentInstance.downloadFile
      .pipe(takeUntil(this.destroy$))
      .subscribe(fileData => {
        this.downloadFileDetails = fileData;
        let extn = fileData.name.split('.').pop();
        extn = extn.toLowerCase();
        if (extn === FileTypeEnum.PDF)
          this.fileFacade.downloadPdfFile({
            ...fileData,
            locationCode: this.uploadedFilesLocationCode
          });
        else if (extn === FileTypeEnum.JPG || extn === FileTypeEnum.JPEG)
          this.fileFacade.loadDocumentUrlById(
            fileData.id,
            this.uploadedFilesLocationCode
          );
      });
  }
}
