import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { CatchmentFacade } from '@poss-web/shared/catchment-master/data-access-catchment-master';
import {
  CatchmentDetails,
  CatchmentEnum,
  CustomErrors,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction,
  MasterMenuKeyEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { fromEvent, Observable, Subject } from 'rxjs';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { CatchmentDetailsComponent } from '@poss-web/shared/catchment-master/ui-catchment-master-detail';
import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';

@Component({
  selector: 'poss-web-catchment-listing',
  templateUrl: './catchment-listing.component.html'
})
export class CatchmentListingComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Output() formEmit = new EventEmitter<any>();
  pageSize: any;
  destroy$ = new Subject<null>();

  pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0
  };

  isLoading$: Observable<boolean>;
  catchmentListing$: Observable<CatchmentDetails[]>;
  catchmentCount$: Observable<number>;

  hasError$: Observable<CustomErrors>;

  searchErrorCode: string;
  invalidSearch = false;

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private translate: TranslateService,
    private appsettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private catchmentFacade: CatchmentFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.catchmentCode'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.catchmentCode']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessageNonVerifiedItems =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  noDataFoundMessageNonVerifiedItems: string;

  ngOnInit() {
    this.hasError$ = this.catchmentFacade.getError();
    this.searchErrorCode = ErrorEnums.ERR_STORE_001;
    this.catchmentFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = JSON.parse(data.toString());
        this.pageEvent.pageSize = pageSize;
        this.loadCatchmentList();
      });

    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSize = data;
      });

    this.isLoading$ = this.catchmentFacade.getisLoading();

    this.catchmentListing$ = this.catchmentFacade.getCatchmentListing();

    this.catchmentCount$ = this.catchmentFacade.getTotalcatchmentDetails();

    this.catchmentFacade
      .getCatchmentDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          const dialogRef = this.dialog.open(CatchmentDetailsComponent, {
            width: '500px',
            height: 'auto',
            data: data
          });

          dialogRef.afterClosed().subscribe(formData => {
            if (formData) {
              this.alertPopupService
                .open({
                  type: AlertPopupTypeEnum.CONFIRM,
                  message: 'pw.alertPopup.saveConfirmation'
                })
                .pipe(takeUntil(this.destroy$))
                .subscribe((res: boolean) => {
                  if (res) {
                    this.createCatchmentFormDetails(formData);
                  }
                });
            }
          });
        }
      });

    this.catchmentFacade
      .getCatchmentSaveResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data1 => {
        if (data1) {
          this.loadCatchmentList();
          this.showNotification('pw.catchment.successMsg');
        }
      });

    this.catchmentFacade
      .getCatchmentEditResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data2 => {
        if (data2) {
          this.loadCatchmentList();
          this.showNotification('pw.catchment.editSuccessMsg');
        }
      });
  }

  createCatchmentFormDetails(data: CatchmentDetails) {
    this.searchForm.reset();
    if (data.mode === CatchmentEnum.new) {
      this.catchmentFacade.saveCatchmentFormDetails({
        catchmentCode: data.catchmentCode,
        description: data.description,
        isActive: data.isActive
      });
    } else if (data.mode === CatchmentEnum.edit) {
      this.catchmentFacade.editCatchmentFormDetails({
        catchmentCode: data.catchmentCode,
        description: data.description,
        isActive: data.isActive
      });
    }
  }

  ngAfterViewInit() {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }

  search(searchValue: string) {
    if (fieldValidation.alphaNumericField.pattern.test(searchValue)) {
      this.catchmentFacade.searchCatchment(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.searchForm.reset();
    this.invalidSearch = false;
    this.loadCatchmentList();
  }

  loadCatchmentList() {
    this.catchmentFacade.loadCatchmentListing(this.pageEvent);
  }

  paginate(pageEvent: PageEvent) {
    this.pageEvent = pageEvent;
    this.loadCatchmentList();
  }

  showNotification(key: string) {
    this.overlayNotification.close();

    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,
            time: 2000,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }

  errorHandler(error: CustomErrors) {
    if (error.code === this.searchErrorCode) {
      return;
    }
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

  backArrow() {
    // this.router.navigate([getMasterHomeRouteUrl()]);
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.BOUTIQUE_MENU_KEY
      }
    });
  }

  getCatchmentCode(catchmentCode: string) {
    this.catchmentFacade.loadCatchmentDetails(catchmentCode);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateIsActive(event) {
    this.clearSearch();
    this.catchmentFacade.editCatchmentFormDetails({
      catchmentCode: event.catchmentCode,
      description: null,
      isActive: event.isActive
    });
  }
}
