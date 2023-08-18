import {
  Component,
  Input,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { ConversionConfig } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-conversion-config-item',
  templateUrl: './conversion-config-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversionConfigItemComponent implements OnChanges {
  @Input() conversionConfigListItem: ConversionConfig;

  @Output() configIdView = new EventEmitter<number>();
  @Output() configId = new EventEmitter<number>();
  @Output() toggleValue = new EventEmitter<{
    isActive: boolean;
    ruleId: number;
  }>();
  isActive: any;

  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.conversionConfigListItem.isActive;
  }
  view(configId: number) {
    this.configIdView.emit(configId);
  }
  edit(configId: number) {
    this.configId.emit(configId);
  }
  change(isActive) {
    this.isActive = isActive;
    this.toggleValue.emit({
      isActive: isActive,
      ruleId: this.conversionConfigListItem.configId
    });
  }
}
