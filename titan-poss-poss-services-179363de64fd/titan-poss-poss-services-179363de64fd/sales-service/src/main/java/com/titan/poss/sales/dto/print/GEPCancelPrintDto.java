/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.print;

import java.util.List;

import com.titan.poss.core.domain.constant.DocumentBucketEnum;
import com.titan.poss.core.dto.EinvoiceDto;
import com.titan.poss.core.dto.StorePrintDetailsDto;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.sales.constants.FtlTemplateName;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.dto.CustomerDocumentDto;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.response.CustomerPrintDto;

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
public class GEPCancelPrintDto implements PrintableDto {

	StorePrintDetailsDto storeDetails;
	CustomerPrintDto cust;
	String customerMasterId;
	String priceInWords;

	ReturnDto returns;
	ReturnSalesTxnDto sales;

	private EinvoiceDto einvoice;
	private String custSignature;

	private String prints;

	@Override
	public CustomerDocumentDto getDocumentDetails() {

		CustomerDocumentDto customerDocument = new CustomerDocumentDto();

		customerDocument.setBusinessDate(returns.getDocDate());
		customerDocument.setCustomerMasterId(customerMasterId);
		customerDocument.setCustomerId(returns.getCustomerId());
		customerDocument.setLocationCode(CommonUtil.getLocationCode());
		customerDocument.setIsSynced(Boolean.FALSE);
		customerDocument.setDocumentType(PrintDocumentTypeEnum.GEP_CANCEL.name());
		customerDocument.setFileType(PrintFileTypeEnum.INVOICE_PRINT.name());
		customerDocument.setDocumentSubType(DocumentBucketEnum.CUSTOMER_TRANSACTION.name());
		customerDocument.setTxnId(returns.getId());
		customerDocument.setDocumentPath(generateFilePath(customerDocument));
		customerDocument.setCustSignature(custSignature);		

		return customerDocument;

	}

	@Override
	public List<String> getTemplateName() {
		return List.of(FtlTemplateName.GEP_CANCEL_INVOICE_PRINT);
	}

}
