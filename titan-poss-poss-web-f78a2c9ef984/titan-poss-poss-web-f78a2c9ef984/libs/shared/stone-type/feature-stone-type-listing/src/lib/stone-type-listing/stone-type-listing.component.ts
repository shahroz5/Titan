import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, Observable, fromEvent } from 'rxjs';
import { takeUntil, debounceTime, take } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  CustomErrors,
  SaveStoneTypeFormDetailsPayload,
  OverlayNotificationServiceAbstraction,
  MasterMenuKeyEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  ListingActiveDeactiveStatus,
  OverlayNotificationType,
  StoneTypeEnum, StoneTypeDetails
} from '@poss-web/shared/models';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { StoneTypeFacade } from '@poss-web/shared/stone-type/data-access-stone-type';
import { StoneTypeDetailsComponent } from '@poss-web/shared/stone-type/ui-stone-type-detail';
import { StoneTypeViewComponent } from '@poss-web/shared/stone-type/ui-stone-type-view';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
@Component({
  selector: 'poss-web-stone-type-listing',
  templateUrl: './stone-type-listing.component.html'
})
export class StoneTypeListingComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Output() formEmit = new EventEmitter<any>();

  destroy$ = new Subject<null>();

  stoneTypePageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  pageSizeOptions: number[] = [];
  minPageSize: number;

  isLoading$: Observable<boolean>;
  stoneTypeListing$: Observable<StoneTypeDetails[]>;
  stoneTypeCount$: Observable<number>;
  hasError$: Observable<CustomErrors>;
  searchErrorCode: string;
  stoneTypeDetailsByCode: StoneTypeDetails;
  invalidSearch = false;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  isToggleChanged: boolean;
  noDataFoundMessage: any;
  viewMode: boolean;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private translate: TranslateService,
    private appsettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private stoneTypeFacade: StoneTypeFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.stoneTypesEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.stoneTypesEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit() {
    this.isLoading$ = this.stoneTypeFacade.getisLoading();
    this.stoneTypeListing$ = this.stoneTypeFacade.getstoneTypeDetailsListing();
    this.stoneTypeCount$ = this.stoneTypeFacade.getTotalstoneTypeDetails();
    this.stoneTypeFacade.resetstoneTypeDialogData();
    this.hasError$ = this.stoneTypeFacade.getError();
    this.searchErrorCode = ErrorEnums.ERR_PRO_009;
    this.stoneTypeFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
          // console.log(error.code);
        }
      });

    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.stoneTypePageEvent.pageSize = pageSize;
        this.loadStoneTypeDetails();
      });

    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });

    this.stoneTypeFacade
      .getstoneTypeSaveResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.loadStoneTypeDetails();
          this.showNotification('pw.stoneType.successMsg');
        }
      });

    this.stoneTypeFacade
      .getstoneTypeEditResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.clearSearch();
          this.loadStoneTypeDetails();

          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotification('pw.stoneType.editSuccessMsg');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;
        }
      });

    this.stoneTypeFacade
      .getstoneTypeDetailsBystoneTypeCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.stoneTypeDetailsByCode = data;
          if (this.viewMode) {
            const dialogRef = this.dialog.open(StoneTypeViewComponent, {
              width: '500px',
              height: 'auto',
              data: {
                newFormData: this.stoneTypeDetailsByCode
              },
              disableClose: true
            });
          } else {
            const dialogRef = this.dialog.open(StoneTypeDetailsComponent, {
              width: '500px',
              height: 'auto',
              data: {
                newFormData: this.stoneTypeDetailsByCode
              },
              disableClose: true
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
                      this.createStoneTypeFormDetails(formData);
                    }
                  });
              }
            });
          }
        }
      });
  }

  loadStoneTypeDetails() {
    this.stoneTypeFacade.loadStoneTypeDetailsListing(this.stoneTypePageEvent);
  }

  stoneTypeCodeView(stoneTypeCode: string) {
    this.viewMode = true;
    this.stoneTypeFacade.loadStoneTypeDetailsBystoneTypeCode(stoneTypeCode);
  }
  getStoneTypeCode(stoneTypeCode: string) {
    this.viewMode = false;
    if (stoneTypeCode !== StoneTypeEnum.NEW) {
      this.stoneTypeFacade.loadStoneTypeDetailsBystoneTypeCode(stoneTypeCode);
    } else {
      const newFormData: StoneTypeDetails = {
        stoneTypeCode: StoneTypeEnum.NEW,
        description: '',
        configDetails: {
          karatageWeightPrint: ''
        },
        isActive: true
      };
      const dialogRef = this.dialog.open(StoneTypeDetailsComponent, {
        width: '500px',
        height: 'auto',
        data: {
          newFormData: newFormData
        },
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.alertPopupService
            .open({
              type: AlertPopupTypeEnum.CONFIRM,
              message: 'pw.alertPopup.saveConfirmation'
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: boolean) => {
              if (res) {
                this.createStoneTypeFormDetails(data);
              }
            });
        }
      });
    }
  }

  createStoneTypeFormDetails(data: any) {
    this.searchForm.reset();
    if (data.mode === StoneTypeEnum.new) {
      this.stoneTypeFacade.savestoneTypeFormDetails({
        stoneTypeCode: data.stoneTypeCode,
        description: data.description,
        configDetails: {
          karatageWeightPrint: data.configDetails.karatageWeightPrint
        },
        isActive: data.isActive
      });
    } else if (data.mode === StoneTypeEnum.edit) {
      this.stoneTypeFacade.editstoneTypeFormDetails({
        stoneTypeCode: data.stoneTypeCode,
        description: data.description,
        configDetails: {
          karatageWeightPrint: data.configDetails.karatageWeightPrint
        },
        isActive: data.isActive
      });
    }
  }

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
          this.isToggleChanged = true;
          const toggleUpdate: SaveStoneTypeFormDetailsPayload = {
            stoneTypeCode: event.stoneTypeListItem.stoneTypeCode,
            configDetails: {
              karatageWeightPrint:
                event.stoneTypeListItem.configDetails.karatageWeightPrint
            },
            description: event.stoneTypeListItem.description,
            isActive: event.isActive
          };

          this.stoneTypeFacade.editstoneTypeFormDetails(toggleUpdate);
        } else this.loadStoneTypeDetails();
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
    if (
      fieldValidation.stoneTypeCodeField.pattern.test(searchValue.toUpperCase())
    ) {
      this.invalidSearch = false;
      this.stoneTypeFacade.searchStoneType(searchValue.toUpperCase());
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.searchForm.reset();
    this.invalidSearch = false;
    this.loadStoneTypeDetails();
  }
  omit_special_char($event: KeyboardEvent) {
    const pattern = /^[-_A-Za-z0-9]$/;
    return pattern.test($event.key);
  }
  paginate(pageEvent: PageEvent) {
    this.stoneTypePageEvent = pageEvent;
    this.loadStoneTypeDetails();
  }

  showNotification(key: string) {
    this.overlayNotification.close();

    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            hasClose: true,
            message: translatedMsg,
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
    // this.router.navigate(['master', 'product-attributes']);
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.PRODUCT_ATTRIBUTES_MENU_KEY
      }
    });
    this.stoneTypeFacade.resetstoneTypeDialogData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
