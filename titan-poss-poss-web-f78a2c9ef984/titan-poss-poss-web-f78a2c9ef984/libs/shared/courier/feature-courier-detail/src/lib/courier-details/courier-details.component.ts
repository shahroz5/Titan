import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  OverlayNotificationType,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction
} from '@poss-web/shared/models';
import { takeUntil, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Observable } from 'rxjs';
import {
  CourierMaster,
  CustomErrors,
  LocationMappingServiceResponse,
  LocationMappingServiceAbstraction,
  OverlayNotificationServiceAbstraction,
  StatesSuccessPayload,
  CountrySuccessPayload,
  CourierSelectedLocations
} from '@poss-web/shared/models';
import { getCourierDetailsListRouteUrl } from '@poss-web/shared/util-site-routes';
import { CourierDetailsFacade } from '@poss-web/shared/courier/data-access-courier';
import { FormGroup } from '@angular/forms';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
export enum courierDetailsEnum {
  NEW = 'new'
}
@Component({
  selector: 'poss-web-courier-details',
  templateUrl: './courier-details.component.html',
  styleUrls: ['./courier-details.component.scss']
})
export class CourierDetailsComponent implements OnInit, OnDestroy {
  courierName = '';
  destroy$ = new Subject<null>();
  hasSaved: boolean;
  courierDetails$: Observable<CourierMaster>;
  states$: Observable<StatesSuccessPayload[]>;
  isNew: boolean;
  page: string;
  locationMappingContentTemplateRef: any;
  selectedLocations: CourierSelectedLocations[] = [];
  newlySelectedLocations = [];
  isLocationMapping: boolean;
  removedLocations = [];
  show = false;
  country$: Observable<CountrySuccessPayload[]>;
  isLoading$: Observable<boolean>;
  locationDetails$: Observable<any>;
  stateName: string;
  countryCode: string;
  allstates: StatesSuccessPayload[] = [];
  showViewOnly: boolean;
  ADD_EDIT_COURIER_PERMISSIONS = 'Courier Master - Add/Edit Courier Master';
  permissions$: Observable<any[]>;
  courierDetails: CourierMaster;

  constructor(
    private courierDetailsFacade: CourierDetailsFacade,
    private route: ActivatedRoute,
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private locationMappingService: LocationMappingServiceAbstraction,
    private selectionDialog: SelectionDialogService,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.routerPage();
    this.courierDetailsFacade.resetCourierDetails();
    this.courierDetailsFacade.loadCountries();
    this.route.queryParams.subscribe(params => {
      this.courierName = params.courierName;
      this.showViewOnly = params?.showViewOnly ? true : false;
    });
    this.country$ = this.courierDetailsFacade.getCountry();
    this.isLoading$ = this.courierDetailsFacade.getIsLoading();
    this.courierDetailsFacade.loadCourierDetailsBasedOnCourierName(
      decodeURI(this.courierName)
    );
    if (this.courierName !== courierDetailsEnum.NEW) {
      this.courierDetailsFacade.loadSelectedLocations(this.courierName);
      this.show = true;
    }
    this.courierDetailsFacade
      .getHasLocationsUpdated()
      .subscribe(isLocationMapping => {
        if (isLocationMapping === true) {
          this.showNotifications(
            'pw.courierDetails.locationMappingSuccessMessage'
          );
          this.courierDetailsFacade.loadSelectedLocations(this.courierName);
        }
      });
    this.courierDetailsFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.showNotifications('pw.courierDetails.updatedSuccessMessage');
        }
      });
    this.courierDetailsFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasSaved => {
        if (hasSaved) {
          this.saveNotifications('pw.courierDetails.savedSuccessMessage');
        }
      });
    this.courierDetailsFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.courierDetailsFacade
      .getSelectedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedLocations => {
        this.selectedLocations = selectedLocations;
      });
    this.courierDetails$ = this.courierDetailsFacade.getCourierDetailsBasedOnCourierName();
    this.states$ = this.courierDetailsFacade.getStates();
  }

  back() {
    this.courierDetailsFacade.resetCourierDetails();
    this.router.navigate([getCourierDetailsListRouteUrl()]);
    this.overlayNotification.close();
  }

  routerPage() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.page = params.get('page');
    });
  }
  saveCourierDetails(courierDetails) {
    if (!courierDetails.isActive) {
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
            const stateName = this.allstates.filter(
              (states: StatesSuccessPayload) =>
                states.id === courierDetails.stateName
            );
            if (
              this.courierName !== courierDetailsEnum.NEW &&
              this.courierName !== ''
            ) {
              this.courierDetailsFacade.updateCourierDetails({
                courierName: this.courierName,
                data: {
                  address: courierDetails.address,
                  contactPerson: courierDetails.contactPerson,
                  mailId: courierDetails.mailId,
                  mobileNumber: courierDetails.mobileNumber,
                  description: courierDetails.description,
                  stateName: stateName[0].description,
                  townName: courierDetails.townName,
                  countryCode: courierDetails.countryCode,
                  isActive: courierDetails.isActive
                }
              });
            } else {
              this.courierDetailsFacade.saveCourierDetails({
                address: courierDetails.address,
                contactPerson: courierDetails.contactPerson,
                courierName: courierDetails.courierName,
                mailId: courierDetails.mailId,
                mobileNumber: courierDetails.mobileNumber,
                description: courierDetails.description,
                stateName: stateName[0].description,
                townName: courierDetails.townName,
                countryCode: courierDetails.countryCode,
                isActive: courierDetails.isActive
              });
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
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasBackdrop: true,
            hasClose: true
          })
          .events.subscribe();
      });
  }
  saveNotifications(key) {
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
  formGroupCreated2(formGroup: FormGroup) {
    this.courierDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe((courierDetails: CourierMaster) => {
        if (courierDetails) {
          this.courierDetails = courierDetails;
          this.countryCode = courierDetails.countryCode;
          this.courierName = courierDetails.courierName;
          this.stateName = courierDetails.stateName;
          if (this.courierName !== '') {
            formGroup.get('1-courierName').disable();
          }
        }
      });
    formGroup
      .get('1-country')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(countryId => {
        if (countryId) {
          formGroup.get('1-state')['options'] = [];
          this.courierDetailsFacade.loadStates(countryId);
        }
      });
    this.courierDetailsFacade
      .getCountry()
      .pipe(takeUntil(this.destroy$))
      .subscribe(country => {
        const countryArr: { value: string; description: string }[] = [];
        if (country) {
          country.forEach(cou => {
            countryArr.push({ value: cou.id, description: cou.name });
          });
        }
        if (countryArr.length) {
          formGroup.get('1-country')['options'] = countryArr;
          if (this.countryCode) {
            formGroup.get('1-country').patchValue(this.countryCode);
            this.countryCode = null;
          }
        }
      });
    this.courierDetailsFacade
      .getStates()
      .pipe(takeUntil(this.destroy$))
      .subscribe(states => {
        const stateArr: { value: string; description: string }[] = [];
        if (states) {
          this.allstates = states;
          states.forEach(sts => {
            stateArr.push({ value: sts.id, description: sts.description });
          });
        }
        if (stateArr.length) {
          formGroup.get('1-state')['options'] = stateArr;
          if (this.stateName) {
            const stateCode = this.allstates.filter(
              sts => sts.description === this.stateName
            );
            formGroup.get('1-state').patchValue(stateCode[0].id);
            this.stateName = null;
          }
        }
      });
  }
  openViewLocationMapping() {
    this.selectionDialog
      .open({
        title: 'Mapped Locations',
        placeholder: 'Search Location',
        options: this.selectedLocations,
        isPopupClosed: false
      })
      .pipe(take(1))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  /**
   * opening location mapping
   */
  locationMapping() {
    if (!this.courierDetails?.isActive) {
      this.showMessage('pw.global.masterDeactiveMsg');
    } else {
      this.locationMappingService
        .open({
          selectedLocations: this.selectedLocations
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: LocationMappingServiceResponse) => {
          if (res.type === 'apply') {
            this.newlySelectedLocations = [];
            this.removedLocations = [];
            if (res.data.addedLocations) {
              res.data.addedLocations.forEach(Addedlocation => {
                this.newlySelectedLocations.push(Addedlocation.id);
              });
            }
            if (res.data.removedLocations) {
              res.data.removedLocations.forEach(removedLocation => {
                this.removedLocations.push(removedLocation.id);
              });
            }
            this.courierDetailsFacade.saveLocationMapping({
              courierName: this.courierName,
              locationMapping: {
                addLocations: this.newlySelectedLocations,
                removeLocations: this.removedLocations
              }
            });
          }
        });
    }
  }
  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);
}
