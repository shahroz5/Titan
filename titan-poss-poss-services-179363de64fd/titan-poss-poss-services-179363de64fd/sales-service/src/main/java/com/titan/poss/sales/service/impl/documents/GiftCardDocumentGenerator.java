/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.documents;

import java.text.SimpleDateFormat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.NumberToWordsFactory;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.constants.ApplicableTransactionTypes;
import com.titan.poss.sales.dto.print.GiftCardPrintDto;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.factory.DocumentFactory;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.CashMemoGiftService;
import com.titan.poss.sales.service.DocumentGenerator;
import com.titan.poss.sales.utils.SalesUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class GiftCardDocumentGenerator extends SalesDocumentGenerator implements DocumentGenerator {

	@Autowired
	private CashMemoGiftService giftService;

	@Autowired
	NumberToWordsFactory numberToWordsFactory;
	
	@Autowired
	private SalesTxnRepositoryExt salesTxnRepo;


	public GiftCardDocumentGenerator(DocumentFactory documentFactory) {
		documentFactory.registerDocumentService(PrintDocumentTypeEnum.GC.name(), PrintFileTypeEnum.INVOICE_PRINT.name(),
				this);
	}

	@Override
	public PrintableDto getPrintableDto(String txnId, String productCode) {

		GiftCardPrintDto gcPrint = new GiftCardPrintDto();

		String txnLocationCode = CommonUtil.getStoreCode();
		SalesTxnDao st = getSalesTxn(txnId, txnLocationCode);

		gcPrint.setStoreDetails(getStoreDetails());
		gcPrint.setCustomerMasterId(getCustomerId(st.getCustomerId(),null));
		gcPrint.setCust(getCustomerDetails(txnId, txnLocationCode));

		gcPrint.setCm(getCashMemo(txnId, txnLocationCode));
		SimpleDateFormat timeStamp = new SimpleDateFormat("hh:mm a");
		gcPrint.setTimeStamp(timeStamp.format(gcPrint.getCm().getConfirmedTime()).toLowerCase());;

		gcPrint.setItemDetails(giftService.getGiftsInCashMemo(txnId));

		gcPrint.setPriceInWords(SalesUtil.addHyphen(numberToWordsFactory.getPriceInWords(gcPrint.getCm().getFinalValue().longValue(),
				DomainConstants.ASIAN_PRICE_TYPE)));
		gcPrint.setPaymentDetails(listConfirmedPayments(txnId, txnLocationCode));
		// set customer digital signature
		gcPrint.setCustSignature(setCustDigitalSignature(gcPrint.getCust().getMobileNumber(),
				ApplicableTransactionTypes.GIFTCARD, gcPrint.getCust().getCustomerType()));
		// set cashier digital signature
		gcPrint.setCashierSignature(setCashierDigitalSignature(gcPrint.getCm().getEmployeeCode()));
		//increaseSalesPrintCount(txnId);
		gcPrint.setPrints(getPrints(txnId));

		return gcPrint;
	}

	@Override
	public PrintableDto getDto() {
		return new GiftCardPrintDto();
	}
	
	private String getPrints(String txnId) {
		SalesTxnDaoExt sales = salesTxnRepo.findByIdAndLocationCodeAndStatus(txnId, CommonUtil.getLocationCode(),
				TransactionStatusEnum.CONFIRMED.name());
		Integer printCount = 0;
		printCount = sales.getPrints()+ sales.getEmailPrints();
		System.out.println("Prints"+printCount);
		if(printCount > 0) {
			return "OFFICE COPY";
		}
		return "CUSTOMER COPY";
	}

	@Override
	public PrintableDto getPrintableto(PrintRequestDto printRequest) {
		// TODO Auto-generated method stub
		return null;
	}

}
