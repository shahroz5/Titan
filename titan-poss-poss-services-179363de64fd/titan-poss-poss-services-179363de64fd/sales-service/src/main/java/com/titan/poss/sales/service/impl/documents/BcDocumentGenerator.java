package com.titan.poss.sales.service.impl.documents;

import java.text.SimpleDateFormat;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.enums.CNStatus;
import com.titan.poss.core.enums.CreditNoteDescEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.NumberToWordsFactory;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dto.AddressDetails;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.constants.ApplicableTransactionTypes;
import com.titan.poss.sales.dto.print.BcPrintDto;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.dto.response.CNResponseDto;
import com.titan.poss.sales.dto.response.CustomerPrintDto;
import com.titan.poss.sales.factory.DocumentFactory;
import com.titan.poss.sales.repository.CancellationRepositoryExt;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.service.DocumentGenerator;
import com.titan.poss.sales.service.impl.BusinessDayServiceImpl;
import com.titan.poss.sales.service.impl.CustomerServiceImpl;

@Service
public class BcDocumentGenerator extends SalesDocumentGenerator implements DocumentGenerator {
	@Autowired
	private BusinessDayServiceImpl businessDayService;

	@Autowired
	NumberToWordsFactory numberToWordsFactory;

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepo;
	
	@Autowired
	private CancellationRepositoryExt cancelRepo;

	public BcDocumentGenerator(DocumentFactory documentFactory) {
		documentFactory.registerDocumentService(PrintDocumentTypeEnum.BILL_CANCELLATION.name(),
				PrintFileTypeEnum.INVOICE_PRINT.name(), this);
		documentFactory.registerDocumentService(PrintDocumentTypeEnum.CREDIT_NOTE.name(),
				PrintFileTypeEnum.INVOICE_PRINT.name(), this);
	}

	@Override
	public PrintableDto getPrintableDto(String txnId, String id) {

		return getftlBindingObjectForBc(txnId, id);
	}

	private BcPrintDto getftlBindingObjectForBc(String txnId, String id) {
		BcPrintDto bcPrint = new BcPrintDto();
		CancelDaoExt cancel = null;
		
		if (txnId == null || id == null) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "Necessary request parameters not found"));
		}

		CreditNoteDaoExt creditNote = creditNoteRepo.findByIdAndLocationCode(id, CommonUtil.getStoreCode());

		if (creditNote == null) {
			throw new ServiceException(SalesConstants.CREDIT_NOTE_NOT_FOUND, SalesConstants.ERR_SALE_154);
		}
		if (PrintDocumentTypeEnum.BILL_CANCELLATION.name().equals(creditNote.getCreditNoteType())) {
			if(!txnId.equals(creditNote.getCancelTxn().getId())) {
				throw new ServiceException(SalesConstants.CREDIT_NOTE_NOT_FOUND, SalesConstants.ERR_SALE_154,
						"Credit Note does not belong to the current transaction " + txnId);
			}
			else {
				 cancel = cancelRepo.findOneByIdAndLocationCode(txnId, CommonUtil.getStoreCode());
			}
		}
		if (!(CNStatus.OPEN.name().equals(creditNote.getStatus()) || CNStatus.TRANSFER_IBT.name().equals(creditNote.getStatus()))) {
			throw new ServiceException(SalesConstants.CREDIT_NOTE_DYNAMIC_NUMBER_SHOULD_BE_IN_OPEN_STATUS,
					SalesConstants.ERR_SALE_157, "Credit note used for print should be in OPEN status.",
					Map.of(SalesConstants.DOC_NO, creditNote.getDocNo().toString()));
		}

		SimpleDateFormat docDate = new SimpleDateFormat("dd/MM/yyyy");
		
		if (CreditNoteDescEnum.valueOfEnum(creditNote.getCreditNoteType()) != null) {
			CreditNoteDescEnum creditNoteDesc = CreditNoteDescEnum
					.valueOf(creditNote.getCreditNoteType().toUpperCase());
			bcPrint.setHeader("CREDIT NOTE "+creditNoteDesc.getValue());
		}
		
		bcPrint.setCnResponseDto(mapCnResponse(creditNote));
		
		bcPrint.setDocDate(docDate.format(bcPrint.getCnResponseDto().getDocDate()));
		if (cancel != null) {
			bcPrint.setLocationCode(cancel.getRefSalesTxn().getLocationCode());
			bcPrint.setDocNo(cancel.getRefSalesTxn().getDocNo());
			bcPrint.setTxnType(cancel.getRefSalesTxn().getTxnType());
		}
		
		bcPrint.setLocationCode(creditNote.getLocationCode());
		bcPrint.setDocNo(creditNote.getDocNo());
		bcPrint.setTxnType(creditNote.getCreditNoteType());
		bcPrint.setStoreDetails(getStoreDetails());
		bcPrint.setCustomer(getCustomerDetailsByCustomerId(creditNote.getCustomerId()));
		bcPrint.setPriceInWords(numberToWordsFactory.getPriceInWords(bcPrint.getCnResponseDto().getAmount().longValue(),
				DomainConstants.ASIAN_PRICE_TYPE));
		bcPrint.setCustomerMasterId(getCustomerId(bcPrint.getCnResponseDto().getCustomerId(),null));
		bcPrint.setBusinessDate(businessDayService.getBusinessDay().getBusinessDate());
		// set customer digital signature
		bcPrint.setCustSignature(setCustDigitalSignature(bcPrint.getCustomer().getMobileNumber(),
				ApplicableTransactionTypes.CNCANCELLATION, bcPrint.getCustomer().getCustomerType()));

		// set cashier digital signature
		bcPrint.setCashierSignature(setCashierDigitalSignature(creditNote.getSalesTxn().getEmployeeCode()));
		bcPrint.setPrints(getPrints(id));
		bcPrint.setId(txnId);
		return bcPrint;
	}
	private String getPrints(String id) {
		CreditNoteDaoExt cn = creditNoteRepo.findByIdAndLocationCode(id, CommonUtil.getLocationCode());
		
		if(cn.getPrints() > 0) {
			return "OFFICE COPY";
		}
		return "CUSTOMER COPY";
	}


	@Override
	public PrintableDto getDto() {
		return new BcPrintDto();
	}

	private CNResponseDto mapCnResponse(CreditNoteDaoExt creditNoteDaoExt) {
		CNResponseDto creditNote = new CNResponseDto();
		creditNote.setId(creditNoteDaoExt.getId());
		creditNote.setDocNo(creditNoteDaoExt.getRefDocNo());
		creditNote.setFiscalYear(creditNoteDaoExt.getFiscalYear());

		creditNote.setCustomerId(creditNoteDaoExt.getCustomerId());
		creditNote.setLocationCode(creditNoteDaoExt.getLocationCode());
		creditNote.setCreditNoteType(creditNoteDaoExt.getCreditNoteType());
		creditNote.setDocDate(creditNoteDaoExt.getDocDate());
		creditNote.setAmount(creditNoteDaoExt.getAmount());
		creditNote.setStatus(creditNoteDaoExt.getStatus());

		creditNote.setWorkflowStatus(creditNoteDaoExt.getWorkflowStatus());
		creditNote.setFrozenRateDetails(MapperUtil.getJsonFromString(creditNoteDaoExt.getFrozenRateDetails()));
		creditNote.setUtilisedAmount(creditNoteDaoExt.getUtilisedAmount());
		creditNote.setCashCollected(creditNoteDaoExt.getCashCollected());
		
		if (creditNoteDaoExt.getParentCn() != null
				&& creditNoteDaoExt.getId() != creditNoteDaoExt.getParentCn().getId()) {
			CreditNoteDaoExt oldCNNo = creditNoteRepo.findOneById(creditNoteDaoExt.getParentCn().getId());
			if (oldCNNo != null) {
				creditNote.setRefDocNo(oldCNNo.getDocNo());
				creditNote.setRefFiscalYear(oldCNNo.getRefFiscalYear());
			}
		}
		
		creditNote.setRefDocType(creditNoteDaoExt.getRefDocType());
		return creditNote;

	}

	@Override
	public PrintableDto getPrintableto(PrintRequestDto printRequest) {
		return null;
	}
}
