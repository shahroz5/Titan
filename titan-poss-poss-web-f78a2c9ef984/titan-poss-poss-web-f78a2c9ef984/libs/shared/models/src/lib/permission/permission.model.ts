import { Renderer2, TemplateRef } from '@angular/core';

export interface PermissionData {
  transactionCodes: string[];
  authorisedStrategy: string;
  unAuthorisedStrategy: string;
}

export type StrategyFunction = (
  renderer: Renderer2,
  templateRef: TemplateRef<any>
) => void;
