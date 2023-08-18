import { Component, OnInit, OnDestroy } from '@angular/core';
import { take, filter, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { UserManagementFacade } from '@poss-web/shared/user-mgmt/data-access-user';
import {
  UserProfile,
  CustomErrors,
  ChangePasswordRequest,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  EmployeeSignatureDetailsResponse,
  SelectDropDownOption
} from '@poss-web/shared/models';
import { UpdatePasswordComponent } from '@poss-web/shared/profile/ui-change-password';
import { ValidateMobileChangeOTPComponent } from '@poss-web/shared/profile/ui-verify-mobile';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit, OnDestroy {
  isBTQUser = false;
  userProfile$: Observable<UserProfile>;
  isLoading$: Observable<boolean>;

  form: FormGroup;
  disableSignaturePad = false;
  cashierDigitalSignature: string;
  employeeCode: string;
  isUpdateSignatureSuccess = false;
  clearSignaturePad = false;
  isCashierRole = false;
  isProfileLoading$: Observable<boolean>;
  destroy$: Subject<null> = new Subject<null>();
  roleTypesList: SelectDropDownOption[] = [];

  constructor(
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private userManagementFacade: UserManagementFacade,
    private profileData: ProfileDataFacade,
    private dialog: MatDialog,
    private translate: TranslateService,
    // private digitalSignatureFacade: DigitalSignatureFacade,
    private authFacade: AuthFacade,
    fb: FormBuilder
  ) {
    userManagementFacade.loadUserProfile();
    this.form = fb.group({
      cashierSignatureField: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.isLoading$ = this.userManagementFacade.isLoading();
    this.isProfileLoading$ = this.profileData.isLoading();
    this.userManagementFacade.loadRoleTypes();
    this.profileData
      .getBoutiqueType()
      .pipe(
        filter((val: string) => !!val),
        withLatestFrom(this.profileData.isBTQUser()),
        take(1)
      )
      .subscribe(([val, val1]) => (this.isBTQUser = val1));

    this.userProfile$ = this.userManagementFacade.getUserProfile();

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
    this.userManagementFacade
      .getError()
      .pipe(
        takeUntil(this.destroy$),
        filter(errorVal => !!errorVal)
      )
      .subscribe(errorVal => this.showNotification(errorVal));

    this.authFacade
      .getUserName()
      .pipe(takeUntil(this.destroy$))
      .subscribe((userName: string) => {
        console.log('USER NAME :', userName);
        if (userName) {
          this.employeeCode = userName;
        }
      });

    this.profileData
      .getUserRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe((userRoles: string[]) => {
        if (userRoles && userRoles.length && userRoles.includes('CASHIER')) {
          this.profileData.loadEmployeeSignatureDetails(this.employeeCode);
          this.isCashierRole = true;
        } else {
          this.isCashierRole = false;
        }
      });

    this.profileData
      .getIsSignatureError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error && error.code) {
          this.showNotification(error);
        }
      });

    this.profileData
      .getEmployeeSignatureDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: EmployeeSignatureDetailsResponse) => {
        if (response) {
          this.clearSignaturePad = false;
          this.cashierDigitalSignature =
            response.digitalSignature &&
            response.digitalSignature.startsWith('"')
              ? JSON.parse(response.digitalSignature)
              : response.digitalSignature
              ? response.digitalSignature
              : '';
          console.log(
            'CUSTOMER DIGITAL SIGNATURE :',
            this.cashierDigitalSignature
          );
        }
      });

    this.profileData
      .getUploadSignatureResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(responseData => {
        if (responseData) {
          this.showAlertNotification(`Signature is updated successfully.`);
          this.isUpdateSignatureSuccess = true;
        }
      });
  }

  getEmployeeSignatureFromSignaturePad(event: any) {
    if (event) {
      this.profileData.uploadEmployeeSignature(this.employeeCode, event);
    }
  }

  clearDigitalSignatureScreen() {
    this.form.reset();
    // this.resetDigitalSignature();
    // if (this.signaturePad) {
    //   this.signaturePad.clear();
    // }
    this.cashierDigitalSignature = '';
    this.disableSignaturePad = false;
  }

  showAlertNotification(message: string): void {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        hasClose: true,
        hasBackdrop: true,
        message
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          if (this.isUpdateSignatureSuccess) {
            this.clearDigitalSignatureScreen();
            this.clearSignaturePad = true;
            this.isUpdateSignatureSuccess = false;
            this.profileData.loadEmployeeSignatureDetails(this.employeeCode);
          }
        }
      });
  }

  openChangePasswordDialog = () => {
    const changePassworddialogRef = this.dialog.open(UpdatePasswordComponent, {
      width: '500px'
    });

    changePassworddialogRef
      .afterClosed()
      .pipe(
        filter(passwordValue => !!passwordValue && passwordValue !== 'close')
      )
      .subscribe((passwordValue: ChangePasswordRequest) => {
        this.userManagementFacade.updatePassword(
          passwordValue.oldPassword,
          passwordValue.newPassword
        );
        this.userManagementFacade
          .passwordUpdated()
          .pipe(
            filter(status => status),
            take(1)
          )
          .subscribe(status =>
            this.translate
              .get(
                'pw.userProfileNotificationMessages.updatePaswordSuccessfullMessage'
              )
              .pipe(take(1))
              .subscribe(message => this.showNotification(undefined, message))
          );
      });
  };

  openOTPValidationDialog = (event: string) => {
    const verifyOTPdialogRef = this.dialog.open(
      ValidateMobileChangeOTPComponent,
      {
        width: '500px',
        data: event
      }
    );

    verifyOTPdialogRef
      .afterClosed()
      .pipe(filter(otpValue => otpValue && otpValue !== 'close'))
      .subscribe((otpValue: string) => {
        this.userManagementFacade.verifyOtp(otpValue);
        this.userManagementFacade
          .getOtpVerified()
          .pipe(
            filter(status => status),
            take(1)
          )
          .subscribe(status =>
            this.translate
              .get(
                'pw.userProfileNotificationMessages.mobileNoChangeSuccessfullMessage'
              )
              .pipe(take(1))
              .subscribe(message => this.showNotification(undefined, message))
          );
      });
  };

  showNotification(error?: CustomErrors, message?: string) {
    this.overlayNotification
      .show({
        type: message
          ? OverlayNotificationType.SIMPLE
          : OverlayNotificationType.ERROR,
        error: error,
        hasClose: true,
        message: message,
        hasBackdrop: !!message
      })
      .events.pipe(take(1))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.profileData.resetEmployeeSignatureData();
  }
}
