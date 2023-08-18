import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { takeUntil, take, map } from 'rxjs/operators';

import { LovMasterFacade } from '@poss-web/shared/list-of-values/data-access-lov';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ListingActiveDeactiveStatus,
  OverlayNotificationType,
  LovMasterType,
  LovMaster,
  CustomErrors,
  LovMasterEnum,
  OverlayNotificationServiceAbstraction,
  MasterMenuKeyEnum,
  LovMasterTypeMain
} from '@poss-web/shared/models';
import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { LovmasterDetailsComponent } from '@poss-web/shared/list-of-values/ui-lov-detail';
import { LovmasterViewComponent } from '@poss-web/shared/list-of-values/ui-lovmaster-view';

@Component({
  selector: 'poss-web-lovmaster-listing-container',
  templateUrl: './lovmaster-listing-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LovmasterListingContainerComponent implements OnInit {
  LOVType: string;
  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;

  lovMasterTypes$: Observable<LovMasterType[]>;
  lovMasterTypes: LovMasterType[];
  lovMasterListing$: Observable<LovMaster[]>;
  lovMasterListingSrch$: Observable<LovMaster[]>;
  lovMasterCount$: Observable<number>;

  lovMasterPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;
  lovMasterTypesMain$: Observable<LovMasterTypeMain[]>;
  lovMasterTypesMains: LovMasterTypeMain[];
  constructor(
    public dialog: MatDialog,
    public router: Router,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private lovMasterFacade: LovMasterFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit() {
    this.stateInit();
  }

  stateInit() {
    this.lovMasterFacade.resetLovMasterData();

    this.lovMasterFacade.loadLovMasterTypes();
    this.lovMasterTypes$ = this.lovMasterFacade.getLovMasterTypes();

    this.lovMasterListing$ = this.lovMasterListingSrch$ = this.lovMasterFacade.getLovMasterListing();
    this.isLoading$ = this.lovMasterFacade.getIsLoading();
    this.lovMasterCount$ = this.lovMasterFacade.getTotalLovMasterDetails();
    this.lovMasterFacade.loadLovMasterTypes
    this.lovMasterTypesMain$ = this.lovMasterFacade.getLovMasterTypesMain();
    this.lovMasterFacade.loadLovMasterTypesMain();
    this.lovMasterTypes$
      .pipe(takeUntil(this.destroy$))
      .subscribe((typs: LovMasterType[]) => (this.lovMasterTypes = typs));

      this.lovMasterTypesMain$
      .pipe(takeUntil(this.destroy$))
      .subscribe((typs: LovMasterTypeMain[]) => (this.lovMasterTypesMains = typs));

    this.lovMasterFacade
      .getLovDetailsSaveResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          if (this.LOVType) {
            this.lovMasterFacade.loadLovMasterListing(this.LOVType);
          }
          this.showNotification('pw.lovmaster.saveSuccessMsg');
        }
      });

    this.lovMasterFacade
      .getLovDetailsEditResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotification('pw.lovmaster.editSuccessMsg');
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

    this.lovMasterFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  lovSearch(key: string) {
    this.lovMasterListing$ = this.lovMasterListingSrch$.pipe(
      map((list: LovMaster[]) => {
        if (list) {
          return list.filter(ls =>
            ls.lovName.toLowerCase().includes(key.toLowerCase())
          );
        }
      })
    );
  }

  backArrow() {
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: { menu: MasterMenuKeyEnum.LOV_MENU_KEY }
    });
  }

  getLovTypeSelect($event: string) {
    this.LOVType = $event;
    this.lovMasterFacade.loadLovMasterListing(this.LOVType);
  }

  lovMasterItemView($event: LovMaster = null) {
    if (!$event) {
      $event = {
        lovName: '',
        lovType: '',
        description: '',
        isActive: true
      };
    }

    const dialogRef = this.dialog.open(LovmasterViewComponent, {
      width: '500px',
      height: 'auto',
      data: { lovMasterType: this.lovMasterTypes, data: $event },
      disableClose: true
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((formData: { mode: string; data: LovMaster }) => {
        if (formData) {
          this.alertPopupService
            .open({
              type: AlertPopupTypeEnum.CONFIRM,
              message: 'pw.alertPopup.saveConfirmation'
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: boolean) => {
              if (res) {
                if (formData.mode === LovMasterEnum.edit) {
                  this.lovMasterFacade.editLovFormDetails(formData.data);
                } else if (formData.mode === LovMasterEnum.new) {
                  this.lovMasterFacade.saveLovFormDetails(formData.data);
                }
              }
            });
        }
      });
  }
  lovMasterItemEdit($event: LovMaster = null) {
    if (!$event) {
      $event = {
        lovName: '',
        lovType: '',
        description: '',
        isActive: true
      };
    }

    const dialogRef = this.dialog.open(LovmasterDetailsComponent, {
      width: '500px',
      height: 'auto',
      data: { lovMasterType: this.lovMasterTypesMains, data: $event },
      disableClose: true
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((formData: { mode: string; data: LovMaster }) => {
        if (formData) {
          this.alertPopupService
            .open({
              type: AlertPopupTypeEnum.CONFIRM,
              message: 'pw.alertPopup.saveConfirmation'
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: boolean) => {
              if (res) {
                if (formData.mode === LovMasterEnum.edit) {
                  this.lovMasterFacade.editLovFormDetails(formData.data);
                } else if (formData.mode === LovMasterEnum.new) {
                  this.lovMasterFacade.saveLovFormDetails(formData.data);
                }
              }
            });
        }
      });
  }



  toggleChange($event) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = $event.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;
          this.lovMasterFacade.editLovFormDetails($event);
        } else this.lovMasterFacade.loadLovMasterListing(this.LOVType);
      });
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
            message: translatedMsg,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }

  errorHandler(error: CustomErrors) {
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
}
