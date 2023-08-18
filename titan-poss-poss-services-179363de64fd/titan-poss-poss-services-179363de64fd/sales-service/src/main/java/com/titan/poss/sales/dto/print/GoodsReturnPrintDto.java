/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.print;

import java.util.Date;
import java.util.List;

import com.titan.poss.core.domain.constant.DocumentBucketEnum;
import com.titan.poss.core.dto.EinvoiceDto;
import com.titan.poss.core.dto.StorePrintDetailsDto;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.sales.constants.FtlTemplateName;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.dto.CNLiteDto;
import com.titan.poss.sales.dto.CustomerDocumentDto;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.response.CashMemoResponseDto;
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
public class GoodsReturnPrintDto implements PrintableDto {

	private StorePrintDetailsDto storeDetails;
	private CustomerPrintDto cust;
	private String customerMasterId;
	private String priceInWords;

	private Date businessDate;
	private String businessDateStr;
	private CashMemoResponseDto cm;

	private GRNReturnHeaderInfo refund;

	private String remarks;
	private String grnBusinessDateStr;

	private List<GRNItemPrintDto> items;

	private CNLiteDto cn;

	private EinvoiceDto einvoice;

	private String custSignature;

	private String cashierSignature;
	
	private String prints;

	@Override
	public CustomerDocumentDto getDocumentDetails() {

		CustomerDocumentDto customerDocument = new CustomerDocumentDto();

		customerDocument.setBusinessDate(businessDate);
		customerDocument.setCustomerMasterId(customerMasterId);
		customerDocument.setCustomerId(cm.getCustomerId());
		customerDocument.setLocationCode(CommonUtil.getLocationCode());
		customerDocument.setIsSynced(Boolean.FALSE);
		customerDocument.setDocumentType(PrintDocumentTypeEnum.GRN.name());
		customerDocument.setFileType(PrintFileTypeEnum.INVOICE_PRINT.name());
		customerDocument.setDocumentSubType(DocumentBucketEnum.CUSTOMER_TRANSACTION.name());
		customerDocument.setTxnId(refund.getId());
		customerDocument.setDocumentPath(generateFilePath(customerDocument));
		customerDocument.setCustSignature(custSignature);
		customerDocument.setCashierSignature(cashierSignature);

		return customerDocument;
	}

	@Override
	public List<String> getTemplateName() {
		return List.of(FtlTemplateName.GRN_INVOICE_PRINT);
	}

}
