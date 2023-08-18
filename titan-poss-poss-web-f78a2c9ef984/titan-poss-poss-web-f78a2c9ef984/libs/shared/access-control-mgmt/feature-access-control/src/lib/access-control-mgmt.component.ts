import { getUserMgmtHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { AccessControlManagementFacade } from '@poss-web/shared/access-control-mgmt/data-access-access-control-mgmt';
import {
  ACLUpdateRequest,
  ACLModuleDetails,
  ACLDetails,
  CustomErrors,
  SelectDropDownOption,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType, ACLRole
} from '@poss-web/shared/models';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './access-control-mgmt.component.html',
  styleUrls: []
})
export class AccessControlMgmtComponent implements OnInit, OnDestroy {
  rolesList: SelectDropDownOption[] = [];
  modulesList: SelectDropDownOption[] = [];
  subModulesList: SelectDropDownOption[] = [];
  features: SelectDropDownOption[] = [];
  aclList$: Observable<ACLDetails[]>;
  isLoading$: Observable<boolean>;
  aclForm: FormGroup;
  destroy$: Subject<null> = new Subject<null>();
  aclGroupOfACL: { aclGroupCode: string; isLeaf: boolean };

  constructor(
    private accesscontrolfacade: AccessControlManagementFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.aclForm = this.fb.group({
      role: [],
      module: [],
      subModule: [],
      feature: []
    });

    this.accesscontrolfacade.clearACL();

    this.aclForm
      .get('role')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(role => {
        this.accesscontrolfacade.loadModules(role);
        this.aclForm.get('module').reset();
        this.aclForm.get('subModule').reset();
        this.aclForm.get('feature').reset();
        this.aclGroupOfACL = null;
        this.accesscontrolfacade.clearACL();
      });

    this.aclForm
      .get('module')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((data: string) => {
        const selectedModule = this.fetchData(data);
        if (selectedModule) {
          if (selectedModule.isLeaf) {
            this.aclGroupOfACL = selectedModule;
            this.loadACL();
          } else {
            this.accesscontrolfacade.loadSubModules(
              selectedModule.aclGroupCode,
              this.aclForm.get('role').value
            );
            this.aclGroupOfACL = null;
            this.accesscontrolfacade.clearACL();
          }
          this.aclForm.get('subModule').reset();
          this.aclForm.get('feature').reset();
        } else {
          this.accesscontrolfacade.clearACL();
          this.aclForm.get('subModule').reset();
          this.aclForm.get('feature').reset();
        }
      });

    this.aclForm
      .get('subModule')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((data: string) => {
        const selectedSubModule = this.fetchData(data);
        if (selectedSubModule) {
          if (selectedSubModule.isLeaf) {
            this.aclGroupOfACL = selectedSubModule;
            this.loadACL();
          } else {
            this.accesscontrolfacade.loadFeatures(
              selectedSubModule.aclGroupCode,
              this.aclForm.get('role').value
            );
            this.aclGroupOfACL = null;
            this.accesscontrolfacade.clearACL();
          }
          this.aclForm.get('feature').reset();
        } else {
          this.accesscontrolfacade.clearACL();
          this.aclForm.get('feature').reset();
        }
      });

    this.aclForm
      .get('feature')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((data: string) => {
        const feature = this.fetchData(data);
        if (feature) {
          if (feature.isLeaf) {
            this.aclGroupOfACL = feature;
            this.loadACL();
          } else {
            this.aclGroupOfACL = null;
            this.accesscontrolfacade.clearACL();
          }
        } else {
          this.accesscontrolfacade.clearACL();
        }
      });
  }

  ngOnInit() {
    this.accesscontrolfacade.resetError();
    this.isLoading$ = this.accesscontrolfacade.getIsLoading();
    this.aclList$ = this.accesscontrolfacade.getACLList();

    this.accesscontrolfacade.loadRoles();
    this.accesscontrolfacade.loadModules(null);

    this.accesscontrolfacade
      .getRolesList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((roles: ACLRole[]) => {
        if (roles) {
          this.rolesList = roles.map(role => ({
            value: role.roleCode,
            description: role.roleName
          }));
        }
      });

    this.accesscontrolfacade
      .getModulesList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((modulesList: ACLModuleDetails[]) => {
        if (modulesList) {
          this.modulesList = modulesList.map(module => ({
            value: this.createKey(module.aclGroupCode, module.isLeaf),
            description: module.description
          }));
        }
      });

    this.accesscontrolfacade
      .getSubModulesList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((subModulesList: ACLModuleDetails[]) => {
        if (subModulesList) {
          this.subModulesList = subModulesList.map(module => ({
            value: this.createKey(module.aclGroupCode, module.isLeaf),
            description: module.description
          }));
        }
      });

    this.accesscontrolfacade
      .getFeatures()
      .pipe(takeUntil(this.destroy$))
      .subscribe((features: ACLModuleDetails[]) => {
        if (features) {
          this.features = features.map(module => ({
            value: this.createKey(module.aclGroupCode, module.isLeaf),
            description: module.description
          }));
        }
      });

    this.accesscontrolfacade
      .getIsACLUpdateSuccess()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          this.showNotifications();
          this.loadACL();
        }
      });

    this.accesscontrolfacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  back() {
    this.router.navigate([getUserMgmtHomeRouteUrl()]);
  }

  loadACL() {
    this.accesscontrolfacade.loadACL({
      roleCode: this.aclForm.get('role').value,
      aclGroupCode: this.aclGroupOfACL.aclGroupCode
    });
  }

  updateACL(data: ACLUpdateRequest) {
    if (data.addedAclCodes.length || data.removedAclCodes.length) {
      this.accesscontrolfacade.updateAcl({
        ...data,
        roleCode: this.aclForm.get('role').value
      });
      const key = 'pw.accessControlManagement.progressMessage';
      this.translate
        .get(key)
        .pipe(takeUntil(this.destroy$))
        .subscribe((translatedMsg: string) => {
          this.overlayNotification.show({
            type: OverlayNotificationType.PROGRESS,
            message: translatedMsg
          });
        });
    } else {
      this.showNoModificationNotifications();
    }
  }
  showNotifications() {
    const key = 'pw.accessControlManagement.updateSuccessMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SUCCESS,
            message: translatedMsg,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  showNoModificationNotifications() {
    const key = 'pw.accessControlManagement.noChangeMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMsg
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  createKey(aclGroupCode, isLeaf) {
    return aclGroupCode + '|' + isLeaf;
  }

  fetchData(key: string): { aclGroupCode: string; isLeaf: boolean } {
    if (!key) {
      return null;
    }
    const data = key.split('|');
    return { aclGroupCode: data[0], isLeaf: data[1] === 'true' };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
