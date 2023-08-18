/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.documents;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.EinvoiceTransactionTypeEnum;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.NumberToWordsFactory;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CancelDao;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.constants.ApplicableTransactionTypes;
import com.titan.poss.sales.dto.print.GoodsReturnPrintDto;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.factory.DocumentFactory;
import com.titan.poss.sales.repository.CancellationRepository;
import com.titan.poss.sales.repository.CancellationRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.DocumentGenerator;
import com.titan.poss.sales.service.GoodsReturnService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class GoodsReturnDocumentGenerator extends SalesDocumentGenerator implements DocumentGenerator {

	@Autowired
	GoodsReturnService grnService;

	@Autowired
	CancellationRepositoryExt cancelRepo;

	@Autowired
	NumberToWordsFactory numberToWordsFactory;
	
	

	public GoodsReturnDocumentGenerator(DocumentFactory documentFactory) {
		documentFactory.registerDocumentService(PrintDocumentTypeEnum.GRN.name(),
				PrintFileTypeEnum.INVOICE_PRINT.name(), this);
	}

	@Override
	public PrintableDto getPrintableDto(String txnId, String productCode) {

		GoodsReturnPrintDto print = grnService.getPrintInfo(txnId);

		Optional<CancelDaoExt> cancel = cancelRepo.findById(txnId);
		if (cancel != null)
			print.setRemarks(cancel.get().getReasonForCancellation());
		print.setStoreDetails(getStoreDetails());
		print.setCustomerMasterId(getCustomerId(print.getCm().getCustomerId(), print.getCm().getLocationCode()));
		print.setCust(getCustomerDetails(print.getCm().getId(), print.getCm().getLocationCode()));

		print.setPriceInWords(numberToWordsFactory.getPriceInWords(print.getRefund().getGrnValue().longValue(),
				DomainConstants.ASIAN_PRICE_TYPE));

		// e-invoice set
		print.setEinvoice(setEinvoiceByTxnId(txnId, EinvoiceTransactionTypeEnum.GRN));

		// set customer digital signature
		print.setCustSignature(setCustDigitalSignature(print.getCust().getMobileNumber(),
				ApplicableTransactionTypes.GRN, print.getCust().getCustomerType()));

		// set cashier digital signature
		print.setCashierSignature(setCashierDigitalSignature(print.getCm().getEmployeeCode()));
		// increase print count
		increaseCancelPrintCount(txnId);
		print.setPrints(getPrints(txnId));

		return print;
	}
	
	private String getPrints(String txnId) {
		Optional<CancelDaoExt> cancels = cancelRepo.findById(txnId);
		Short printCount = 0;
		
		if (cancels.isPresent()) {
			CancelDaoExt cancel = cancels.get();
			printCount = cancel.getPrints();
		
		}
		if(printCount > 0) {
			return "OFFICE COPY";
		}
		return "CUSTOMER COPY";
	}


	@Override
	public PrintableDto getDto() {
		return new GoodsReturnPrintDto();
	}

	@Override
	public PrintableDto getPrintableto(PrintRequestDto printRequest) {
		// TODO Auto-generated method stub
		return null;
	}

}
