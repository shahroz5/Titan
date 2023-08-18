import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CnApprovalFacade } from '@poss-web/eposs/cn-approvals/data-access-cn-approvals';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  ApprovalsMenuKeyEnum,
  CnApprovalListRequest,
  CnApprovalListResponse,
  cnApprovalsEnum,
  CustomErrors,
  grnRequestEnum,
  LocationSettingAttributesEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SaveCnApproval,
  SelectDropDownOption
} from '@poss-web/shared/models';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { getApprovalsHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { Observable, Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'poss-web-cn-approval-list',
  templateUrl: './cn-approval-list.component.html'
})
export class CnApprovalListComponent implements OnInit, OnDestroy {
  cnRequestList$: Observable<CnApprovalListResponse[]>;

  totalElements$: Observable<number>;
  destroy$ = new Subject();
  cnApprovalsEnum = cnApprovalsEnum;
  @ViewChild('cnSearchBox', { static: false })
  cnSearchBox: ElementRef;

  @ViewChild('locationCodeSearchBox', { static: false })
  locationCodeSearchBox: ElementRef;
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  isLoading$: Observable<boolean>;
  disableButton = true;

  isApproved: boolean;
  inValidSearch = false;

  searchValue: string;
  requestTypeArray: SelectDropDownOption[] = [];
  selectedRequestType = cnApprovalsEnum.CREDIT_NOTE_ACTIVATE;
  filterForm = new FormGroup({});
  fiscalYear: string;
  cnNumber: string;
  locationCode: string;
  currentFiscalYear: string;
  pageSizeOptions: any;
  constructor(
    private router: Router,
    private cnApprovalFacade: CnApprovalFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private locationSettingsFacade: LocationSettingsFacade,
    public appSettingFacade: AppsettingFacade
  ) {}

  ngOnInit(): void {
    this.cnApprovalFacade.loadReset();
    this.cnRequestList$ = this.cnApprovalFacade.getCnApprovalsList();
    this.isLoading$ = this.cnApprovalFacade.getIsloading();

    this.translate
      .get([
        'pw.cnRequestApproval.activation',
        'pw.cnRequestApproval.cancelation',
        'pw.cnRequestApproval.goldRateRemoval',
        'pw.cnRequestApproval.fiscalYear'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.fiscalYear = translatedMessages['pw.cnRequestApproval.fiscalYear'];
        this.requestTypeArray.push(
          {
            value: cnApprovalsEnum.CREDIT_NOTE_ACTIVATE,
            description: translatedMessages['pw.cnRequestApproval.activation']
          },

          {
            value: cnApprovalsEnum.CREDIT_NOTE_CANCELLATION,
            description: translatedMessages['pw.cnRequestApproval.cancelation']
          },
          {
            value: cnApprovalsEnum.CREDIT_NOTE_GOLD_RATE_REMOVE,
            description:
              translatedMessages['pw.cnRequestApproval.goldRateRemoval']
          }
        );
      });
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
      });
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.COUNTRY_FISCAL_YEAR)
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: string) => {
        this.currentFiscalYear = fiscalYear;
      });

    this.cnApprovalFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.loadList();
          this.errorHandler(error);
        }
      });
    this.cnApprovalFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated === true && this.isApproved) {
          if (
            this.filterForm.get('requestType').value ===
            cnApprovalsEnum.CREDIT_NOTE_ACTIVATE
          ) {
            this.showSuccessMessageNotification(
              'pw.cnRequestApproval.cnActivationApprovedMsg'
            );
          } else if (
            this.filterForm.get('requestType').value ===
            cnApprovalsEnum.CREDIT_NOTE_CANCELLATION
          ) {
            this.showSuccessMessageNotification(
              'pw.cnRequestApproval.cnCancelationApprovedMsg'
            );
          } else if (
            this.filterForm.get('requestType').value ===
            cnApprovalsEnum.CREDIT_NOTE_GOLD_RATE_REMOVE
          ) {
            this.showSuccessMessageNotification(
              'pw.cnRequestApproval.cnGoldRateRemovalApprovedMsg'
            );
          }
        } else if (hasUpdated === true && !this.isApproved) {
          if (
            this.filterForm.get('requestType').value ===
            cnApprovalsEnum.CREDIT_NOTE_ACTIVATE
          ) {
            this.showSuccessMessageNotification(
              'pw.cnRequestApproval.cnActivationRejectMsg'
            );
          } else if (
            this.filterForm.get('requestType').value ===
            cnApprovalsEnum.CREDIT_NOTE_CANCELLATION
          ) {
            this.showSuccessMessageNotification(
              'pw.cnRequestApproval.cnCancelationRejectMsg'
            );
          } else if (
            this.filterForm.get('requestType').value ===
            cnApprovalsEnum.CREDIT_NOTE_GOLD_RATE_REMOVE
          ) {
            this.showSuccessMessageNotification(
              'pw.cnRequestApproval.cnGoldRateRemovalRejectMsg'
            );
          }
        }
      });

    this.filterForm = new FormGroup({
      fiscalYear: new FormControl(''),
      cnNumber: new FormControl(null),
      locationCode: new FormControl(null),
      requestType: new FormControl(this.selectedRequestType)
    });

    this.loadList();
    this.filterForm.valueChanges
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.filterForm.get('requestType').value !== undefined) {
          this.loadList();
        }
      });
  }

  onDropDownValueChange(changeEvent) {
    this.filterForm.get('requestType').patchValue(changeEvent.value);
  }

  numberCheck($event: KeyboardEvent) {
    const pattern = fieldValidation.numbersField.pattern;
    return pattern.test($event.key);
  }
  save(saveGrnRequestApproval: SaveCnApproval) {
    this.isApproved =
      saveGrnRequestApproval.bulkApproverRequestObjectDto[0].approved;
    this.cnApprovalFacade.saveCnStatus(saveGrnRequestApproval);
  }
  showSuccessMessageNotification(key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            hasClose: true,
            message: translatedMsg,
            time: 2000,
            hasBackdrop: true
          })
          .events.subscribe();
      });
  }
  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true, // optional
        error: error
      })
      .events.pipe(take(1))
      .subscribe(() => {
        // Action based event
      });
  }

  paginate(event) {
    this.initialPageEvent = event;
    this.loadList();
  }

  loadList() {
    this.inValidSearch = false;
    const cnApprovalListRequest: CnApprovalListRequest = {
      approvalStatus: cnApprovalsEnum.PENDING,
      pageIndex: this.initialPageEvent.pageIndex,
      pageSize: this.initialPageEvent.pageSize,
      workflowType: this.filterForm.get('requestType').value,
      filterOptions: {
        dateRangeType: grnRequestEnum.ALL,
        fiscalYear:
          this.filterForm.get('fiscalYear').value !== null
            ? this.filterForm.get('fiscalYear').value
            : undefined,
        docNo: this.filterForm.get('cnNumber').value
          ? this.filterForm.get('cnNumber').value
          : undefined,
        filterParams: {
          locationCode: this.filterForm.get('locationCode').value
            ? this.filterForm.get('locationCode').value
            : undefined
        }
      }
    };
    if (this.filterForm.valid) {
      this.cnApprovalFacade.loadCnApprovalsList(cnApprovalListRequest);
    } else {
      this.inValidSearch = true;
    }
  }

  back() {
    this.router.navigate([getApprovalsHomeRouteUrl()], {
      queryParams: {
        menu: ApprovalsMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
      }
    });
    this.cnApprovalFacade.loadReset();
  }
  clearCnNumberSearch() {
    this.inValidSearch = false;
    this.initialPageEvent.pageIndex = 0;
    this.filterForm.get('cnNumber').clearValidators();
    this.filterForm.get('cnNumber').reset();
    this.loadList();
  }
  clearLocationSearch() {
    this.inValidSearch = false;
    this.initialPageEvent.pageIndex = 0;
    this.filterForm.get('locationCode').clearValidators();
    this.filterForm.get('locationCode').reset();
    this.loadList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
