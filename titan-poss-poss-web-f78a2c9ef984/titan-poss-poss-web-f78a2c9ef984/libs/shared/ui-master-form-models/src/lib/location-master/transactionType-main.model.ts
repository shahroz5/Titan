import {
  Class,
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType
} from '@poss-web/shared/components/ui-dynamic-form';

import { TransactionTypeAdvanceBookingModel } from './transactionType-advanceBooking.model';
import { TransactionTypeBillCancellationModel } from './transactionType-billCancellation.model';
import { TransactionTypeCashMemoModel } from './transactionType-cashMemo.model';
import { TransactionTypeCreditNotesModel } from './transactionType-creditNotes.model';
import { TransactionTypeCustomerOrderModel } from './transactionType-customerOrder.model';
import { TransactionTypeGEPModel } from './transactionType-gep.model';
import { TransactionTypeGiftCardModel } from './transactionType-giftCard.model';
import { TransactionTypeGRFModel } from './transactionType-grf.model';
import { TransactionTypeGRNModel } from './transactionType-grn.model';
import { TransactionTypeTaxModel } from './transactionType-tax.model';
import { TransactionTypeTepModel } from './transactionType-tep.model';

export class TransactionTypeMainFormModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'Credit Notes',
    hide: false
  })
  private transactionTypeCreditNotesModel: TransactionTypeCreditNotesModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'Tax',
    hide: false
  })
  @Class({ className: ['pw-form-card__flex-4-column'] })
  private transactionTypeTaxModel: TransactionTypeTaxModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'Bill Cancellation',
    hide: false
  })
  @Class({ className: ['pw-form-card__flex-2-column'] })
  private transactionTypeBillCancellationModel: TransactionTypeBillCancellationModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'Cash Memo',
    hide: false
  })
  private transactionTypeCashMemoModel: TransactionTypeCashMemoModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'GRN',
    hide: false
  })
  private transactionTypeGRNModel: TransactionTypeGRNModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'GRF',
    hide: false
  })
  private transactionTypeGRFModel: TransactionTypeGRFModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'GEP',
    hide: false
  })
  private transactionTypeGEPModel: TransactionTypeGEPModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'Gift Card',
    hide: false
  })
  private transactionTypeGiftCardModel: TransactionTypeGiftCardModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'Advance Booking',
    hide: false
  })
  // @Class({ className: ['pw-form-card__flex-3-column'] })
  private transactionTypeAdvanceBookingModel: TransactionTypeAdvanceBookingModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'Customer Order',
    hide: false
  })
  // @Class({ className: ['pw-form-card__flex-3-column'] })
  private transactionTypeCustomerOrderModel: TransactionTypeCustomerOrderModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'TEP',
    hide: false
  })
  @Class({ className: ['pw-form-card__flex-3-column'] })
  private transactionTypeTepModel: TransactionTypeTepModel;

  constructor(
    id: number,
    transactionTypeCreditNotesModel: TransactionTypeCreditNotesModel,
    transactionTypeTaxModel: TransactionTypeTaxModel,
    transactionTypeBillCancellationModel: TransactionTypeBillCancellationModel,
    transactionTypeCashMemoModel: TransactionTypeCashMemoModel,
    transactionTypeGRNModel: TransactionTypeGRNModel,
    transactionTypeGRFModel: TransactionTypeGRFModel,
    transactionTypeGEPModel: TransactionTypeGEPModel,
    transactionTypeGiftCardModel: TransactionTypeGiftCardModel,
    transactionTypeAdvanceBookingModel: TransactionTypeAdvanceBookingModel,
    transactionTypeCustomerOrderModel: TransactionTypeCustomerOrderModel,
    transactionTypeTepModel: TransactionTypeTepModel
  ) {
    super();
    this.id = id;
    this.transactionTypeCreditNotesModel = transactionTypeCreditNotesModel;
    this.transactionTypeTaxModel = transactionTypeTaxModel;
    this.transactionTypeBillCancellationModel = transactionTypeBillCancellationModel;
    this.transactionTypeCashMemoModel = transactionTypeCashMemoModel;
    this.transactionTypeGRNModel = transactionTypeGRNModel;
    this.transactionTypeGRFModel = transactionTypeGRFModel;
    this.transactionTypeGEPModel = transactionTypeGEPModel;
    this.transactionTypeGiftCardModel = transactionTypeGiftCardModel;
    this.transactionTypeAdvanceBookingModel = transactionTypeAdvanceBookingModel;
    this.transactionTypeCustomerOrderModel = transactionTypeCustomerOrderModel;
    this.transactionTypeTepModel = transactionTypeTepModel;
  }
}
