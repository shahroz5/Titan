import { getReportHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import {
  OverlayNotificationType,
  ReportRoleSetting,
  SelectDropDownOption,
  OverlayNotificationServiceAbstraction,
  CustomErrors,
  CheckBoxHeader,
  ReportName,
} from '@poss-web/shared/models';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil, take } from 'rxjs/operators';
import { ReportsFacade } from '@poss-web/shared/reports/data-access-reports';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { CheckboxGridComponent } from '@poss-web/shared/components/ui-checkbox-grid';

@Component({
  selector: 'poss-web-report-role-mapping',
  templateUrl: './report-role-mapping.component.html'
})
export class ReportRoleMappingComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  isLoading$: Observable<boolean>;
  reportForm: FormGroup;
  columnHeaders: CheckBoxHeader[] = [];
  rowHeaders: CheckBoxHeader[] = [];
  hasChange = false;
  maxOptionsLimit = 20;
  reportGroups: SelectDropDownOption[] = [];
  roles: SelectDropDownOption[] = [];
  selectedSetting: Observable<ReportRoleSetting[]>;

  @ViewChild(CheckboxGridComponent)
  checkboxGridRef: CheckboxGridComponent;
  reportRoles: string[];
  columnDefs = [];
  defaultColDef = {
    suppressMovable: true
  };

  reportRoleMappingComponent: ReportRoleMappingComponent = this;
  selectToGrantAccessLabel: string;
  reportName: Observable<ReportName[]>;
  permissions$: Observable<any[]>;

  constructor(
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private fb: FormBuilder,
    private router: Router,
    private reportsFacade: ReportsFacade,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService,
  ) {}

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.reportsFacade.clearReportsData();

    this.isLoading$ = this.reportsFacade.getIsLoading();
    this.translate
      .get(['pw.reports.selectToGrantAccess'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.selectToGrantAccessLabel =
          translatedMessages['pw.reports.selectToGrantAccess'];
      });
    this.reportForm = this.fb.group({
      reportGroup: [],
      reportName: [],
      roleCode: []
    });
    this.columnHeaders = [
      { key: 'selectToGrantAccess', title: this.selectToGrantAccessLabel }
    ];

    this.reportsFacade
      .getReportGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe(reportGroups => {
        this.reportGroups = reportGroups?.map(reportGroup => ({
          value: reportGroup.code,
          description: reportGroup.value
        }));
      });

    this.reportsFacade
      .getRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe(roles => {
        this.roles = roles?.map(role => ({
          value: role.roleCode,
          description: role.roleName
        }));
      });

    this.reportName = this.reportsFacade.getReportNames();

    this.selectedSetting = this.reportsFacade.getReportRoles();

    this.reportsFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.reportsFacade
      .getSaveReportResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        if (response?.isSaved) {
          this.reportsFacade.loadReportRoles({
            roleCode: this.reportForm.get('roleCode').value
          });
          this.showSuccessNotifications();
        }
      });
    this.reportsFacade.loadRoles();
    this.reportsFacade.loadReportGroups();

    this.reportForm.get('roleCode').disable();
  }
  getContext() {
    return {
      validators: {},
      componentParent: this.reportRoleMappingComponent
    };
  }
  back() {
    this.router.navigate([getReportHomeRouteUrl()]);
  }

  onReportGroupChange(event) {
    this.reportForm.get('roleCode').enable();
    this.reportForm.get('roleCode').reset();
    this.reportsFacade.clearReportsData();
  }

  onRoleChange(event) {
    this.reportsFacade.loadReportNames(
      this.reportForm.get('reportGroup').value
    );
    this.reportsFacade.loadReportRoles({
      roleCode: event.value
    });
  }

  save(request) {
    this.reportsFacade.saveReportRoleSettings({
      roleCode: this.reportForm.get('roleCode').value,
      request: request
    });
    this.showProgressNotification();
  }

  showProgressNotification() {
    const key = 'pw.reports.progressMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.PROGRESS,
          message: translatedMsg,
          hasBackdrop: true
        });
      });
  }
  showSuccessNotifications() {
    const key = 'pw.reports.reportRoleMappingSaveSuccessMessage';
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
