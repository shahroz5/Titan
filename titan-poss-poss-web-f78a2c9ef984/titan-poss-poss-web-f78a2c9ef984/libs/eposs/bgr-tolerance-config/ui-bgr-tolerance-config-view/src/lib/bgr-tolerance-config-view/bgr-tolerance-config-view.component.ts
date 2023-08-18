import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WeightFormatterService } from '@poss-web/shared/components/ui-formatters';

@Component({
  selector: 'poss-web-bgr-tolerance-config-view',
  templateUrl: './bgr-tolerance-config-view.component.html'
})
export class BgrToleranceConfigViewComponent implements OnChanges {
  @Input() configDetails: any[] = [];
  @Input() weightRange: any = [];
  @Input() metaltypes: any[] = [];
  @Input() selectedConfigDetails;
  rowData = [];
  expanded = true;

  constructor(
    private weightFormatterService: WeightFormatterService,
    private translate: TranslateService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.configDetails === null) this.configDetails = [];
    if (
      changes['configDetails'] ||
      changes['weightRange'] ||
      changes['metaltypes']
    ) {
      this.rowData = [];
      this.configDetails.forEach(config => {
        this.rowData.push({
          metalType: this.metaltypes.filter(
            obj => obj.materialTypeCode === config.metalType
          )[0].description,
          rangeId: this.weightRange.filter(obj => obj.id === config.rangeId)[0]
            .range,
          configValue: config.configValue,
          configPercent: config.configPercent
        });
      });
    }
  }

  toggleAccordion() {
    this.expanded = !this.expanded;
  }
}
