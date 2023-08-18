/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;

import com.titan.poss.core.domain.constant.DocumentBucketEnum;
import com.titan.poss.core.dto.ItemDetailsDto;
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.sales.constants.FtlTemplateName;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.dao.CreditNoteDao;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dto.CustomerDocumentDto;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.TxnTypeTotalDetailDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdvanceBookingPrintDto implements PrintableDto {

	@Value("${docs.file.source.path}")
	private String fileBasePath;

	private CustomerPrintDto customer;

	private OrderResponseDto order;

	private StoreDetails storeDetails;

	private List<OrderItemDetailsResponseDto> itemDetails;

	private List<SalesPaymentDto> paymentDetails;

	private TxnTypeTotalDetailDto orderTotalDetails;

	private Map<String, ItemDetailsDto> items;

	private String priceInWords;

	private Date businessDate;

	private String customerMasterId;

	private List<CreditNoteDao> creditNotes;

	private String metals;

	private String metalRates;

	private String custSignature;

	private String cashierSignature;

	private String prints;

	private String docDate;

	private String custInfoIsGoldRateFrozen;

	private List<String> employeeNames;

	private List<CreditNoteDaoExt> refundCreditNote;

	private Map<String, CustomerDetailsDto> thirdPartyCNDetails;
	
	private Map<Integer, BigDecimal> billedWeights;
	
	private String transactionType;
	
	private List<String> templates;
	
	private String brandCode;
	
	public AdvanceBookingPrintDto(String txnType){
		transactionType = txnType;
		templates = txnType.equals(PrintDocumentTypeEnum.AB.name()) ? List.of(FtlTemplateName.AB_INVOICE_PRINT) : List.of(FtlTemplateName.CO_INVOICE_PRINT);
	}

	@Override
	public CustomerDocumentDto getDocumentDetails() {
		CustomerDocumentDto customerDocument = new CustomerDocumentDto();

		customerDocument.setBusinessDate(businessDate);
		customerDocument.setCustomerMasterId(customerMasterId);
		customerDocument.setCustomerId(order.getCustomerId());
		customerDocument.setLocationCode(CommonUtil.getLocationCode());
		customerDocument.setIsSynced(Boolean.FALSE);
		customerDocument.setDocumentType(transactionType);
		customerDocument.setFileType(PrintFileTypeEnum.INVOICE_PRINT.name());
		customerDocument.setDocumentSubType(DocumentBucketEnum.CUSTOMER_TRANSACTION.name());
		customerDocument.setTxnId(order.getId());
		customerDocument.setDocumentPath(generateFilePath(customerDocument));
		customerDocument.setCustSignature(custSignature);
		customerDocument.setCashierSignature(cashierSignature);

		return customerDocument;
	}

	@Override
	public List<String> getTemplateName() {
		return templates;
	}

}
