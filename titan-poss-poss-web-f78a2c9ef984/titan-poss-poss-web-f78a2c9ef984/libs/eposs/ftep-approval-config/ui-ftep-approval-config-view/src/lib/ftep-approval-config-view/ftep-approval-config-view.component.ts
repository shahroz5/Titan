import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  ConfigTypeEnum,
  FtepApprovalConfigResponse
} from '@poss-web/shared/models';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { GridApi } from 'ag-grid-community';
@Component({
  selector: 'poss-web-ftep-approval-config-view',
  templateUrl: './ftep-approval-config-view.component.html'
})
export class FtepApprovalConfigViewComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() ftepApprovalConfig$: Observable<FtepApprovalConfigResponse>;

  @Output() openLocationMappingEvent = new EventEmitter<boolean>();

  configDetail = null;
  ftepDescription: string;
  approveTypeList = ['EMAIL', 'CODE'];

  configTypeEnumRef = ConfigTypeEnum;

  destroy$ = new Subject<any>();

  translatedMessages: [];
  api: GridApi;
  ruleId: string;
  ruleType: string;
  expanded = true;
  rowData = [];
  constructor(public activatedRoute: ActivatedRoute) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ftepApprovalConfig$']) {
      this.ftepApprovalConfig$
        .pipe(takeUntil(this.destroy$))
        .subscribe(cnDetail => {
          this.configDetail = cnDetail;
        });
      if (this.configDetail && this.configDetail.config) {
        this.rowData = [];
        if (
          this.configDetail.config &&
          this.configDetail.config.length > 0 &&
          this.configDetail.config !== undefined
        ) {
          for (const details of this.configDetail.config)
            this.rowData.push({
              roleCode: details ? details.roleCode : '',
              processType: details ? details.processType : '',
              fromDays: details ? details.fromDays : '',
              tillDays: details ? details.tillDays : '',
              upperLimit: details ? details.upperLimit : '',
              approveTypes: this.approveTypeList
            });
        } else {
          this.rowData.push({
            roleCode: '',
            processType: '',
            fromDays: '',
            tillDays: '',
            upperLimit: '',
            id: '',
            approveTypes: this.approveTypeList
          });
        }
      }
    }
  }

  locationMapping() {
    this.openLocationMappingEvent.emit(true);
  }

  extractValues(mappings) {
    return Object.keys(mappings);
  }

  lookupValue(mappings, key) {
    return mappings[key];
  }

  getAllRows() {
    const rowData = [];
    this.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.ruleId = params['_ruleId'];
        this.ruleType = params['_ruleType'];
      });

    this.ftepApprovalConfig$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cnDetail => {
        if (cnDetail) {
          this.ruleId = cnDetail.ruleId;
          this.ruleType = cnDetail.ruleType;

          this.configDetail = cnDetail;
          if (this.ruleId !== 'new') {
            this.ftepDescription =
              this.ruleType === ConfigTypeEnum.GRN_APPROVAL_ACCESS_REGULAR
                ? 'Regular'
                : 'Manufacturing Defect';
          }
        }
      });
  }
  toggleAccordion() {
    this.expanded = !this.expanded;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
