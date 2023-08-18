import { CustomErrors, Lov, PrinterConfigDetails } from '@poss-web/shared/models';
import { PrinterConfigEntity } from './printer-config.entity';

export interface PrinterConfigurationState {
  totalCount: number;
  printerList: PrinterConfigEntity;
  printernameList: string[];
  docType: Lov[];
  printer: PrinterConfigDetails;
  hasError?: CustomErrors;
  isLoading?: boolean;
}
