/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.documents;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.NumberToWordsFactory;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.constants.ApplicableTransactionTypes;
import com.titan.poss.sales.dto.print.AdvanceHeaderInfo;
import com.titan.poss.sales.dto.print.RateFreezePrintDto;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.factory.DocumentFactory;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.DocumentGenerator;
import com.titan.poss.sales.utils.SalesUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class RateFreezeDocumentGenerator extends AdvanceDocumentGenerator implements DocumentGenerator {

	@Autowired
	NumberToWordsFactory numberToWordsFactory;
	
	
	@Autowired
	private SalesTxnRepositoryExt salesTxnRepo;

	public RateFreezeDocumentGenerator(DocumentFactory documentFactory) {
		documentFactory.registerDocumentService(PrintDocumentTypeEnum.GRF.name(),
				PrintFileTypeEnum.INVOICE_PRINT.name(), this);
	}

	@Override
	public PrintableDto getPrintableDto(String txnId, String productCode) {

		RateFreezePrintDto printDto = new RateFreezePrintDto();

		String txnLocationCode = CommonUtil.getStoreCode();
		SalesTxnDao st = getRateFrozenSalesTxn(txnId);

		printDto.setStoreDetails(getStoreDetails());
		printDto.setCustomerMasterId(getCustomerId(st.getCustomerId(),null));
		printDto.setCust(getCustomerDetails(txnId, txnLocationCode));

		printDto.setCn(getCnGenerated(txnId));

		AdvanceHeaderInfo adv = (AdvanceHeaderInfo) MapperUtil.getDtoMapping(st, AdvanceHeaderInfo.class);
		printDto.setAdv(adv);

		printDto.setBusinessDateStr(CalendarUtils.formatToPrintableDate(adv.getDocDate()));
		printDto.setPriceInWords(SalesUtil.addHyphen(numberToWordsFactory.getPriceInWords(printDto.getCn().getAmount().longValue(),
				DomainConstants.ASIAN_PRICE_TYPE)));
		printDto.setPaymentDetails(listConfirmedPayments(txnId, txnLocationCode));

		// set customer digital signature
		printDto.setCustSignature(setCustDigitalSignature(printDto.getCust().getMobileNumber(),
				ApplicableTransactionTypes.GRF, printDto.getCust().getCustomerType()));
		// set cashier digital signature
		printDto.setCashierSignature(setCashierDigitalSignature(st.getEmployeeCode()));
		// increase print count
		//increaseSalesPrintCount(txnId);
		
		printDto.setPrints(getPrints(txnId));

		return printDto;
	}
	
	private String getPrints(String txnId) {
		SalesTxnDaoExt sales = salesTxnRepo.findByIdAndLocationCodeAndStatus(txnId, CommonUtil.getLocationCode(),
				TransactionStatusEnum.CONFIRMED.name());
		Integer printCount = 0;
		printCount = sales.getPrints()+ sales.getEmailPrints();
		if(printCount > 0) {
			return "OFFICE COPY";
		}
		return "CUSTOMER COPY";
	}


	@Override
	public PrintableDto getDto() {
		return new RateFreezePrintDto();
	}

	@Override
	public PrintableDto getPrintableto(PrintRequestDto printRequest) {
		// TODO Auto-generated method stub
		return null;
	}

}
