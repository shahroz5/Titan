package com.titan.poss.sales.service.impl.documents;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.enums.CNStatus;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.NumberToWordsFactory;
import com.titan.poss.sales.constants.CancellationTypeEnum;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CancelDao;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerLocationMappingIdDao;
import com.titan.poss.sales.dao.PaymentReversalDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.constants.ApplicableTransactionTypes;
import com.titan.poss.sales.dto.constants.SubTxnTypeCancelEnum;
import com.titan.poss.sales.dto.print.GcCnPrintDto;
import com.titan.poss.sales.dto.print.GcReturnPrintDto;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.factory.DocumentFactory;
import com.titan.poss.sales.repository.CancellationRepository;
import com.titan.poss.sales.repository.CancellationRepositoryExt;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.CustomerLocationMappingRepositoryExt;
import com.titan.poss.sales.repository.PaymentReversalRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.DocumentGenerator;
import com.titan.poss.sales.service.impl.BusinessDayServiceImpl;
@Service("gcReturnDocumentGenerator")
public class GcReturnDocumentGenerator extends SalesDocumentGenerator implements DocumentGenerator {
	@Autowired
	private BusinessDayServiceImpl businessDayService;

	@Autowired
	private CustomerLocationMappingRepositoryExt customerRepo;
	
	@Autowired
	NumberToWordsFactory numberToWordsFactory;
	
	@Autowired
	private CancellationRepositoryExt cancelRepo;

	
	@Autowired
	private PaymentReversalRepositoryExt paymentReveralRep;
	
//	@Autowired
//	private CreditNoteRepositoryExt creditNoteRepo;

	@Autowired
	private CancellationRepository cancel;
	
	public GcReturnDocumentGenerator(DocumentFactory documentFactory) {
		documentFactory.registerDocumentService(PrintDocumentTypeEnum.GC_WITH_RETURN.name(), PrintFileTypeEnum.INVOICE_PRINT.name(),
				this);
	}
	
	@Override
	public PrintableDto getPrintableDto(String txnId, String id) {
		return getftlBindingObjectForGcReturn(txnId);
	}

	private PrintableDto getftlBindingObjectForGcReturn(String txnId) {
		SimpleDateFormat docDate = new SimpleDateFormat("dd/MM/yyyy");
		GcReturnPrintDto gcReturn=new GcReturnPrintDto();
		CancelDaoExt cancel=cancelRepo.findOneByIdAndLocationCode(txnId,CommonUtil.getStoreCode());
		if(cancel==null || !(CancellationTypeEnum.CANCEL_WITH_RETURN.name().equals(cancel.getCancellationType())) || !(TransactionStatusEnum.CONFIRMED.name().equals(cancel.getStatus()))||!(SubTxnTypeCancelEnum.GIFT_SALE.name().equals(cancel.getSubTxnType()))) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048);
		}
		List<PaymentReversalDaoExt> paymentRefunds = paymentReveralRep.findByCancelId(txnId);
		BigDecimal amount = BigDecimal.ZERO;
		for(PaymentReversalDaoExt payment : paymentRefunds) {
			amount = amount.add(payment.getAmount());
		}

		gcReturn.setStoreDetails(getStoreDetails());
		gcReturn.setDocDate(docDate.format(cancel.getDocDate()));
		gcReturn.setCustomer(getCustomerDetails(cancel.getRefSalesTxn().getId(), CommonUtil.getLocationCode()));
		gcReturn.setCustomerId(cancel.getRefSalesTxn().getCustomerId());
		gcReturn.setCustomerMasterId(getCustomerId(cancel.getCustomerId(),null));
		gcReturn.setTxnType(cancel.getRefSalesTxn().getTxnType());
		gcReturn.setLocationCode(cancel.getRefSalesTxn().getLocationCode());
		gcReturn.setDocNo(cancel.getRefSalesTxn().getDocNo());
		gcReturn.setTotalValue(amount);
		gcReturn.setPriceInWords(numberToWordsFactory.getPriceInWords(
		amount.longValue(), DomainConstants.ASIAN_PRICE_TYPE));
		gcReturn.setBusinessDate(businessDayService.getBusinessDay().getBusinessDate());
		gcReturn.setPrints(getPrints(txnId));
		gcReturn.setPvDocNo(paymentRefunds.get(0).getPaymentVoucherNo());
		
//set cashier digital signature
		gcReturn.setCashierSignature(setCashierDigitalSignature(cancel.getRefSalesTxn().getEmployeeCode()));
		return gcReturn;
	}
	
	private String getPrints(String txnId) {
		Optional<CancelDao> cancels = cancel.findById(txnId);
		Short printCount = 0;
		
		if (cancels.isPresent()) {
			CancelDao cancel = cancels.get();
			printCount = cancel.getPrints();
		
		}
		if(printCount > 0) {
			return "OFFICE COPY";
		}
		return "CUSTOMER COPY";
	}
		

	@Override
	public PrintableDto getDto() {
		return new GcReturnPrintDto();
	}

	@Override
	public PrintableDto getPrintableto(PrintRequestDto printRequest) {
		// TODO Auto-generated method stub
		return null;
	}

}
