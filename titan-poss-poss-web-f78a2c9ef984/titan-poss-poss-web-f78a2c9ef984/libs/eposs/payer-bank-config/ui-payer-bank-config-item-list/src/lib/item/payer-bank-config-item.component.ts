import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import {
  PayerBankConfiguration,
  ToggleButtonPayload
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-payer-bank-config-item',
  templateUrl: './payer-bank-config-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayerBankConfigItemComponent implements OnChanges {
  @Input() payerBankConfigList: PayerBankConfiguration;
  @Output() payerBankConfigNameView = new EventEmitter<{
    description: string;
    id: string;
  }>();
  @Output() payerBankConfigName = new EventEmitter<{
    description: string;
    id: string;
  }>();
  @Output() isActive = new EventEmitter<ToggleButtonPayload>();
  active: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    this.active = this.payerBankConfigList.isActive;
  }
  getPayerBankConfigName(payerBankConfigName: string, id: string) {
    this.payerBankConfigName.emit({
      description: payerBankConfigName,
      id: this.payerBankConfigList.id
    });
  }
  view(configName: string, id: string) {
    this.payerBankConfigNameView.emit({
      description: configName,
      id: id
    });
  }
  edit(configName: string, id: string) {
    this.payerBankConfigName.emit({
      description: configName,
      id: id
    });
  }
  change(isActive: boolean) {
    this.active = isActive;
    this.isActive.emit({
      isActive: isActive,
      id: this.payerBankConfigList.id
    });
  }
}
