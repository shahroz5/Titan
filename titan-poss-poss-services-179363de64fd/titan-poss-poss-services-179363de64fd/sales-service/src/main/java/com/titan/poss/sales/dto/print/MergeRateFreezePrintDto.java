/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.print;

import java.util.List;

import com.titan.poss.core.domain.constant.DocumentBucketEnum;
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
public class MergeRateFreezePrintDto implements PrintableDto {

	private StorePrintDetailsDto storeDetails;
	private CustomerPrintDto cust;

	private String customerMasterId;
	private String businessDateStr;

	private String priceInWords;

	private AdvanceHeaderInfo adv;
	private CnGrfLiteDto cn;
	private List<MergedCnGrfLiteDto> mergedCNs;
	private String custSignature;
	private String cashierSignature;
	private String prints;
	
	@Override
	public List<String> getTemplateName() {
		return List.of(FtlTemplateName.MERGE_RATE_FREEZE_PRINT);
	}

	@Override
	public CustomerDocumentDto getDocumentDetails() {

		CustomerDocumentDto customerDocument = new CustomerDocumentDto();

		customerDocument.setBusinessDate(adv.getDocDate());
		customerDocument.setCustomerMasterId(customerMasterId);
		customerDocument.setCustomerId(adv.getCustomerId());
		customerDocument.setLocationCode(CommonUtil.getLocationCode());
		customerDocument.setIsSynced(Boolean.FALSE);
		customerDocument.setDocumentType(PrintDocumentTypeEnum.MERGE_GRF.name());
		customerDocument.setFileType(PrintFileTypeEnum.INVOICE_PRINT.name());
		customerDocument.setDocumentSubType(DocumentBucketEnum.CUSTOMER_TRANSACTION.name());
		customerDocument.setTxnId(adv.getId());
		customerDocument.setDocumentPath(generateFilePath(customerDocument));
		customerDocument.setCustSignature(custSignature);		
		customerDocument.setCashierSignature(cashierSignature);

		return customerDocument;
	}

}
