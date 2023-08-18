import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { FormGroup, FormControl } from '@angular/forms';
import {
  MaterialType,
  Purity,
  purityEnum,
  CustomErrors,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction,
  MasterMenuKeyEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { PurityFacade } from '@poss-web/shared/purity/data-access-purity';
import { PurityDetailsComponent } from '@poss-web/shared/purity/ui-purity-detail';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { fieldValidation } from '@poss-web/shared/util-field-validators';

import { Observable, Subject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-purity-list',
  templateUrl: './purity-list.component.html'
})
export class PurityListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  invalidSearch: boolean;
  purityList$: Observable<Purity[]>;
  totalElements$: Observable<number>;
  isLoading$: Observable<boolean>;
  destroy$ = new Subject<null>();
  pageSizeOptions: number[];
  materialTypes: MaterialType[];
  searchErrorCode: string;
  purityInitialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  searchInitialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  hasError$: Observable<CustomErrors>;
  searchValue: string;
  isSearch: boolean;
  noDataFoundMessage: string;
  constructor(
    public purityFacade: PurityFacade,
    public appSettingFacade: AppsettingFacade,
    private dialog: MatDialog,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private router: Router,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.purityEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.purityEntity']
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

  search(searchValue) {
    this.isSearch = true;
    this.purityInitialPageEvent = this.searchInitialPageEvent;
    this.searchValue = searchValue.toUpperCase();

    if (fieldValidation.materialCodeField.pattern.test(searchValue)) {
      this.purityFacade.loadPurityList(
        this.purityInitialPageEvent,
        this.searchValue
      );
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.invalidSearch = false;
    this.isSearch = false;
    this.searchForm.reset();
    this.searchValue = '';
    this.purityInitialPageEvent = this.searchInitialPageEvent;
    this.loadPurityList();
  }

  ngOnInit() {
    this.purityFacade.loadReset();
    this.isLoading$ = this.purityFacade.getIsloading();
    this.hasError$ = this.purityFacade.getError();
    this.searchErrorCode = 'ERR-PRO-012';
    //this.searchErrorCode = ErrorEnums.ERR_CORE_023;
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.purityInitialPageEvent.pageSize = pageSize;
        this.searchInitialPageEvent.pageSize = pageSize;
        this.loadPurityList();
        this.purityFacade.loadMetalTypes();
        this.purityList$ = this.purityFacade.getPurityList();
        this.totalElements$ = this.purityFacade.getTotalElements();
        this.purityFacade.loadMetalTypes();
      });
    this.purityFacade
      .getMetalTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(materialTypes => {
        this.materialTypes = materialTypes;
      });

    this.purityFacade
      .getPurityByMaterialCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          const dialogRef = this.dialog.open(PurityDetailsComponent, {
            width: '500px',
            height: 'auto',

            data: {
              purity: data[0],
              materialTypes: this.materialTypes
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
                      this.purityFormDetails(formData);
                    }
                  });
              }
            });
        }
      });

    this.purityFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasSaved => {
        if (hasSaved === true) {
          this.loadPurityList();
          this.showSuccessMessageNotification('pw.purity.saveSuccessMsg');
        } else this.overlayNotification.close();
      });

    this.purityFacade
      .getIsActiveUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isActiveUpdated => {
        if (isActiveUpdated === true) {
          this.loadPurityList();
          this.showSuccessMessageNotification('pw.purity.updateSuccessMsg');
        } else this.overlayNotification.close();
      });

    this.purityFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated === true) {
          this.clearSearch();
          this.showSuccessMessageNotification('pw.purity.updateSuccessMsg');
        } else this.overlayNotification.close();
      });
    this.purityFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  loadPurityList() {
    this.purityFacade.loadPurityList(
      this.purityInitialPageEvent,
      this.searchValue
    );
  }

  addnew(obj: any) {
    if (obj !== purityEnum.NEW) {
      this.purityFacade.loadPurityByMaterialCodeAndPurity(obj);
    } else {
      const neFormData: Purity = {
        materialCode: purityEnum.NEW,
        purity: '',
        description: '',
        offset: '',
        karat: '',
        isActive: true
      };
      const dialogRef = this.dialog.open(PurityDetailsComponent, {
        width: '500px',
        height: 'auto',
        data: {
          purity: neFormData,
          materialTypes: this.materialTypes
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
                  this.purityFormDetails(data);
                }
              });
          }
        });
    }
  }

  updateToggle(event) {
    this.purityFacade.updatePurityDetails(event);
  }
  purityFormDetails(data) {
    if (data.mode === purityEnum.new) {
      this.purityFacade.savePurity({
        itemTypeCode: data.materialCode,
        description: data.description,
        offset: data.offset,
        purity: data.purity,
        karat: data.karat === '' ? null : data.karat,
        isActive: data.isActive,
        isDisplayed: data.isDisplayed
      });
    } else if (data.mode === purityEnum.edit) {
      this.purityFacade.updatePurityDetails({
        id: data.id,
        data: {
          itemTypeCode: data.materialCode,
          description: data.description,
          offset: Number(data.offset),
          purity: Number(data.purity),
          karat: data.karat === '0' ? null : data.karat,
          isActive: data.isActive,
          isDisplayed: data.isDisplayed
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
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  paginate(event) {
    this.purityInitialPageEvent = event;
    this.loadPurityList();
  }

  back() {
    this.purityFacade.loadReset();
    // this.router.navigate(['/master', 'product-attributes']);
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.PRODUCT_ATTRIBUTES_MENU_KEY
      }
    });
  }
}
