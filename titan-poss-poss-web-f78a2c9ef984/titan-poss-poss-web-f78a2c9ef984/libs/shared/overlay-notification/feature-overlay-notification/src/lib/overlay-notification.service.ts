import { take, takeUntil } from 'rxjs/operators';

import {
  OVERLAY_NOTIFICATION_DATA,
  OVERLAY_REF
} from './overlay-notification.token';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Injectable, Injector, OnDestroy } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { OverlayNotificationComponent } from './overlay-notification.component';

import {
  OverLayNotificationConfig,
  OverlayNotificationEventRef,
  OverlayNotificationRef,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { Router } from '@angular/router';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OverlayNotificationService implements OnDestroy {
  overlayRef: OverlayRef;
  overlayPortal: ComponentPortal<any>;
  config: OverlayConfig;
  defaultTime = 2000;
  currentComponentInstance: OverlayNotificationComponent;
  private destroy$ = new Subject<void>();

  constructor(
    private overlay: Overlay,
    private injector: Injector,
    private router: Router,
    private authFacade: AuthFacade
  ) {
    this.config = {
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .bottom(),
      scrollStrategy: this.overlay.scrollStrategies.noop()
    };
    this.overlayRef = this.overlay.create(this.config);
  }

  show(config: OverLayNotificationConfig): OverlayNotificationRef {
    //  * Detach the previous component/request
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }

    this.overlayRef.getConfig().hasBackdrop = !!config.hasBackdrop;

    if (config.type === OverlayNotificationType.ERROR) {
      this.overlayRef.getConfig().hasBackdrop = true;
    }
    config.time = config.time == null ? this.defaultTime : config.time;

    const componentPortal = new ComponentPortal(
      OverlayNotificationComponent,
      null,
      this.createInjector(config)
    );
    const componentRef = this.overlayRef.attach(componentPortal);

    const componentInstance = componentRef.instance;
    this.currentComponentInstance = componentInstance;

    const overlayNotificationRef = new OverlayNotificationRef();

    componentInstance.events
      .pipe(take(1))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.close();
        overlayNotificationRef.events.emit(event);
      });

    componentInstance.remarkEvent
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: string) => {
        overlayNotificationRef.remarksEvent.emit(event);
      });

    if (
      config?.error?.code === ErrorEnums.ERR_AUTH_018 ||
      config?.error?.code === ErrorEnums.ERR_CORE_007
    ) {
      //Dont show Overlay when "Invalid Authentication Token" & "Error while Decryption", logout user
      this.close();
      // this.router.navigate([getLoginUrl()]);
      this.authFacade.logOut();
    }
    return overlayNotificationRef;
  }

  focus() {
    if (this.currentComponentInstance) {
      this.currentComponentInstance.focus();
    }
  }

  close() {
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
      this.currentComponentInstance = null;
    }
  }

  // This function create a injector to pass the data to the portal
  private createInjector(data): PortalInjector {
    const injectorToken = new WeakMap();
    injectorToken.set(OVERLAY_NOTIFICATION_DATA, data);
    injectorToken.set(OVERLAY_REF, this.overlayRef);
    return new PortalInjector(this.injector, injectorToken);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
