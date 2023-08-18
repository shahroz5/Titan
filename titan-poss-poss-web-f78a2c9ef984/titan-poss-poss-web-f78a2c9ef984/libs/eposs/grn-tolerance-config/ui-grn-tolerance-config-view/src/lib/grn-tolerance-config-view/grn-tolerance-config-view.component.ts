import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WeightValueConfigDetails } from '@poss-web/shared/models';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-grn-tolerance-config-view',
  templateUrl: './grn-tolerance-config-view.component.html'
})
export class GrnToleranceConfigViewComponent implements OnInit, OnDestroy {
  @Input() weightValueConfigDetails: WeightValueConfigDetails;
  @Output() openLocationMapping = new EventEmitter<boolean>();
  weightBasedRowData = [];
  valueBasedRowData = [];
  destroy$ = new Subject();
  expanded = true;
  constructor(private translationService: TranslateService) {}

  ngOnInit(): void {
    this.weightBasedRowData = this.weightValueConfigDetails?.ruleDetails?.data?.weightBased;
    this.valueBasedRowData = this.weightValueConfigDetails?.ruleDetails?.data?.valueBased;
  }

  openViewLocationMapping() {
    this.openLocationMapping.emit(true);
  }
  toggleAccordion() {
    this.expanded = !this.expanded;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
