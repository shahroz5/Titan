import { SummaryBarBcComponent } from './summary-bar-bc/summary-bar-bc.component';
import { SUMMARY_BAR_DATA } from './summary-bar.token';
import {
  ComponentPortal,
  PortalInjector,
  ComponentType
} from '@angular/cdk/portal';
import { Injectable, Injector, EventEmitter } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { SummaryBarComponent } from './summary-bar.component';
import { GiftCardSaleSummaryBarComponent } from './summary-bar-gc/summary-bar-gc.component';
import { GrfSummaryBarComponent } from './summary-bar-grf/summary-bar-grf.component';
import {
  SummaryBarRef,
  SummaryBarEventRef,
  SummaryBarType
} from '@poss-web/shared/models';
import { SummaryBarGepComponent } from './summary-bar-gep/summary-bar-gep.component';
import { SummaryBarManualBillComponent } from './summary-bar-manual-bill/summary-bar-manual-bill.component';
import { SummaryBarFocComponent } from './summary-bar-foc/summary-bar-foc.component';
import { CtAcceptAdvanceSummaryBarComponent } from './summary-bar-accept-advance/summary-bar-accept-advance.component';
import { SummaryBarAbComponent } from './summary-bar-ab/summary-bar-ab.component';
import { SummaryBarWalkInsComponent } from './summary-bar-walk-ins/summary-bar-walk-ins.component';
import { SummaryBarGrnComponent } from './summary-bar-grn/summary-bar-grn.component';
import { SendForApprovalComponent } from './summary-bar-grn/send-for-approval/send-for-approval.component';
import { SummaryBarCnComponent } from './summary-bar-cn/summary-bar-cn.component';
import { SummaryBarTepComponent } from './summary-bar-tep/summary-bar-tep.component';
import { SummaryBarCutPieceTepComponent } from './summary-bar-cut-piece-tep/summary-bar-cut-piece-tep.component';
import { SummaryBarMergeGrfComponent } from './summary-bar-grf/summary-bar-merge-grf/summary-bar-merge-grf.component';
import { SummaryBarTepViewComponent } from './summary-bar-tep-view/summary-bar-tep-view.component';
import { SummaryBarCmHistoryComponent } from './summary-bar-cm-history/summary-bar-cm-history.component';
import { SummaryBarAbNewComponent } from './summary-bar-ab-new/summary-bar-ab-new.component';
import { SummaryBarAbManualBillComponent } from './summary-bar-ab-manual-bill/summary-bar-ab-manual-bill.component';
import { SummaryBarBcHistoryComponent } from './summary-bar-bc-history/summary-bar-bc-history.component';
import { SummaryBarCoComponent } from './summary-bar-co/summary-bar-co.component';

export interface SummaryBarBase {
  events: EventEmitter<SummaryBarEventRef>;
}
@Injectable({
  providedIn: 'root'
})
export class SummaryBarService {
  overlayRef: OverlayRef;
  overlayPortal: ComponentPortal<any>;
  config: OverlayConfig;

  components = new Map<SummaryBarType, ComponentType<SummaryBarBase>>()
    .set(SummaryBarType.SUMMARY_BAR, SummaryBarComponent)
    .set(SummaryBarType.GIFT_CARD, GiftCardSaleSummaryBarComponent)
    .set(SummaryBarType.WALK_INs, SummaryBarWalkInsComponent)
    .set(SummaryBarType.GEP, SummaryBarGepComponent)
    .set(SummaryBarType.AB, SummaryBarAbComponent)
    .set(SummaryBarType.AB_NEW, SummaryBarAbNewComponent)
    .set(SummaryBarType.AB_MB, SummaryBarAbManualBillComponent)
    .set(SummaryBarType.BC, SummaryBarBcComponent)
    .set(SummaryBarType.MB, SummaryBarManualBillComponent)
    .set(SummaryBarType.FOC, SummaryBarFocComponent)
    .set(SummaryBarType.ADV, CtAcceptAdvanceSummaryBarComponent)
    .set(SummaryBarType.GRF, GrfSummaryBarComponent)
    .set(SummaryBarType.MERGE_GRF, SummaryBarMergeGrfComponent)
    .set(SummaryBarType.GRN, SummaryBarGrnComponent)
    .set(SummaryBarType.GRN_APPROVAL, SendForApprovalComponent)
    .set(SummaryBarType.TEP, SummaryBarTepComponent)
    .set(SummaryBarType.TEP_VIEW, SummaryBarTepViewComponent)
    .set(SummaryBarType.CUT_PIECE_TEP, SummaryBarCutPieceTepComponent)
    .set(SummaryBarType.CN, SummaryBarCnComponent)
    .set(SummaryBarType.CM_HISTORY, SummaryBarCmHistoryComponent)
    .set(SummaryBarType.BC_HISTORY, SummaryBarBcHistoryComponent)
    .set(SummaryBarType.CO, SummaryBarCoComponent)

  constructor(private overlay: Overlay, private injector: Injector) {
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

  open(summaryBarType: SummaryBarType, data: any = null) {
    this.close();
    const componentPortal = new ComponentPortal(
      this.components.get(summaryBarType),
      null,
      this.createInjector(data)
    );
    const componentRef = this.overlayRef.attach(componentPortal);

    const componentInstance = componentRef.instance;

    const ref = new SummaryBarRef();

    componentInstance.events.subscribe((event: SummaryBarEventRef) => {
      ref.events.emit(event);
    });

    return ref;
  }

  close() {
    if (this.overlayRef.hasAttached) {
      this.overlayRef.detach();
    }
  }

  // This function create a injector to pass the data to the portal
  private createInjector(data = null): PortalInjector {
    const injectorToken = new WeakMap();
    injectorToken.set(SUMMARY_BAR_DATA, data);

    return new PortalInjector(this.injector, injectorToken);
  }
}
