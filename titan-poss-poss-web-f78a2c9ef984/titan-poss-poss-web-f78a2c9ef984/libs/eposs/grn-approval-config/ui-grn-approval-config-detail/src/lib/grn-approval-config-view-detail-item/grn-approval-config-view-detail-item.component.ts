import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ConfigTypeEnum,
  GrnApprovalConfigResponse
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { GridApi } from 'ag-grid-community';

@Component({
  selector: 'poss-web-grn-approval-config-view-detail-item',
  templateUrl: './grn-approval-config-view-detail-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrnApprovalConfigViewDetailItemComponent
  implements OnInit, OnDestroy {
  @Input() grnApprovalConfig$: Observable<GrnApprovalConfigResponse>;

  @Output() openLocationMappingEvent = new EventEmitter<boolean>();

  configDetail = null;

  grnTypeList = [
    {
      id: 'GRN_APPROVAL_ACCESS_REGULAR',
      description: 'Regular'
    },
    {
      id: 'GRN_APPROVAL_ACCESS_MFG_DEFECT',
      description: 'Manufacturing Defect'
    }
  ];

  grnDescription: string;

  approveTypeList = ['EMAIL', 'CODE'];

  configTypeEnumRef = ConfigTypeEnum;

  destroy$ = new Subject<any>();
  ruleId: string;
  ruleType: string;
  grnApprovalConfigForm: FormGroup;
  residualValueAmountLabel: string;

  rowHeight = 40;
  animateRows = true;
  rowData = [];
  objCategoryMappings = {};
  domLayout = 'autoHeight';
  editable = false;
  columnDefs = [];
  translatedMessages: [];
  api: GridApi;

  constructor(public activatedRoute: ActivatedRoute) {}

  locationMapping() {
    this.openLocationMappingEvent.emit(true);
  }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.ruleId = params['_ruleId'];
        this.ruleType = params['_ruleType'];
      });

    this.grnApprovalConfig$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cnDetail => {
        if (cnDetail) {
          this.ruleId = cnDetail.ruleId;
          this.ruleType = cnDetail.ruleType;

          this.configDetail = cnDetail;
          if (this.ruleId !== 'new') {
            this.grnDescription =
              this.ruleType === ConfigTypeEnum.GRN_APPROVAL_ACCESS_REGULAR
                ? 'Regular'
                : 'Manufacturing Defect';
          }
        }
      });
  }

  getGRNTypeValue() {
    if (this.ruleType) {
      const selectedCnType = this.grnTypeList.find(
        grnType => grnType.id === this.ruleType
      );
      return selectedCnType.description;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
