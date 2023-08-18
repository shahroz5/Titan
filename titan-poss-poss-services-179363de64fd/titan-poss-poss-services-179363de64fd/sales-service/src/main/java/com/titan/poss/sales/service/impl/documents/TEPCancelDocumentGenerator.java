/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.documents;

import java.math.RoundingMode;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.NumberToWordsFactory;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CancelDao;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.constants.ApplicableTransactionTypes;
import com.titan.poss.sales.dto.constants.TxnTypeCancelEnum;
import com.titan.poss.sales.dto.print.ReturnDto;
import com.titan.poss.sales.dto.print.TEPCancelPrintDto;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.factory.DocumentFactory;
import com.titan.poss.sales.repository.CancellationRepository;
import com.titan.poss.sales.repository.CancellationRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.CancellationService;
import com.titan.poss.sales.service.CommonCashMemoService;
import com.titan.poss.sales.service.DocumentGenerator;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class TEPCancelDocumentGenerator extends SalesDocumentGenerator implements DocumentGenerator {

	public TEPCancelDocumentGenerator(DocumentFactory documentFactory) {
		documentFactory.registerDocumentService(PrintDocumentTypeEnum.TEP_CANCEL.name(),
				PrintFileTypeEnum.INVOICE_PRINT.name(), this);
	}

	@Autowired
	private CancellationService cancelService;

	@Autowired
	NumberToWordsFactory numberToWordsFactory;

	@Autowired
	private CommonCashMemoService commonCMService;
	
	@Autowired
	CancellationRepositoryExt cancelRepoExt;

	@Autowired
	CancellationRepository cancelRepo;
	
	private static final String ERR_SALE_070 = "ERR-SALE-070";
	private static final String RECORD_NOT_FOUND = "Record not found.";

	@Override
	public PrintableDto getPrintableDto(String txnId, String productCode) {

		TEPCancelPrintDto print = new TEPCancelPrintDto();

		print.setReturns(getHeaderPrintInfo(txnId, TxnTypeCancelEnum.TEPCAN));
		print.setSales(commonCMService.getSalesPrintInfo(print.getReturns().getSalesTxnId()));

		print.setStoreDetails(getStoreDetails());
		print.setCustomerMasterId(getCustomerId(print.getReturns().getCustomerId(),null));
		print.setCust(getCustomerDetails(print.getReturns().getSalesTxnId(), print.getReturns().getLocationCode()));

		print.getReturns().setTotalValue(print.getReturns().getTotalValue().setScale(0, RoundingMode.HALF_UP));
		
		print.setPriceInWords(numberToWordsFactory.getPriceInWords(print.getReturns().getTotalValue().longValue(),
				DomainConstants.ASIAN_PRICE_TYPE));
		// set customer digital signature
		print.setCustSignature(setCustDigitalSignature(print.getCust().getMobileNumber(),
				ApplicableTransactionTypes.TEPDECLARATION, print.getCust().getCustomerType()));
		// set cashier digital signature
		print.setCashierSignature(setCashierDigitalSignature(null));
		// increase print count
		//increaseCancelPrintCount(txnId);
		print.setPrints(getPrints(txnId));
		return print;
	}
	
	public ReturnDto getHeaderPrintInfo(String txnId, TxnTypeCancelEnum txnType) {

		Optional<CancelDaoExt> cancels = cancelRepoExt.findByRefSalesTxnIdAndTxnTypeAndLocationCodeAndStatus(txnId, txnType.name(),
				CommonUtil.getStoreCode(), TransactionStatusEnum.CONFIRMED.name());

		if (!cancels.isPresent())
			throw new ServiceException(RECORD_NOT_FOUND, ERR_SALE_070);

		CancelDaoExt cancel = cancels.get();
		ReturnDto returns = (ReturnDto) MapperUtil.getDtoMapping(cancel, ReturnDto.class);
		returns.setDocDateStr(CalendarUtils.formatToPrintableDate(returns.getDocDate()));
		returns.setSalesTxnId(cancel.getRefSalesTxn().getId());
		returns.setRemarks(cancel.getReasonForCancellation());
		return returns;

	}
	private String getPrints(String txnId) {
		Optional<CancelDao> cancels = cancelRepo.findById(txnId);
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
		return new TEPCancelPrintDto();
	}

	@Override
	public PrintableDto getPrintableto(PrintRequestDto printRequest) {
		// TODO Auto-generated method stub
		return null;
	}

}
