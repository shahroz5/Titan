import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { CommomStateAttributeNameEnum, CommomStateAttributeTypeEnum, ToolbarConfig, TransactionTypeEnum } from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getGrnHistoryUrl, getGrnStatusUrl } from '@poss-web/shared/util-site-routes';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
@Component({
  selector: 'poss-web-grn-details-shell',
  templateUrl: './grn-details-shell.component.html',
})
export class GrnDetailsShellComponent
  implements OnInit, AfterViewInit, OnDestroy {
  destroy$ = new Subject<null>();
  params: string;
  toolbarData: ToolbarConfig = {
    txnType: TransactionTypeEnum.GRN,
    loadMetalPrices: true,
    loadHoldPopup: false,
    loadOpenOrdersPopup: false
  };
  isWorkflowRequired;

  constructor(
    private router: Router,
    private toolbarFacade: ToolbarFacade,
    private activatedRoute: ActivatedRoute,
    private commonFacade: CommonFacade
  ) {}

  ngOnInit() {
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GRN,
        CommomStateAttributeNameEnum.GRN_WORKFLOW_FLAG
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((isWorkflowRequired: boolean) => {
          this.isWorkflowRequired = isWorkflowRequired
      });
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.params = param['_grnId'];
      });
  }
  back() {
    if(this.isWorkflowRequired)
      this.router.navigate([getGrnStatusUrl()]);  
    else
      this.router.navigate([getGrnHistoryUrl()], {
        state: { clearFilter: false }
      });
  }
  ngAfterViewInit() {
    this.toolbarFacade.setToolbarConfig(this.toolbarData);
  }
  ngOnDestroy(): void {
    this.toolbarFacade.resetValues();
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
  }
}
