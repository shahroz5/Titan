package com.titan.poss.sales.service.impl.documents;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.enums.CustomerTypeEnum;
import com.titan.poss.core.enums.CNStatus;
import com.titan.poss.core.enums.CreditNoteDescEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.NumberToWordsFactory;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.PaymentReversalDaoExt;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.constants.ApplicableTransactionTypes;
import com.titan.poss.sales.dto.print.CreditNoteCancellationPrintDto;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.factory.DocumentFactory;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.PaymentReversalRepositoryExt;
import com.titan.poss.sales.service.DocumentGenerator;
import com.titan.poss.sales.service.impl.BusinessDayServiceImpl;
import com.titan.poss.sales.utils.SalesUtil;

@Service
public class PaymentVoucherDocumentGenerator extends SalesDocumentGenerator implements DocumentGenerator {

	@Autowired
	private BusinessDayServiceImpl businessDayService;

	@Autowired
	NumberToWordsFactory numberToWordsFactory;

	@Autowired
	private PaymentReversalRepositoryExt paymentReveralRep;

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepo;

	public PaymentVoucherDocumentGenerator(DocumentFactory documentFactory) {
		documentFactory.registerDocumentService(PrintDocumentTypeEnum.CREDIT_NOTE_CANCELLATION.name(),
				PrintFileTypeEnum.INVOICE_PRINT.name(), this);
	}

	@Override
	public PrintableDto getPrintableDto(String txnId, String id) {
		return getftlBindingObjectForCNCancel(txnId);
	}

	private PrintableDto getftlBindingObjectForCNCancel(String id) {
		SimpleDateFormat docDate = new SimpleDateFormat("dd/MM/yyyy");
				
		CreditNoteCancellationPrintDto creditNoteCancel = new CreditNoteCancellationPrintDto();
		CreditNoteDaoExt creditNote = creditNoteRepo.findByIdAndLocationCode(id, CommonUtil.getLocationCode());

		if (creditNote == null) {
			throw new ServiceException(SalesConstants.CREDIT_NOTE_NOT_FOUND, SalesConstants.ERR_SALE_154);
		}
		
		if (!(CNStatus.CANCELLED.name().equals(creditNote.getStatus()))) {
			throw new ServiceException(SalesConstants.CREDIT_NOTE_DYNAMIC_NUMBER_SHOULD_BE_IN_OPEN_STATUS,
					SalesConstants.ERR_SALE_157, "Credit note used for print should be in OPEN status.",
					Map.of(SalesConstants.DOC_NO, creditNote.getDocNo().toString()));
		}

		creditNoteCancel.setDebitNoteDocNo(creditNote.getRefDocNo());
		creditNoteCancel.setDebitNoteFiscalYear(creditNote.getRefFiscalYear());
		creditNoteCancel.setCreditNoteType(creditNote.getCreditNoteType());
		if (CreditNoteDescEnum.valueOfEnum(creditNote.getCreditNoteType()) != null) {
			CreditNoteDescEnum creditNoteDesc = CreditNoteDescEnum
					.valueOf(creditNote.getCreditNoteType().toUpperCase());
			creditNoteCancel.setTxnType(creditNoteDesc.getValue());
		}
		
		PaymentReversalDaoExt paymentReversal = paymentReveralRep.findByCreditNoteId(id);
		if (paymentReversal != null) {
			creditNoteCancel.setPvPaymentMode(paymentReversal.getPaymentCode());
			creditNoteCancel.setInstrumentNo(paymentReversal.getInstrumentNo());
		}
			
		
		BigDecimal netRefundValue = creditNote.getAmount().subtract(creditNote.getRefundDeduction());
		creditNoteCancel.setNetRefundValue(netRefundValue.setScale(0,BigDecimal.ROUND_UP));
		if(creditNoteCancel.getNetRefundValue().compareTo(creditNote.getAmount()) < 0) {
			creditNoteCancel.setTotalValue(creditNote.getAmount());		
			creditNoteCancel.setRefundDeduction(creditNote.getRefundDeduction());
		}
		
		creditNoteCancel.setDocDate(docDate.format(creditNote.getDocDate()));
		creditNoteCancel.setLocationCode(creditNote.getLocationCode());
        creditNoteCancel.setDocNo(creditNote.getDocNo());
        creditNoteCancel.setInstrumentDate(creditNote.getOriginalDocDate());
		creditNoteCancel.setPriceInWords(SalesUtil
				.addHyphen(numberToWordsFactory.getPriceInWords(creditNoteCancel.getNetRefundValue().longValue(), DomainConstants.ASIAN_PRICE_TYPE)));
		creditNoteCancel.setStoreDetails(getStoreDetails());

		creditNoteCancel.setCustomer(getCustomerDetailsByCustomerId(creditNote.getCustomerId()));

		creditNoteCancel.setCustomerId(creditNote.getCustomerId());
		creditNoteCancel.setCustomerMasterId(getCustomerId(creditNote.getCustomerId(), null));
		creditNoteCancel.setBusinessDate(businessDayService.getBusinessDay().getBusinessDate());
		if (!creditNoteCancel.getCustomer().getCustomerType().equals(CustomerTypeEnum.ONETIME.name())) {
			creditNoteCancel.setCustSignature(setCustDigitalSignature(creditNoteCancel.getCustomer().getMobileNumber(),
					ApplicableTransactionTypes.CNCANCELLATION, creditNoteCancel.getCustomer().getCustomerType()));
		}
		creditNoteCancel.setPrints(getPrints(id));
			    
         //set cashier digital signature
			if (creditNote.getSalesTxn() != null) {
				creditNoteCancel
						.setCashierSignature(setCashierDigitalSignature(creditNote.getSalesTxn().getEmployeeCode()));
			} else {
				creditNoteCancel.setCashierSignature(setCashierDigitalSignature(null));
			}
		return creditNoteCancel;
	}

	private String getPrints(String id) {
		CreditNoteDaoExt cn = creditNoteRepo.findByIdAndLocationCode(id, CommonUtil.getLocationCode());

		if (cn != null && cn.getPrints() != null && cn.getPrints() > 0) {
			return "OFFICE COPY";
		}
		return "CUSTOMER COPY";
	}

	@Override
	public PrintableDto getDto() {
		return new CreditNoteCancellationPrintDto();
	}

	@Override
	public PrintableDto getPrintableto(PrintRequestDto printRequest) {
		return null;
	}
}
