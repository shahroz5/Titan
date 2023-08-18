import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import {
  CustomErrors,
  LocationData,
  LocationMappingData,
  LocationMappingPayLoad,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  RoleTypes,
  SelectDropDownOption,
  StoreTypes,
  UamEnums,
  UserDetail
} from '@poss-web/shared/models';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { UserManagementFacade } from '@poss-web/shared/user-mgmt/data-access-user';
import { getUserMgmtHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { Observable, of, Subject } from 'rxjs';
import {
  filter,
  map,
  take,
  takeUntil,
  tap,
  withLatestFrom
} from 'rxjs/operators';

@Component({
  templateUrl: './user-detail.component.html'
})
export class UserDetailComponent implements OnInit, OnDestroy {
  isBTQUser = false;
  isRegUser = false;
  private storetype = Array(
    StoreTypes.LargeFormatStoreType.toString(),
    StoreTypes.MediumFormatStoreType.toString(),
    StoreTypes.SmallFormatStoreType.toString()
  );
  userLocationCode = '';
  mobileMaxLength = 0;
  employeeCode = '';
  user$: Observable<UserDetail>;
  isLoading$: Observable<boolean>;
  rolesList: SelectDropDownOption[] = [];
  regionsList: SelectDropDownOption[] = [];
  roleTypesList: SelectDropDownOption[] = [];
  statesList: SelectDropDownOption[] = [];
  countriesList: SelectDropDownOption[] = [];
  validLocation$: Observable<LocationData>;
  validEmailLocation$: Observable<string>;
  permissions$: Observable<any[]>;
  hasNotification = false;
  validContact$: Observable<{ [key: string]: boolean }>;
  username = '';
  destroy$: Subject<null> = new Subject<null>();
  mappedLocationData: LocationMappingData[];
  usercreationsuccessMessage =
    'pw.usermanagementformNotification.usercreationsuccessMessage';
  usereditsuccessMessage =
    'pw.usermanagementformNotification.usereditsuccessMessage';
  activateNewUserLoginsuccessMessage =
    'pw.usermanagementformNotification.activateNewUserLoginsuccessMessage';

  constructor(
    public router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private authfacade: AuthFacade,
    private activatedRoute: ActivatedRoute,
    public userManagementFacade: UserManagementFacade,
    private appsettingFacade: AppsettingFacade,
    private profileData: ProfileDataFacade,
    private translate: TranslateService,
    private permissionfacade: PermissionFacade
  ) {
    profileData
      .getBoutiqueType()
      .pipe(
        filter((val: string) => !!val),
        withLatestFrom(
          this.profileData.isBTQUser(),
          this.authfacade.getLocationCode()
        ),
        take(1)
      )
      .subscribe(([val, val1, val2]) => {
        this.isBTQUser = val1;
        this.userLocationCode = val2;
        this.loadSelectedUser();
      });

    this.profileData
      .isRegUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isRegUser: boolean) => {
        this.isRegUser = isRegUser;
      });

    this.appsettingFacade
      .getMobileMaxLength()
      .pipe(take(1))
      .subscribe(val => (this.mobileMaxLength = val));
  }

  ngOnInit() {
    this.isLoading$ = this.userManagementFacade.isLoading();
    this.userManagementFacade.loadCountrylist();
    this.userManagementFacade.loadRoleTypes();
    this.userManagementFacade.loadRegions();
    this.userManagementFacade
      .getCountriesList()
      .pipe(
        takeUntil(this.destroy$),
        filter(data => !!data)
      )
      .subscribe(countryList => {
        this.countriesList = countryList.map(country => ({
          value: country.countryCode,
          description: country.description
        }));
      });
    this.userManagementFacade
      .getRoleTypesList()
      .pipe(
        takeUntil(this.destroy$),
        filter(data => !!data)
      )
      .subscribe(roleTypes => {
        this.roleTypesList = roleTypes.map(role => ({
          value: role.code,
          description: role.value
        }));
      });
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.userManagementFacade
      .getError()
      .pipe(
        takeUntil(this.destroy$),
        filter(errorVal => !!errorVal)
      )
      .subscribe(errorVal => this.showNotification(errorVal));

    this.userManagementFacade
      .userUpdated()
      .pipe(
        takeUntil(this.destroy$),
        filter(updated => updated)
      )
      .subscribe(_ =>
        this.translate
          .get(
            this.employeeCode === UamEnums.USER_CREATE
              ? this.usercreationsuccessMessage
              : this.usereditsuccessMessage,
            {
              username: this.username
            }
          )
          .pipe(take(1))
          .subscribe(message => this.showNotification(undefined, message))
      );
      this.userManagementFacade
        .getLocationMappingStatus()
        .pipe(takeUntil(this.destroy$))
        .subscribe(status => {
          if (status) {
            this.showSuccessMessageNotification();
          }
        });
    this.userManagementFacade
      .getRegionsList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(regions => {
        if (regions) {
          this.regionsList = regions
        }
      });
  }

  loadSelectedUser() {
    this.employeeCode = this.activatedRoute.snapshot.params['_id'] || '';
    if (this.employeeCode !== UamEnums.USER_CREATE) {
      this.userManagementFacade.loadSelectedUser(
        this.isBTQUser,
        this.employeeCode
      );
      if (!this.isBTQUser) {
        this.userManagementFacade.loadMappedLocations(this.isBTQUser, this.employeeCode)
        this.userManagementFacade.getMappedLocations().pipe(takeUntil(this.destroy$))
        .subscribe(x => {
          if (x) {
            this.mappedLocationData = x;
          }
        })
      }

      this.user$ = this.userManagementFacade.getSelectedUser().pipe(
        filter(user => !!user),
        tap((user: UserDetail) => {
          this.loadRoles(
            this.isBTQUser
              ? undefined
              : user && this.storetype.includes(user.userType)
              ? RoleTypes.Boutique
              : user.userType === StoreTypes.RegionalStoreType.toString()
              ? RoleTypes.Regional
              : RoleTypes.Corporate,
            !this.isBTQUser && user && this.storetype.includes(user.userType)
              ? user.locationCode
              : ''
          );
          if (user.address && user.address.country) {
            this.userManagementFacade
              .getCountry(user.address.country)
              .pipe(
                filter(data => !!data),
                take(1)
              )
              .subscribe(data => {
                this.validLocation$ = of({
                  locationCode: user.locationCode,
                  countryCode: data.countryCode
                });
                this.loadStates(data.countryCode);
              });
          }
        })
      );
    } else {
      this.loadRoles(this.isBTQUser ? undefined : RoleTypes.Corporate);
      this.checkLocation(this.userLocationCode);
    }
  }

  checkLocation(locationCode: string) {
    this.userManagementFacade.validateLocation(
      locationCode ? locationCode : this.userLocationCode
    );
    this.validLocation$ = this.userManagementFacade.getLocation();
  }

  checkEmailLocation(locationCode: string) {
    this.userManagementFacade.validateEmailLocation(
      locationCode ? locationCode : this.userLocationCode
    );
    this.validEmailLocation$ = this.userManagementFacade.getEmailLocation();
  }

  loadStates(countryCode: string) {
    this.userManagementFacade.loadStatelist(countryCode);
    this.userManagementFacade
      .getStatesList()
      .pipe(
        takeUntil(this.destroy$),
        filter(data => !!data)
      )
      .subscribe(states => {
        this.statesList = states.map(state => ({
          value: state,
          description: state
        }));
      });
  }

  checkUniqueEmailMobile(type: any) {
    const fieldType = type['EMAIL'] ? UamEnums.EMAIL : UamEnums.MOBILE;
    this.userManagementFacade.validateEmailMobile(fieldType, type[fieldType]);
    this.validContact$ = this.userManagementFacade
      .getEmailMobileValidation()
      .pipe(
        map(validContact =>
          type['EMAIL'] ? { email: validContact } : { mobile: validContact }
        )
      );
  }

  resendOTP(empCode: string) {
    this.userManagementFacade.resendOtp({ empCode, isBTQUser: this.isBTQUser });
    this.userManagementFacade
      .isOtpSent()
      .pipe(
        filter(isSent => isSent),
        takeUntil(this.destroy$)
      )
      .subscribe(_ =>
        this.translate
          .get(this.activateNewUserLoginsuccessMessage, {
            username: empCode
          })
          .pipe(take(1))
          .subscribe(message => this.showNotification(undefined, message))
      );
  }

  loadRoles(roleType: string, locationCode?: string) {
    this.userManagementFacade.loadRoles(this.isBTQUser, roleType, locationCode);

    this.userManagementFacade
      .getRolesList()
      .pipe(
        filter(list => !!list),
        takeUntil(this.destroy$)
      )
      .subscribe((list: Map<string, string>) => {
        this.rolesList = [];
        list.forEach((value, key) => {
          this.rolesList.push({
            value: key,
            description: value
          });
        });
      });
  }

  addNewUser(userdata: any) {
    this.userManagementFacade.addUser(this.isBTQUser, userdata);
    this.username = userdata.employeeCode;
  }

  updateUser(userdata: any) {
    this.userManagementFacade.updateUser(
      this.isBTQUser,
      this.employeeCode,
      userdata
    );
    this.username = this.employeeCode;
  }

  addLocationMapping(payload: LocationMappingPayLoad) {
    if (this.employeeCode !== UamEnums.USER_CREATE) {
      this.userManagementFacade.updateMappedLocations(this.isBTQUser, this.employeeCode, payload);
    }
  }

  showSuccessMessageNotification() {
    const key = 'pw.locationMapping.updateSuccessNotification';
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,
            hasBackdrop: false
          })
          .events.pipe(takeUntil(this.destroy$));
      });
  }

  showNotification(error?: CustomErrors, message?: string) {
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: !!error
          ? OverlayNotificationType.ERROR
          : OverlayNotificationType.SIMPLE,
        error: error,
        message: message,
        hasBackdrop: !!message,
        hasClose: true
      })
      .events.pipe(take(1))
      .subscribe(() => {
        this.hasNotification = false;
        if (message) {
          this.router.navigate([getUserMgmtHomeRouteUrl()]);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
