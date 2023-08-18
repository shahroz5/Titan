import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnChanges
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import {
  CustomErrors,
  BrandMaster,
  subBrandEnum,
  SubBrandMaster,
  OverlayNotificationServiceAbstraction,
  MasterMenuKeyEnum,
  SelectDropDownOption,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  OverlayNotificationType,
  OverlayNotificationEventType,
} from '@poss-web/shared/models';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { SubbrandFacade } from '@poss-web/shared/sub-brand/data-access-sub-brand';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { SubbrandDetailsComponent } from '@poss-web/shared/sub-brand/ui-sub-brand-detail';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { SubBrandDetailsViewComponent } from '@poss-web/shared/sub-brand/ui-sub-brand-view';

import { TranslateService } from '@ngx-translate/core';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Observable, Subject, fromEvent } from 'rxjs';
@Component({
  selector: 'poss-web-subbrand-list',
  templateUrl: './subbrand-list.component.html'
})
export class SubbrandListComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  parentBrandCode: string;
  SubbrandList$: Observable<BrandMaster[]>;
  hasError$: Observable<CustomErrors>;
  brandListLoading$: Observable<boolean>;
  destroy$ = new Subject<null>();
  searchErrorCode: string;
  pageSize: number[];
  totalElements$: Observable<number>;
  brandDetails: BrandMaster;
  parentBrands: BrandMaster[];
  selectOptions: SelectDropDownOption[] = [];
  isLoading$: Observable<boolean>;
  hidden: boolean;
  count: number;
  subbrandMasterListingPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  hasUpdated$: Observable<boolean>;
  hasSaved$: Observable<boolean>;
  invalidSearch: boolean;
  orgCode: string;
  viewOnly: boolean;
  toggleStatus: boolean;

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  noDataFoundMessage: string;
  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private subBrandMasterFacade: SubbrandFacade,
    private router: Router,
    private appsettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private profileDataFacade: ProfileDataFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.subBrandEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.subBrandEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.searchValue;

        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }

  search(searchValue: string) {
    if (fieldValidation.brandCodeField.pattern.test(searchValue)) {
      this.subBrandMasterFacade.searchSubBrand({
        brandCode: searchValue.toUpperCase(),
        parentBrandCode: this.parentBrandCode
      });
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.invalidSearch = false;
    this.searchForm.reset();
    this.loadSubBrandMasterList();
  }
  ngOnInit() {
    this.subBrandMasterFacade.loadReset();
    this.subBrandMasterFacade.loadParentMasterList();
    this.searchErrorCode = ErrorEnums.ERR_PRO_001;
    this.hasError$ = this.subBrandMasterFacade.getError();
    this.isLoading$ = this.subBrandMasterFacade.getIsloading();
    this.profileDataFacade
      .getOrgCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(orgCode => {
        this.orgCode = orgCode;
      });

    this.subBrandMasterFacade
      .getParentBrandList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(parentBrands => {
        if (parentBrands) {
          this.parentBrands = parentBrands;
          this.selectOptions = this.parentBrands.map(data => ({
            ...data,
            value: data.brandCode,
            description: data.brandCode
          }));
        }
      });

    this.subBrandMasterFacade
      .getTotalElements()
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.count = count;
        if (count) {
          this.hidden = true;
        } else {
          this.hidden = false;
        }
      });
    this.subBrandMasterFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasSaved => {
        if (hasSaved) {
          this.loadSubBrandMasterList();
          this.showSuccessMessageNotification('pw.subBrand.successMsg');
        } else this.overlayNotification.close();
      });
    this.subBrandMasterFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.clearSearch();
          this.showSuccessMessageNotification('pw.subBrand.updatedMsg');
        } else this.overlayNotification.close();
      });
    this.subBrandMasterFacade
      .getSubBrandDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          if (this.viewOnly) {
            const dialogRef = this.dialog.open(SubBrandDetailsViewComponent, {
              width: '500px',
              height: 'auto',
              data: {
                subBrandDetails: data,
                parentBrandDetails: this.parentBrands
              },
              disableClose: true
            });
          } else {
            const dialogRef = this.dialog.open(SubbrandDetailsComponent, {
              width: '500px',
              height: 'auto',
              data: {
                subBrandDetails: data,
                parentBrandDetails: this.parentBrands
              },
              disableClose: true
            });
            dialogRef
              .afterClosed()
              .pipe(takeUntil(this.destroy$))
              .subscribe(formData => {
                if (formData) {
                  this.alertPopupService
                    .open({
                      type: AlertPopupTypeEnum.CONFIRM,
                      message: 'pw.alertPopup.saveConfirmation'
                    })
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((res: boolean) => {
                      if (res) {
                        this.subBrandFormDetails(formData);
                      }
                    });
                }
              });
          }
        }
      });

    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSize = data;
      });

    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.subbrandMasterListingPageEvent = {
          ...this.subbrandMasterListingPageEvent,
          pageSize: data
        };
        this.SubbrandList$ = this.subBrandMasterFacade.getSubBrandMasterList();
        this.totalElements$ = this.subBrandMasterFacade.getTotalElements();
      });

    this.subBrandMasterFacade
      .getIsActiveToggle()
      .pipe(takeUntil(this.destroy$))
      .subscribe(d => {
        if (d) {
          if (this.toggleStatus) {
            this.showNotification('pw.global.listActivated');
          } else {
            this.showNotification('pw.global.listDeactivated');
          }
          this.subBrandMasterFacade.resetIsActiveToggle();
        }
      });

    this.subBrandMasterFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }
  dropDownSelection(event) {
    this.searchForm.reset();
    this.parentBrandCode = event.value;
    this.loadSubBrandMasterList();
  }

  showSuccessMessageNotification(key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,

            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }
  loadSubBrandMasterList() {
    this.subBrandMasterFacade.loadSubBrandMasterList({
      pageEvent: this.subbrandMasterListingPageEvent,
      parentBrandCode: this.parentBrandCode
    });
  }
  paginate(pageEvent: PageEvent) {
    this.subbrandMasterListingPageEvent = pageEvent;
    this.loadSubBrandMasterList();
  }

  addnewSubBrand(data: { subBrandCode: string; viewOnly: boolean }) {
    this.viewOnly = data.viewOnly;
    if (data.subBrandCode !== subBrandEnum.NEW) {
      this.subBrandMasterFacade.loadSubBrandDetailsByBrandCode(
        data.subBrandCode
      );
    } else {
      const newFormData: SubBrandMaster = {
        brandCode: subBrandEnum.NEW,
        description: '',
        configDetails: {}
      };
      const dialogRef = this.dialog.open(SubbrandDetailsComponent, {
        width: '500px',
        height: 'auto',
        data: {
          subBrandDetails: newFormData,
          parentBrandDetails: this.parentBrands
        },
        disableClose: true
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(data1 => {
          if (data1) {
            this.alertPopupService
              .open({
                type: AlertPopupTypeEnum.CONFIRM,
                message: 'pw.alertPopup.saveConfirmation'
              })
              .pipe(takeUntil(this.destroy$))
              .subscribe((res: boolean) => {
                if (res) {
                  this.subBrandFormDetails(data1);
                }
              });
          }
        });
    }
  }

  subBrandFormDetails(data: any) {
    if (data.mode === subBrandEnum.new) {
      this.subBrandMasterFacade.saveSubBrandMasterDetails({
        brandCode: data.brandCode,
        description: data.description,
        parentBrandCode: data.parentBrandCode,
        orgCode: this.orgCode,
        isActive: true
      });
    } else if (data.mode === subBrandEnum.edit) {
      this.subBrandMasterFacade.updateSubBrandMasterDetails({
        brandCode: data.brandCode,
        data: {
          description: data.description,
          parentBrandCode: data.parentBrandCode,
          orgCode: this.orgCode
        }
      });
    }
  }

  updateToggleValue(toggleValue) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = toggleValue.isActive;
          this.subBrandMasterFacade.updateSubBrandMasterDetails({
            brandCode: toggleValue.brandCode,
            data: {
              isActive: toggleValue.isActive,
              parentBrandCode: toggleValue.parentBrandCode,
              description: toggleValue.description
            }
          });
        } else {
          this.loadSubBrandMasterList();
        }
      });
  }

  errorHandler(error: CustomErrors) {
    if (error.code === this.searchErrorCode) {
      // We are not showing error for location not found from search.
      return;
    }

    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
  }

  back() {
    this.subBrandMasterFacade.loadReset();
    // this.router.navigate([getProductMasterDashboardRouteUrl()]);
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.PRODUCT_MASTERS_MENU_KEY
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showNotification(key: string) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true,
            hasBackdrop: true
          })
          .events.subscribe((eventType: OverlayNotificationEventType) => {
            this.overlayNotification.close();
          });
      });
  }

  ngOnChanges(event): void {
    const matSelect: MatSelect = event.source;
    matSelect.writeValue(null);
  }
}
