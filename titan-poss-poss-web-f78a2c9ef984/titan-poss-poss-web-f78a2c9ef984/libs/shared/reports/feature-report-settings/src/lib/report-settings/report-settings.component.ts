import {
  getReportHomeRouteUrl,
  getGenerateReportRouteUrl
} from '@poss-web/shared/util-site-routes';
import {
  OverlayNotificationType,
  ReportGroupLov,
  SelectDropDownOption,
  UpdateIndividualReportSetting,
  SaveIndividualReportSetting,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  OverlayNotificationServiceAbstraction,
  CustomErrors,
  CheckBoxHeader,
  CheckBoxSelectedOption,
  ReportName,
  SaveReportPayload
} from '@poss-web/shared/models';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil, take } from 'rxjs/operators';
import { ReportsFacade } from '@poss-web/shared/reports/data-access-reports';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { CheckboxGridComponent } from '@poss-web/shared/components/ui-checkbox-grid';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { PermissionService } from '@poss-web/shared/permission/ui-permission';
@Component({
  selector: 'poss-web-report-settings',
  templateUrl: './report-settings.component.html',
  styleUrls: []
})
export class ReportSettingsComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  isLoading$: Observable<boolean>;
  reportForm: FormGroup;
  columnHeaders: CheckBoxHeader[] = [];
  rowHeaders: CheckBoxHeader[] = [];
  hasChange = false;
  maxOptionsLimit = 20;
  reportGroups: ReportGroupLov[];
  mappedReportNames: SelectDropDownOption[] = [];
  selectedSetting: CheckBoxSelectedOption[] = [];
  templateId: string;
  @ViewChild(CheckboxGridComponent)
  checkboxGridRef: CheckboxGridComponent;
  reportRoles: string[];
  columnDefs = [];
  defaultColDef = {
    suppressMovable: true
  };

  param: string;
  roleMapping: boolean;
  reportGroupOfFieldMap;
  reportNameOfFieldMap;
  reportIdOfFieldMap;
  reportSettingsComponent: ReportSettingsComponent = this;
  isExcludedLabel: string;
  includeFieldLabel: string;
  isExcludedAll: boolean;
  alertPopUpOpen = false;
  roles: SelectDropDownOption[] = [];
  empName: any;
  templateName: string;
  reportGroupOfFieldMapLabel: string;
  permissions$: Observable<any[]>;
  hasPermission = false;

  REPORT_SETTING_EDIT = 'Report Setting - Edit';
  REPORT_SETTING_VIEW = 'Report Setting - View';


  constructor(
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private fb: FormBuilder,
    private router: Router,
    private reportsFacade: ReportsFacade,
    private activatedRoute: ActivatedRoute,
    private alertPopupService: AlertPopupServiceAbstraction,
    private authFacade: AuthFacade,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService,
    private permissionService: PermissionService,
  ) {}

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.authFacade
      .getUserName()
      .pipe(takeUntil(this.destroy$))
      .subscribe(empName => {
        this.empName = empName;
      });
    this.param = this.activatedRoute.snapshot.params['_type'];
    console.log(this.param);
    if (this.param === 'role') {
      this.roleMapping = true;
      this.reportsFacade.loadReportNames();
      this.reportsFacade
        .getReportFields()
        .pipe(takeUntil(this.destroy$))
        .subscribe(fields => {
          this.rowHeaders = fields.map(field => ({
            key: field.reportFieldId,
            title: field.fieldName
          }));
        });
        this.reportsFacade
        .getReportNames()
        .pipe(takeUntil(this.destroy$))
        .subscribe((reportNames: ReportName[]) => {
          if (reportNames.length) {
            this.mappedReportNames = reportNames.map(reportName => ({
              value: reportName.id,
              description: reportName.reportDes
            }));
          }
        });
    } else {
      const array = this.param.split('-_-');
      console.log(array);

      this.reportIdOfFieldMap = array[0];
      console.log(this.reportIdOfFieldMap);
      this.reportGroupOfFieldMap = array[1];
      this.reportsFacade.loadReportNames(this.reportGroupOfFieldMap);
      this.reportGroupOfFieldMapLabel = array[1].replace('_', ' ');
      console.log(this.reportGroupOfFieldMap);
      this.reportsFacade.loadIndividualSetting(this.reportIdOfFieldMap);
      this.reportsFacade.loadExcludedIndividualSetting({
        reportMasterId: this.reportIdOfFieldMap,
        employeeCode: this.empName
      });
      this.reportsFacade
        .getTemplateId()
        .pipe(takeUntil(this.destroy$))
        .subscribe(templateId => {
          this.templateId = templateId;
        });
      this.reportsFacade
        .getTemplateName()
        .pipe(takeUntil(this.destroy$))
        .subscribe(templateName => {
          this.templateName = templateName;
        });
      this.reportsFacade
        .getReportFields()
        .pipe(takeUntil(this.destroy$))
        .subscribe(fields => {
          this.rowHeaders = fields.map(field => ({
            key: field.reportFieldId,
            title: field.fieldName
          }));
        });

      this.reportsFacade
        .getReportNames()
        .pipe(takeUntil(this.destroy$))
        .subscribe((reportNames: ReportName[]) => {
          console.log(reportNames);
          if (reportNames) {
            console.log(
              reportNames.filter(reportName => {
                if (reportName.id === this.reportIdOfFieldMap) {
                }
              })[0]
            );
            console.log(this.reportIdOfFieldMap);
            this.reportNameOfFieldMap = reportNames.filter(reportName => {
              console.log(reportName.id === this.reportIdOfFieldMap);
              if (reportName.id === this.reportIdOfFieldMap) {
                return true;
              }
            })[0]?.reportDes;
          }
        });
      this.roleMapping = false;
    }
    this.reportsFacade.clearReportsData();


    this.isLoading$ = this.reportsFacade.getIsLoading();
    this.translate
      .get(['pw.reports.isExcludedLabel',
            'pw.reports.includeFieldLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.isExcludedLabel = translatedMessages['pw.reports.isExcludedLabel'];
        this.includeFieldLabel = translatedMessages['pw.reports.includeFieldLabel'];
      });
    this.reportForm = this.fb.group({
      reportGroup: [],
      reportName: [],
      roleCode: []
    });
    this.columnHeaders = [{ key: 'isExcluded', title: this.isExcludedLabel }];

    this.reportsFacade
      .getReportGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe(reportGroup => {
        this.reportGroups = reportGroup;
      });

    this.reportsFacade
      .getReportRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe(roles => {
        this.roles = roles?.map(role => ({
          value: role.roleCode,
          description: role.roleName
        }));
      });

    this.reportsFacade
      .getReportSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe(settings => {
        if (settings) {
          this.selectedSetting = settings.map(setting => ({
            id: setting.id,
            rowHeaderKey: setting.rowHeaderKey,
            columnHeaderKey: 'isExcluded'
          }));
        }
      });

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
          if (this.roleMapping) {
            this.reportsFacade.loadReportSettings({
              reportId: this.reportForm.get('reportName').value,
              roleCode: this.reportForm.get('roleCode').value
            });
          } else {
            this.reportsFacade.loadExcludedIndividualSetting({
              reportMasterId: this.reportIdOfFieldMap,
              employeeCode: this.empName
            });
          }
          this.showSuccessNotifications();
        }
      });

    this.reportForm.get('roleCode').disable();
  }
  getContext() {
    return {
      validators: {},
      componentParent: this.reportSettingsComponent
    };
  }
  back() {
    this.reportsFacade.clearReportsData();
    if (this.roleMapping) {
      this.router.navigate([getReportHomeRouteUrl()]);
    } else {
      this.router.navigate([getGenerateReportRouteUrl()]);
    }
  }



  onRoleChange(event) {
    this.reportsFacade.loadReportFields(
      this.reportForm.get('reportName').value
    );
    this.reportsFacade.loadReportSettings({
      reportId: this.reportForm.get('reportName').value,
      roleCode: event.value
    });
  }
  onReportNameChange(event) {
    this.reportsFacade.clearReportsData();
    this.reportForm.get('roleCode').enable();
    this.reportForm.get('roleCode').reset();

    this.reportsFacade.loadReportRoles({
      reportDes: this.mappedReportNames.find(x => x.value === event.value).description
    });
  }

  save() {
    if (!this.isExcludedAll) {
      const gridData = this.checkboxGridRef.getValue();
      if (this.roleMapping) {
        const request: SaveReportPayload = {
          addRoles: gridData.added.map(added => ({
            isExcluded: true,
            isMasked: true,
            reportFieldId: added.rowHeaderKey,
            roleCode: this.reportForm.get('roleCode').value
          })),
          removeRoles: gridData.removed
        };

        this.reportsFacade.saveReportSettings({
          reportId: this.reportForm.get('reportName').value,
          request: request
        });
        this.showProgressNotification();
      } else {
        console.log(gridData);
        console.log(this.selectedSetting);

        if (this.templateId) {
          let updateIndividualReportSetting: UpdateIndividualReportSetting;
          updateIndividualReportSetting = {
            reportMasterId: this.reportIdOfFieldMap,
            templateId: this.templateId,
            data: {
              employeeCode: this.empName,
              outputColumns: {
                type: 'REPORT_TEMPLATE',
                data: {
                  fields:
                    gridData.removed.length === 0
                      ? gridData.added
                          .map(added => added.rowHeaderKey)
                          .concat(this.selectedSetting.map(ob => ob.rowHeaderKey))
                      : gridData.added
                          .map(added => added.rowHeaderKey)
                          .concat(this.selectedSetting.map(ob => ob.rowHeaderKey))
                          .filter(data => !gridData.removed.includes(data))
                }
              },

              templateName: this.templateName
            }
          };
          console.log(updateIndividualReportSetting);
          this.showProgressNotification();
          this.reportsFacade.updateIndividualSetting(
            updateIndividualReportSetting
          );
        } else {
          let saveIndividualReportSetting: SaveIndividualReportSetting;
          saveIndividualReportSetting = {
            reportMasterId: this.reportIdOfFieldMap,

            data: {
              employeeCode: this.empName,
              outputColumns: {
                type: 'REPORT_TEMPLATE',
                data: {
                  fields: gridData.added.map(added => added.rowHeaderKey)
                }
              },

              templateName: this.reportNameOfFieldMap
            }
          };
          console.log(saveIndividualReportSetting);
          this.showProgressNotification();
          this.reportsFacade.saveIndividualSetting(saveIndividualReportSetting);
        }
      }
    } else {
      if (!this.alertPopUpOpen) {
        this.alertPopUpOpen = true;
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.ERROR,
            message: this.includeFieldLabel
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: boolean) => {
            this.alertPopUpOpen = false;
        });
      }
    }
  }

  onChange(event) {
    this.hasChange = event;
    const selectAllInfo = this.checkboxGridRef.getSelectAllInfo();
    this.isExcludedAll = selectAllInfo[this.columnHeaders[0].key];
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
    const key = this.roleMapping
      ? 'pw.reports.settingsSaveSuccessMessage'
      : 'pw.reports.fieldSettingsSaveSuccessMessage';

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
  loadPermission(element: string) {
    this.elementPermission
        .loadPermission(element, this.permissions$)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          const hasRequestPermission = data.transactionCodes.find(key =>
            this.permissionService.hasPermission(key)
          );
          if (hasRequestPermission && this.REPORT_SETTING_EDIT === element) {
            this.hasPermission = true;
          }
        });
    return this.elementPermission.loadPermission(element, this.permissions$);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
