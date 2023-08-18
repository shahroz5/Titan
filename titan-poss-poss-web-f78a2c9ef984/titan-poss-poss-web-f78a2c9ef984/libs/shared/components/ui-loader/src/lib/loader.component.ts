import { LoaderContentComponent } from './loader-content/loader-content.component';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

@Component({
  selector: 'poss-web-loader',
  template: '',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent implements OnInit, OnDestroy {
  config: OverlayConfig;
  overlayRef: OverlayRef;

  constructor(private overlay: Overlay) {
    this.config = {
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      hasBackdrop: true
    };
    this.overlayRef = this.overlay.create(this.config);
  }
  ngOnInit() {
    const componentPortal = new ComponentPortal(LoaderContentComponent);
    this.overlayRef.attach(componentPortal);
  }

  ngOnDestroy(): void {
    this.overlayRef.detach();
    this.overlayRef.dispose();
  }
}
