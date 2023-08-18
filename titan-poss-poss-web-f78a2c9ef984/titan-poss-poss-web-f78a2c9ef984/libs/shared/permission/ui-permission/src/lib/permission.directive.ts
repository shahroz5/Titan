import {
  ChangeDetectorRef,
  Directive,
  Input,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {
  PermissionData,
  PermissionsPredefinedStrategies
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { PermissionStrategyService } from './permission-strategy.service';
import { PermissionService } from './permission.service';

@Directive({
  selector: '[possWebPermission]'
})
export class Permission implements OnInit {
  @Input() possWebPermission: Observable<PermissionData>;

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private changeDetector: ChangeDetectorRef,
    private renderer: Renderer2,
    private permissionService: PermissionService,
    private strategyService: PermissionStrategyService
  ) {}

  ngOnInit(): void {
    this.validatePermissionsForElement(this.possWebPermission);
  }

  validatePermissionsForElement(permissionConfig: Observable<PermissionData>) {
    // We have used take(2), supporting the master menus/sub-menus which are in 2 url's
    permissionConfig.pipe(take(2)).subscribe(permissionData => {
      return permissionData.transactionCodes.find(transactionCode =>
        this.permissionService.hasPermission(transactionCode)
      )
        ? this.applyStrategy(permissionData.authorisedStrategy || 'show')
        : this.applyStrategy(permissionData.unAuthorisedStrategy || 'remove');
    });
  }

  private applyStrategy(str: string) {
    if (str.toLowerCase() === PermissionsPredefinedStrategies.SHOW) {
      this.showTemplateBlockInView(this.templateRef);
      return;
    }

    if (str.toLowerCase() === PermissionsPredefinedStrategies.REMOVE) {
      this.viewContainer.clear();
      return;
    }

    const strategy = this.strategyService.getStrategy(str);
    this.showTemplateBlockInView(this.templateRef);
    if (strategy) {
      strategy(this.renderer, this.templateRef);
    }
  }

  private showTemplateBlockInView(template: TemplateRef<any>): void {
    this.viewContainer.clear();
    if (!template) {
      return;
    }

    this.viewContainer.createEmbeddedView(template);
    this.changeDetector.markForCheck();
  }
}
