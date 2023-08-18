/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.print;

import java.util.Date;
import java.util.List;

import com.titan.poss.core.domain.constant.DocumentBucketEnum;
import com.titan.poss.core.dto.StorePrintDetailsDto;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.sales.constants.FtlTemplateName;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.dto.CustomerDocumentDto;
import com.titan.poss.sales.dto.GiftDetailsDto;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.response.CashMemoResponseDto;
import com.titan.poss.sales.dto.response.CustomerPrintDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class GiftCardPrintDto implements PrintableDto {

	private StorePrintDetailsDto storeDetails;
	private CustomerPrintDto cust;

	private String customerMasterId;
	private Date businessDate;
	private String businessDateStr;

	private String priceInWords;

	private List<SalesPaymentDto> paymentDetails;
	private CashMemoResponseDto cm;
	private List<GiftDetailsDto> itemDetails;
	private String custSignature;
	private String cashierSignature;
	private String prints;
	private String timeStamp;


	@Override
	public CustomerDocumentDto getDocumentDetails() {

		CustomerDocumentDto customerDocument = new CustomerDocumentDto();

		customerDocument.setBusinessDate(businessDate);
		customerDocument.setCustomerMasterId(customerMasterId);
		customerDocument.setCustomerId(cm.getCustomerId());
		customerDocument.setLocationCode(CommonUtil.getLocationCode());
		customerDocument.setIsSynced(Boolean.FALSE);
		customerDocument.setDocumentType(PrintDocumentTypeEnum.GC.name());
		customerDocument.setFileType(PrintFileTypeEnum.INVOICE_PRINT.name());
		customerDocument.setDocumentSubType(DocumentBucketEnum.CUSTOMER_TRANSACTION.name());
		customerDocument.setTxnId(cm.getId());
		customerDocument.setDocumentPath(generateFilePath(customerDocument));
		customerDocument.setCustSignature(custSignature);		
		customerDocument.setCashierSignature(cashierSignature);

		return customerDocument;
	}

	@Override
	public List<String> getTemplateName() {
		return List.of(FtlTemplateName.GC_INVOICE_PRINT);
	}

}
