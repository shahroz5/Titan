package com.titan.poss.sales.service.impl.documents;

import java.text.SimpleDateFormat;
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
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.constants.ApplicableTransactionTypes;
import com.titan.poss.sales.dto.constants.SubTxnTypeCancelEnum;
import com.titan.poss.sales.dto.print.GcCnPrintDto;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.dto.response.CNResponseDto;

import com.titan.poss.sales.factory.DocumentFactory;
import com.titan.poss.sales.repository.CancellationRepository;
import com.titan.poss.sales.repository.CancellationRepositoryExt;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.CustomerLocationMappingRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.DocumentGenerator;
import com.titan.poss.sales.service.impl.BusinessDayServiceImpl;
@Service("gcCnDocumentGenerator")
public class GcCnDocumentGenerator extends SalesDocumentGenerator implements DocumentGenerator {

	@Autowired
	private BusinessDayServiceImpl businessDayService;

	@Autowired
	private CustomerLocationMappingRepositoryExt customerRepo;
	
	@Autowired
	NumberToWordsFactory numberToWordsFactory;
	@Autowired
	private CreditNoteRepositoryExt creditNoteRepo;
	@Autowired
	private CancellationRepositoryExt cancelRepo;
	@Autowired
	private CancellationRepository cancel;


	
	public GcCnDocumentGenerator(DocumentFactory documentFactory) {
		documentFactory.registerDocumentService(PrintDocumentTypeEnum.GC_WITH_CN.name(), PrintFileTypeEnum.INVOICE_PRINT.name(),
				this);
	}
	@Override
	public PrintableDto getPrintableDto(String txnId, String id) {
		
		return getftlBindingObjectForGcCn(txnId,id);
	}

	private PrintableDto getftlBindingObjectForGcCn(String txnId,String id) {
		SimpleDateFormat docDate = new SimpleDateFormat("dd/MM/yyyy");
		
		GcCnPrintDto gcCnPrint=new GcCnPrintDto();
		CancelDaoExt cancel=cancelRepo.findOneByIdAndLocationCode(txnId,CommonUtil.getStoreCode());
		if(cancel==null || !(TransactionStatusEnum.CONFIRMED.name().equals(cancel.getStatus()))||!(SubTxnTypeCancelEnum.GIFT_SALE.name().equals(cancel.getSubTxnType()))){
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048);
		}
		
		CreditNoteDaoExt creditNote = creditNoteRepo.findByIdAndLocationCode(id, CommonUtil.getStoreCode());
		
		if(creditNote==null) {
			throw new ServiceException(SalesConstants.CREDIT_NOTE_NOT_FOUND, SalesConstants.ERR_SALE_154);
		}
		if(!txnId.equals(creditNote.getCancelTxn().getId())) {
			throw new ServiceException(SalesConstants.CREDIT_NOTE_NOT_FOUND, SalesConstants.ERR_SALE_154,"Credit Note does not belong to the current transaction "+txnId);
		}
		if(!CNStatus.OPEN.name().equals(creditNote.getStatus())) {
			throw new ServiceException(SalesConstants.CREDIT_NOTE_DYNAMIC_NUMBER_SHOULD_BE_IN_OPEN_STATUS,
					SalesConstants.ERR_SALE_157, "Credit note used for print should be in OPEN status.",
					Map.of(SalesConstants.DOC_NO, creditNote.getDocNo().toString()));
		}
		
		gcCnPrint.setCnLocationCode(creditNote.getLocationCode());
		gcCnPrint.setCndocNo(creditNote.getDocNo());
		gcCnPrint.setDocDate(docDate.format(creditNote.getDocDate()));
		gcCnPrint.setTxnType(cancel.getRefSalesTxn().getTxnType());
		gcCnPrint.setLocationCode(cancel.getRefSalesTxn().getLocationCode());
		gcCnPrint.setDocNo(cancel.getRefSalesTxn().getDocNo());
		gcCnPrint.setTotalValue(creditNote.getAmount());
		gcCnPrint.setPriceInWords(numberToWordsFactory.getPriceInWords(
		creditNote.getAmount().longValue(), DomainConstants.ASIAN_PRICE_TYPE));
		gcCnPrint.setStoreDetails(getStoreDetails());
		gcCnPrint.setCustomer(getCustomerDetails(cancel.getRefSalesTxn().getId(), CommonUtil.getLocationCode()));
		gcCnPrint.setCustomerId(cancel.getRefSalesTxn().getCustomerId());
		gcCnPrint.setCustomerMasterId(getCustomerId(cancel.getCustomerId(),null));
		gcCnPrint.setBusinessDate(businessDayService.getBusinessDay().getBusinessDate());
		gcCnPrint.setCustSignature(setCustDigitalSignature(gcCnPrint.getCustomer().getMobileNumber(),
				ApplicableTransactionTypes.CNCANCELLATION, gcCnPrint.getCustomer().getCustomerType()));
		gcCnPrint.setPrints(getPrints(txnId));
//set cashier digital signature
		gcCnPrint.setCashierSignature(setCashierDigitalSignature(cancel.getRefSalesTxn().getEmployeeCode()));
		return gcCnPrint;
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
		
		return new GcCnPrintDto();
	}
	@Override
	public PrintableDto getPrintableto(PrintRequestDto printRequest) {
		// TODO Auto-generated method stub
		return null;
	}

}
