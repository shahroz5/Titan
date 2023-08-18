import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { GlBoutiqueLocationFacade } from '@poss-web/eposs/gl-boutique-location/data-access-gl-boutique-location';
import {
  AlertPopupServiceAbstraction,
  CustomErrors,
  GlBoutiqueLocationList,
  AlertPopupTypeEnum,
  LocationMappingServiceAbstraction,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventType
} from '@poss-web/shared/models';
import { takeUntil, take } from 'rxjs/operators';
import {
  getGLBoutiqueLocatonConfigRouteUrl
} from '@poss-web/shared/util-site-routes';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { RequestApprovalsFacade } from '@poss-web/eposs/request-approvals/data-access-request-approvals';
@Component({
  selector: 'poss-web-gl-boutique-details-main',
  templateUrl: './gl-boutique-details-main.component.html'
})
export class GlBoutiqueDetailsMainComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();

  routeParam: Observable<Params>;
  isLoading$: Observable<boolean>;
  glBoutiqueLocations$: Observable<GlBoutiqueLocationList>;
  glBoutiqueLocations: GlBoutiqueLocationList;
  locationCode: any;
  addedlocations;

  locationForSelection: SelectionDailogOption[] = [];
  selectedLocation: SelectionDailogOption;
  showViewOnly: boolean;
  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private dialog: MatDialog,
    private glBoutiqueFacade: GlBoutiqueLocationFacade,
    private binRequestFacade: RequestApprovalsFacade,
    private locationMappingService: LocationMappingServiceAbstraction,
    private selectionDialog: SelectionDialogService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit() {
    this.overlayNotification.close();
    this.routeParam = this.activatedRoute.params;
    const param = this.activatedRoute.snapshot.params['_loc'];
    this.glBoutiqueFacade.loadGlBoutiqueLocationByLocationCode(param);
    this.activatedRoute.queryParams.subscribe(params => {
      this.showViewOnly = params?.showViewOnly ? true : false;
    });
    this.binRequestFacade.loadLocations();
    this.isLoading$ = this.glBoutiqueFacade.getIsLoading();
    this.glBoutiqueLocations$ = this.glBoutiqueFacade.getGlBoutiqueLocationByLocationCode();
    this.glBoutiqueLocations$
      .pipe(takeUntil(this.destroy$))
      .subscribe((details: GlBoutiqueLocationList) => {
        if (details) {
          this.glBoutiqueLocations = details;
        }
      });
    this.glBoutiqueFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.binRequestFacade
      .getLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((locations: any) => {
        if (locations) {
          this.locationForSelection = locations.map(location => ({
            id: location.locationCode,
            description: location.locationCode + ' - ' + location.description
          }));
        }
      });

    this.glBoutiqueFacade
      .getIsSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved) {
          console.log(saved, 'saved');

          this.showNotifications('pw.glBoutique.successMsg');
        }
      });
    this.glBoutiqueFacade
      .getIsEdited()
      .pipe(takeUntil(this.destroy$))
      .subscribe(edited => {
        if (edited) {
          console.log(edited, 'edited');
          this.showNotifications('pw.glBoutique.editSuccessMsg');
        }
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
  openLocationSelectionPopup() {
    this.dialog.closeAll();
    this.selectionDialog
      .open({
        title: 'Select Location',
        placeholder: 'Select Location',
        options: this.locationForSelection
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          this.selectedLocation = selectedOption;
          console.log(this.selectedLocation, 'after select');
        }
      });
  }

  addDetails(formDetails: GlBoutiqueLocationList) {
    if (
      !this.glBoutiqueLocations.isActive &&
      this.glBoutiqueLocations.glCode !== ''
    ) {
      this.showMessage('pw.global.masterDeactiveMsg');
    } else {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.alertPopup.saveConfirmation'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res) {
            if (this.activatedRoute.snapshot.params['_loc'] === 'new') {
              this.glBoutiqueFacade.saveGlBoutiqueLocationDetails(formDetails);
            } else {

              this.glBoutiqueFacade.editGlBoutiqueLocationDetails(formDetails);
            }
          }
        });
    }
  }
  showMessage(key: string) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasBackdrop: true,
            hasClose: true
          })
          .events.subscribe();
      });
  }

  showNotifications(key) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMessage,
            hasBackdrop: true
          })
          .events.subscribe((eventType: OverlayNotificationEventType) => {
            this.router.navigate([getGLBoutiqueLocatonConfigRouteUrl()]);
            this.overlayNotification.close();
          });
      });
  }
  backArrow() {
    this.router.navigate([getGLBoutiqueLocatonConfigRouteUrl()]);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.overlayNotification.close();
  }
}
