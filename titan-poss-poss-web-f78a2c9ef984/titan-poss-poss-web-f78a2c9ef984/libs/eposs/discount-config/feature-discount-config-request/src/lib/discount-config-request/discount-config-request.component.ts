import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { DiscountConfigFacade } from '@poss-web/eposs/discount-config/data-access-discount-config';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  ConfigurationsMenuKeyEnum,
  CustomErrors,
  DiscountRequestListPayload,
  LocationSettingAttributesEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SelectDropDownOption,
  StatusTypesEnum
} from '@poss-web/shared/models';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { PermissionService } from '@poss-web/shared/permission/ui-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import {
  getDiscountConfigRequestRouteUrl,
  getDiscountConfigRequestViewRouteUrl,
  getDiscountsDashBoardRouteUrl
} from '@poss-web/shared/util-site-routes';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-discount-config-request',
  templateUrl: './discount-config-request.component.html',
  styleUrls: ['./discount-config-request.component.scss']
})
export class DiscountConfigRequestComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  destroy$ = new Subject<null>();
  pageSizeOptions: number[];
  invalidSearch: boolean;
  isSearch: boolean;
  searchValue: string;
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0
  };

  tab = 0;
  requestList$: Observable<DiscountRequestListPayload[]>;
  requestListCount$: Observable<number>;
  isLoading$: Observable<boolean>;
  fiscalYearOptions: SelectDropDownOption[] = [
    { value: '2020', description: '2020' },
    { value: '2021', description: '2021' }
  ];
  currentFiscalYear: string;
  discountTypes: SelectDropDownOption[];
  permissions$: Observable<any[]>;

  dropDownvalues = [
    {
      value: 'NEW',
      description: 'NEW',
      isActive: true
    },
    {
      value: 'AMENDMENT',
      description: 'AMENDMENT',
      isActive: true
    }
  ];
  requestFilterForm = new FormGroup({
    types: new FormControl(),
    status: new FormControl('PENDING'),
    searchValue: new FormControl()
  });

  RECEIVED_REQUEST_TAB = 'Discount Workflow - Receieved Request Tab';
  SENT_REQUEST_TAB = 'Discount Workflow - Sent Request Tab';

  constructor(
    public router: Router,
    public discountConfigFacade: DiscountConfigFacade,
    private translate: TranslateService,
    public appSettingFacade: AppsettingFacade,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService,
    private permissionService: PermissionService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private locationSettingsFacade: LocationSettingsFacade
  ) {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
  }

  ngOnInit() {
    this.componentInit();
  }
  componentInit() {
    this.isLoading$ = this.discountConfigFacade.getIsloading();
    this.requestList$ = this.discountConfigFacade.getDiscountRequestList();
    this.requestListCount$ = this.discountConfigFacade.getDiscountRequestCount();
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;

        this.loadRequestList();
      });
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.COUNTRY_FISCAL_YEAR)
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: string) => {
        this.currentFiscalYear = fiscalYear;
      });

    this.discountConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.elementPermission
      .loadPermission(this.SENT_REQUEST_TAB, this.permissions$)
      .pipe(
        filter(data => !!data.transactionCodes),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        const hasRequestPermission = data.transactionCodes.find(key =>
          this.permissionService.hasPermission(key)
        );
        if (hasRequestPermission) {
          this.tab = 1;
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
  }
  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.requestFilterForm.value.searchValue;
        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }
  search(searchValue: string) {
    this.isSearch = true;
    this.initialPageEvent.pageIndex = 0;
    this.searchValue = searchValue.toUpperCase();

    this.loadRequestList();
  }
  clearSearch() {
    this.invalidSearch = false;
    this.isSearch = false;
    this.requestFilterForm.get('searchValue').reset();
    this.searchValue = null;
    this.initialPageEvent.pageIndex = 0;
    this.loadRequestList();
  }

  loadPaginateData(pageEvent) {
    this.initialPageEvent = pageEvent;
    this.loadRequestList();
  }

  changeSelection() {
    this.initialPageEvent.pageIndex = 0;
    this.loadRequestList();
  }

  loadRequestList() {
    this.discountConfigFacade.loadDiscountRequests({
      reqBody: {
        dateRangeType: 'ALL',
        filterParams: {
          typeOfRequest: this.requestFilterForm.get('types').value,

          discountCode: this.searchValue
        }
      },
      requestParams: {
        approvalStatus: this.requestFilterForm.get('status').value,
        page: this.initialPageEvent.pageIndex,
        size: this.initialPageEvent.pageSize,
        workflowType: 'DISCOUNT_CREATION'
      }
    });
  }

  selectedConfig(type: string, configId: string) {
    this.router.navigate([getDiscountConfigRequestRouteUrl(type, configId)]);
  }

  discountSelected(configId) {
    if (this.tab === 0) {
      this.selectedConfig('approval', configId);
    } else if (
      this.tab === 1 &&
      this.requestFilterForm.get('status').value === StatusTypesEnum.PENDING
    ) {
      this.router.navigate([
        getDiscountConfigRequestViewRouteUrl('request', configId)
      ]);
    } else if (
      this.tab === 1 &&
      this.requestFilterForm.get('status').value === StatusTypesEnum.REJECTED
    ) {
      this.selectedConfig('request', configId);
    } else if (
      this.tab === 1 &&
      this.requestFilterForm.get('status').value === StatusTypesEnum.APPROVED
    ) {
      this.selectedConfig('amendment', configId);
    }
  }
  changeTab(newTab) {
    this.tab = newTab;
  }

  back() {
    this.router.navigate([getDiscountsDashBoardRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.DISCOUNTS
      }
    });
  }
  errorHandler(error: CustomErrors) {
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
  }

  loadPermission = (element: string) => {
    return this.elementPermission.loadPermission(element, this.permissions$);
  };

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
