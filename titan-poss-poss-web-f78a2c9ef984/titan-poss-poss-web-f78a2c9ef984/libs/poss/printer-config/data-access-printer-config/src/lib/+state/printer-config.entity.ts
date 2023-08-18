import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { PrinterConfigDetails } from '@poss-web/shared/models';

export interface PrinterConfigEntity extends EntityState<PrinterConfigDetails> {}
export const PrinterConfigAdapter = createEntityAdapter<PrinterConfigDetails>({
  selectId:Printer => Printer.id
});

export const  PrinterConfigSelector = PrinterConfigAdapter.getSelectors();

// Todo add sort by line item number
