import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { WeightValueConfigDetails } from '@poss-web/shared/models';
import { Subject } from 'rxjs';
@Component({
  selector: 'poss-web-grf-tolerance-config-view',
  templateUrl: './grf-tolerance-config-view.component.html'
})
export class GrfToleranceConfigViewComponent implements OnInit, OnDestroy {
  @Input() weightValueConfigDetails: WeightValueConfigDetails;
  destroy$ = new Subject();

  weightBasedRowData = [];
  valueBasedRowData = [];

  expanded = true;

  ngOnInit(): void {
    this.weightBasedRowData = this.weightValueConfigDetails.ruleDetails.data.weightBased;
    this.valueBasedRowData = this.weightValueConfigDetails.ruleDetails.data.valueBased;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  toggleAccordion() {
    this.expanded = !this.expanded;
  }
}
