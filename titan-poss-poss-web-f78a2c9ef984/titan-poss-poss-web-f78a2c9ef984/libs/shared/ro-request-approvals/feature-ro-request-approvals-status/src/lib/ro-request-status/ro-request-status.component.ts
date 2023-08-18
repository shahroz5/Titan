import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { RoRequestApprovalFacade } from '@poss-web/shared/ro-request-approvals/data-access-ro-request-approvals';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { PageEvent } from '@angular/material/paginator';

import {
  RoRequestApprovalListRequest,
  roRequestEnum,
  SalesMenuKeyEnum,
  BodEodStatusEnum
} from '@poss-web/shared/models';
import { Router } from '@angular/router';
import {
  getHomePageUrl,
  getSalesHomePageUrl
} from '@poss-web/shared/util-site-routes';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';

@Component({
  selector: 'poss-web-ro-request-status',
  templateUrl: './ro-request-status.component.html',
  styleUrls: ['./ro-request-status.component.scss']
})
export class RoRequestStatusComponent implements OnInit, OnDestroy {
  requestFilterForm: FormGroup;
  currentDate = moment();
  mobileNo: string;
  fiscalYear: string;
  radioOptions = 'PENDING';
  destroy$: Subject<null> = new Subject<null>();
  requestsListPoss$;
  totalElements$: Observable<number>;
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  currentFiscalYear: string;
  initialPageSize: number;
  pageSizeOptions: number[];
  isLoading$: Observable<boolean>;
  bodEodStatus: string;
  isGoldRateAvailable: boolean;
  isLoggedIn: boolean;

  constructor(
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private roRequestApprovalFacade: RoRequestApprovalFacade,
    private appSettingFacade: AppsettingFacade,
    private router: Router,
    private locationSettingsFacade: LocationSettingsFacade,
    private sharedBodEodFacade: SharedBodEodFacade,
    public authFacade: AuthFacade
  ) {}

  ngOnInit(): void {
    this.sharedBodEodFacade.loadLatestBusinessDay();

    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        console.log('RoRequestStatusComponent: isLoggedIn:', isLoggedIn);
        this.isLoggedIn = isLoggedIn;
      });

    this.sharedBodEodFacade
      .getBodEodStatus()
      .pipe(
        filter(BodEodStatus => !!BodEodStatus),
        takeUntil(this.destroy$)
      )
      .subscribe(bodEodStatus => {
        this.bodEodStatus = bodEodStatus;
      });

    this.sharedBodEodFacade
      .getGoldRateAvailablityStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(goldRateAvailable => {
        this.isGoldRateAvailable = goldRateAvailable;
      });

    this.translate
      .get(['pw.roRequestApproval.mobileNo', 'pw.roRequestApproval.fiscalYear'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.mobileNo = translatedMessages['pw.roRequestApproval.mobileNo'];
        this.fiscalYear = translatedMessages['pw.roRequestApproval.fiscalYear'];
      });
    this.createForm();
    this.isLoading$ = this.roRequestApprovalFacade.getIsloading();
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
        this.initialPageSize = pageSize;
        this.loadData(
          this.initialPageEvent.pageIndex,
          this.initialPageEvent.pageSize
        );
        this.requestsListPoss$ = this.roRequestApprovalFacade.getBoutiqueRequestList();

        this.totalElements$ = this.roRequestApprovalFacade.getTotalElements();
      });
    this.sharedBodEodFacade
      .getFiscalYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: number) => {
        this.currentFiscalYear = fiscalYear.toString();
      });

    this.requestFilterForm
      .get('startDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const endDate = this.requestFilterForm.get('endDate');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'EndDate')
        ]);
        endDate.updateValueAndValidity();
      });
  }
  loadData(pageIndex, pageSize) {
    const payload: RoRequestApprovalListRequest = {
      workflowType: roRequestEnum.workflowType,
      filterOptions: {
        dateRangeType:
          this.requestFilterForm.get('startDate').value === null &&
          this.requestFilterForm.get('endDate').value === null
            ? roRequestEnum.all
            : roRequestEnum.custom,
        startDate: this.requestFilterForm.get('startDate').value?.valueOf(),
        endDate: this.requestFilterForm.get('endDate').value?.valueOf(),
        fiscalYear: this.requestFilterForm.get('fiscalYear').value
      },
      approvalStatus: this.radioOptions,
      pageSize: pageSize,
      pageIndex: pageIndex
    };
    this.roRequestApprovalFacade.loadBoutiqueRequestList(payload);
  }
  radioChange(event) {
    this.initialPageEvent = {
      pageIndex: 0,
      pageSize: this.initialPageSize,
      length: 0
    };
    this.loadData(0, this.initialPageSize);
  }
  loadPaginateData(event: PageEvent) {
    this.initialPageEvent = event;
    this.loadData(
      this.initialPageEvent.pageIndex,
      this.initialPageEvent.pageSize
    );
  }
  createForm() {
    this.requestFilterForm = new FormGroup({
      mobileNo: new FormControl(
        '',
        this.fieldValidatorsService.mobileField(this.mobileNo)
      ),
      fiscalYear: new FormControl('', [
        // this.fieldValidatorsService.maxLength(4, this.fiscalYear),
        // this.fieldValidatorsService.minLength(4, this.fiscalYear),
        // this.fieldValidatorsService.numbersField(this.fiscalYear)
      ]),
      startDate: new FormControl(moment().startOf('days')),
      endDate: new FormControl(moment().startOf('days'))
    });
  }
  search() {
    this.loadData(
      this.initialPageEvent.pageIndex,
      this.initialPageEvent.pageSize
    );
  }

  back() {
    this.roRequestApprovalFacade.loadReset();

    const url = this.isGoldRateAvailable
      ? getSalesHomePageUrl()
      : getHomePageUrl();

    if (this.bodEodStatus === BodEodStatusEnum.OPEN) {
      this.router.navigate([url], {
        queryParams: {
          menu: SalesMenuKeyEnum.REQUEST_APPROVALS_STATUS
        }
      });
    } else {
      this.router.navigate([getHomePageUrl()]);
    }
  }

  clearDocRange() {
    this.requestFilterForm.get('startDate').reset();
    this.requestFilterForm.get('endDate').reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
