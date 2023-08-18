import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

import {
  CustomErrors,
  ComplexityCode,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  complexityCodeEnum,
  MasterMenuKeyEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ListingActiveDeactiveStatus
} from '@poss-web/shared/models';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { ComplexityCodeFacade } from '@poss-web/shared/complexity-code/data-access-complexity-code';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { ComplexityCodeDetailComponent } from '@poss-web/shared/complexity-code/ui-complexity-code-detail';
import { fieldValidation } from '@poss-web/shared/util-field-validators';

import { Observable, Subject, fromEvent } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ComplexityCodeViewComponent } from '@poss-web/shared/complexity-code/ui-complexity-code-view';

@Component({
  selector: 'poss-web-complexity-code',
  templateUrl: './complexity-code.component.html'
})
export class ComplexityCodeComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  searchErrorCode: string;
  pageSizeOptions: number[];
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  invalidSearch: boolean;
  complexityCodeList$: Observable<ComplexityCode[]>;
  totalElements$: Observable<number>;
  error$: Observable<CustomErrors>;
  isLoading$: Observable<boolean>;
  destroy$ = new Subject<null>();
  noDataFoundMessage: string;
  viewOnly: boolean;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;

  constructor(
    private dialog: MatDialog,
    private complexityCodeFacade: ComplexityCodeFacade,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private router: Router,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.complexityEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.complexityEntity']
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
    this.complexityCodeFacade.loadReset();
    this.searchErrorCode = ErrorEnums.ERR_PRO_003;
    this.isLoading$ = this.complexityCodeFacade.getIsloading();
    this.error$ = this.complexityCodeFacade.getError();

    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
        this.loadComplexityCodeList();
        this.complexityCodeList$ = this.complexityCodeFacade.getComplexityCodeList();
        this.totalElements$ = this.complexityCodeFacade.getTotalElements();
      });
    this.complexityCodeFacade
      .getComplexityCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(complexityCode => {
        if (complexityCode) {
          if (this.viewOnly) {
            const dialogRef = this.dialog.open(ComplexityCodeViewComponent, {
              width: '500px',
              height: 'auto',
              data: complexityCode,
              disableClose: true
            });
            dialogRef
              .afterClosed()
              .pipe(takeUntil(this.destroy$))
              .subscribe();
          } else {
            const dialogRef = this.dialog.open(ComplexityCodeDetailComponent, {
              width: '500px',
              height: 'auto',
              data: complexityCode,
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
                        this.complexityCodeFormDetails(formData);
                      }
                    });
                }
              });
          }
        }
      });

    this.complexityCodeFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasSaved => {
        if (hasSaved === true) {
          this.loadComplexityCodeList();

          this.showSuccessMessageNotification(
            'pw.complexityCode.saveSuccessMsg'
          );
        } else this.overlayNotification.close();
      });
    this.complexityCodeFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated === true) {
          this.clearSearch();
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showSuccessMessageNotification(
              'pw.complexityCode.updateSuccessMsg'
            );
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showSuccessMessageNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showSuccessMessageNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;
        } else this.overlayNotification.close();
      });
    this.complexityCodeFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  search(searchValue) {
    if (fieldValidation.complexityCodeField.pattern.test(searchValue)) {
      this.complexityCodeFacade.searchComplexityCode(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.invalidSearch = false;
    this.searchForm.reset();
    this.loadComplexityCodeList();
  }
  loadComplexityCodeList() {
    this.complexityCodeFacade.loadComplexityCodeList(this.initialPageEvent);
  }
  loadPaginateData(event: PageEvent) {
    this.initialPageEvent = event;
    this.loadComplexityCodeList();
  }

  updateIsActive(obj) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = obj.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;
          this.complexityCodeFacade.updateComplexityCode(obj);
        } else {
          this.loadComplexityCodeList();
        }
      });
  }

  addNew(complexityCode: string) {
    this.viewOnly = false;
    if (complexityCode !== complexityCodeEnum.NEW) {
      this.complexityCodeFacade.loadComplexityByCode(complexityCode);
    } else {
      const neFormData: ComplexityCode = {
        complexityCode: complexityCodeEnum.NEW,
        description: ''
      };
      const dialogRef = this.dialog.open(ComplexityCodeDetailComponent, {
        width: '500px',
        height: 'auto',
        data: neFormData,
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
                  this.complexityCodeFormDetails(data);
                }
              });
          }
        });
    }
  }

  complexityCodeFormDetails(data: any) {
    if (data.mode === complexityCodeEnum.new) {
      this.complexityCodeFacade.saveComplexityCode({
        complexityCode: data.complexityCode,
        description: data.description,
        isActive: true
      });
    } else if (data.mode === complexityCodeEnum.edit) {
      this.complexityCodeFacade.updateComplexityCode({
        complexityCode: data.complexityCode,
        description: data.description
      });
    }
  }
  openViewPage(complexityCode) {
    this.viewOnly = true;
    this.complexityCodeFacade.loadComplexityByCode(complexityCode);
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

    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.PRODUCT_ATTRIBUTES_MENU_KEY
      }
    });
    this.complexityCodeFacade.loadReset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
