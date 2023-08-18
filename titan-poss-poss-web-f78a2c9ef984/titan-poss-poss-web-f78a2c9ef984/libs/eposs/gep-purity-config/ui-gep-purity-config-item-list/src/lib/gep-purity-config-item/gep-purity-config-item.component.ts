import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges
} from '@angular/core';
import { GEPPurityConfig } from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-gep-purity-config-item',
  templateUrl: './gep-purity-config-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GepPurityConfigItemComponent implements OnChanges {
  @Input() gepPurityConfigItem: GEPPurityConfig;
  @Output() configId = new EventEmitter<string>();
  @Output() toggleValue = new EventEmitter<{
    isActive: boolean;
    configId: string;
  }>();
  isActive: any;
  @Output() viewPage = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.gepPurityConfigItem.isActive;
  }
  edit(configId: string) {
    this.configId.emit(configId);
  }
  change(event) {
    this.isActive = event;
    this.toggleValue.emit({
      isActive: event,
      configId: this.gepPurityConfigItem.configId
    });
  }


  openViewPage(configId) {
    this.viewPage.emit(configId);
  }
}
