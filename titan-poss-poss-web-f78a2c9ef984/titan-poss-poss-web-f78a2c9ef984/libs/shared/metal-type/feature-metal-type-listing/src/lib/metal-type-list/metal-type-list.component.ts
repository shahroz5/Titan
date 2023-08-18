import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';

import { Router } from '@angular/router';

import { Observable, Subject, fromEvent } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  CustomErrors,
  MaterialType,
  materialTypeEnum,
  OverlayNotificationServiceAbstraction,
  MasterMenuKeyEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ListingActiveDeactiveStatus,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { MetalTypeFacade } from '@poss-web/shared/metal-type/data-access-metal-type';
import { MetalTypeDetailsComponent } from '@poss-web/shared/metal-type/ui-metal-type-detail';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { MetalTypeViewComponent } from '@poss-web/shared/metal-type/ui-metal-type-view';
@Component({
  selector: 'poss-web-metal-type-list',
  templateUrl: './metal-type-list.component.html'
})
export class MetalTypeListComponent
  implements OnInit, OnDestroy, AfterViewInit {
  searchErrorCode: string;
  hasError$: Observable<CustomErrors>;
  isLoading$: Observable<boolean>;
  invalidSearch: boolean;
  viewMode: boolean;

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  metalTypeList$: Observable<MaterialType[]>;
  totalElements$: Observable<number>;
  pageSizeOptions: number[];
  destroy$ = new Subject<null>();
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  count: number;
  orgCode: string;
  noDataFoundMessage: string;
  constructor(
    private dialog: MatDialog,
    private metalTypeFacade: MetalTypeFacade,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private router: Router,
    private profileDataFacade: ProfileDataFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.materialTypeEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.materialTypeEntity']
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

  ngOnInit() {
    this.metalTypeFacade.loadreset();
    this.searchErrorCode = ErrorEnums.ERR_PRO_006;
    //this.searchErrorCode = ErrorEnums.ERR_CORE_023;
    this.isLoading$ = this.metalTypeFacade.getIsloading();
    this.hasError$ = this.metalTypeFacade.getHasError();
    this.profileDataFacade
      .getOrgCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(orgCode => {
        this.orgCode = orgCode;
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
        this.loadMetalTypeList();
        this.metalTypeFacade.loadMaterialTypeLov();
        this.metalTypeList$ = this.metalTypeFacade.getMetalTypeList();
        this.totalElements$ = this.metalTypeFacade.getTotalElements();
      });

    this.metalTypeFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasSaved => {
        if (hasSaved === true) {
          this.loadMetalTypeList();
          this.showSuccessMessageNotification('pw.metalType.saveSuccessMsg');
        } else this.overlayNotification.close();
      });
    this.metalTypeFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated === true) {
          this.clearSearch();
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showSuccessMessageNotification(
              'pw.metalType.updateSuccessMsg'
            );
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showSuccessMessageNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showSuccessMessageNotification('pw.global.listDeactivated');
          }
        } else this.overlayNotification.close();
      });
    this.metalTypeFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.metalTypeFacade
      .getMetalType()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          if (this.viewMode) {
            const dialogRef = this.dialog.open(MetalTypeViewComponent, {
              width: '500px',
              height: 'auto',
              data: {
                materialType: data
              },
              disableClose: true
            });
          } else {
            const dialogRef = this.dialog.open(MetalTypeDetailsComponent, {
              width: '500px',
              height: 'auto',
              data: {
                materialType: data
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
                        this.metalTypeFormDetails(formData);
                      }
                    });
                }
              });
          }
        }
      });
  }

  loadMetalTypeList() {
    this.metalTypeFacade.loadMetalTypeList(this.initialPageEvent);
  }

  paginate(event) {
    this.initialPageEvent = event;
    this.loadMetalTypeList();
  }

  search(searchValue) {
    if (
      fieldValidation.materialCodeField.pattern.test(searchValue.toUpperCase())
    ) {
      this.metalTypeFacade.searchMetalTypeList(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }

  clearSearch() {
    this.searchForm.reset();
    this.invalidSearch = false;
    this.loadMetalTypeList();
  }

  toggleStatus = ListingActiveDeactiveStatus.NORMAL;
  updateIsActive(obj) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = obj.data.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;

          this.metalTypeFacade.updateMetalTypeDetails(obj);
        } else {
          this.loadMetalTypeList();
        }
      });
  }
  materialCodeView(materialCode: string) {
    this.viewMode = true;
    this.metalTypeFacade.loadMetalTypeDetails(materialCode);
  }

  addnew(materialCode: string) {
    this.viewMode = false;
    if (materialCode !== materialTypeEnum.NEW) {
      this.metalTypeFacade.loadMetalTypeDetails(materialCode);
    } else {
      const newFormData: MaterialType = {
        materialCode: materialTypeEnum.NEW,

        description: ''
      };
      const dialogRef = this.dialog.open(MetalTypeDetailsComponent, {
        width: '500px',
        height: 'auto',
        data: {
          materialType: newFormData
        },
        disableClose: true
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          if (data) {
            this.alertPopupService
              .open({
                type: AlertPopupTypeEnum.CONFIRM,
                message: 'pw.alertPopup.saveConfirmation'
              })
              .pipe(takeUntil(this.destroy$))
              .subscribe((res: boolean) => {
                if (res) {
                  this.metalTypeFormDetails(data);
                }
              });
          }
        });
    }
  }

  metalTypeFormDetails(data: any) {
    if (data.mode === materialTypeEnum.new) {
      this.metalTypeFacade.saveMetalType({
        materialTypeCode: data.materialCode,

        description: data.description,
        isActive: true,
        orgCode: this.orgCode
      });
    } else if (data.mode === materialTypeEnum.edit) {
      this.metalTypeFacade.updateMetalTypeDetails({
        materialTypeCode: data.materialCode,
        data: {
          description: data.description
        }
      });
    }
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
          .events.subscribe();
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
    // this.router.navigate([getProductAttributesDashboardUrl()]);
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.PRODUCT_ATTRIBUTES_MENU_KEY
      }
    });
    this.metalTypeFacade.loadreset();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
