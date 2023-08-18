import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'poss-web-residual-weight-config-view',
  templateUrl: './residual-weight-config-view.component.html'
})
export class ResidualWeightConfigViewComponent implements OnInit, OnChanges {
  @Input() selectedConfigDetails;
  @Input() residualWeightconfigDetails: any[] = [];
  @Input() resdiualWeightRange: any;

  expanded = true;
  rowData = [];

  constructor(private cdr: ChangeDetectorRef) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.residualWeightconfigDetails === null)
      this.residualWeightconfigDetails = [];

    if (
      changes['resdiualWeightRange'] ||
      changes['residualWeightconfigDetails']
    ) {
      this.cdr.markForCheck();
      this.rowData = [];
      if (this.residualWeightconfigDetails?.length) {
        this.residualWeightconfigDetails.forEach(config => {
          this.createRowData(config);
        });
      }
    }
  }
  createRowData(config) {
    console.log('rowData', config);
    this.rowData.push({
      id: config.id,
      rangeId: config.rangeId,
      range: config.range,
      configValue: config.configValue
    });
  }

  ngOnInit(): void {
    console.log(
      'selected',
      this.selectedConfigDetails,
      this.residualWeightconfigDetails
    );
  }

  toggleAccordion() {
    this.expanded = !this.expanded;
  }
  getRange(id) {
    return this.resdiualWeightRange.filter(range => range.id === id)[0].range;
  }
}
