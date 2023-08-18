import { Injectable, Renderer2, TemplateRef } from '@angular/core';
import { StrategyFunction } from '@poss-web/shared/models';

@Injectable({ providedIn: 'root' })
export class PermissionStrategyService {
  private strategiesSource: Map<string, StrategyFunction>;

  constructor() {
    this.strategiesSource = new Map<string, StrategyFunction>();
    this.strategiesSource.set(
      'disable',
      (renderer: Renderer2, tempF: TemplateRef<any>) =>
        (tempF.elementRef.nativeElement.nextSibling.style.display = 'none')
    );
  }

  public addPermissionStrategy(key: string, func: StrategyFunction): void {
    this.strategiesSource.set(key, func);
  }

  public getStrategy(key: string) {
    key = this.getDefinedStrategy(key);
    return this.strategiesSource.get(key);
  }

  private getDefinedStrategy(name: string) {
    if (this.strategiesSource.get(name)) {
      return name;
    } else {
      throw new Error(`${name} strategy is not found, please define one`);
    }
  }
}
