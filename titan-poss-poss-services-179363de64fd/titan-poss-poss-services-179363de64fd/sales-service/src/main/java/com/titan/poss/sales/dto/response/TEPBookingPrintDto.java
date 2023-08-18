/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;

import com.titan.poss.core.domain.constant.DocumentBucketEnum;
import com.titan.poss.core.dto.EinvoiceDto;
import com.titan.poss.core.dto.ItemDetailsDto;
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.sales.constants.FtlTemplateName;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.dto.CustomerDocumentDto;
import com.titan.poss.sales.dto.ExchangePriceItemDetailsDto;
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
public class TEPBookingPrintDto implements PrintableDto {

	@Value("${docs.file.source.path}")
	private String fileBasePath;

	private CustomerPrintDto customer;

	private GepResponseDto tepReponse; // using ae response for TEP and GEP

	private List<ExchangePriceItemDetailsDto> itemDetails;

	private StoreDetails storeDetails;

	private List<SalesPaymentDto> paymentDetails;

	private TxnTypeTotalDetailDto orderTotalDetails;

	private Map<String, ItemDetailsDto> items;

	private String priceInWords;

	private String fullValuePriceInWords;
	
	private Date businessDate;

	private String customerMasterId;

	private EinvoiceDto einvoice;

	private String custSignature;

	private String cashierSignature;
	
	private String docDate;
	
	private String prints;

	@Override
	public CustomerDocumentDto getDocumentDetails() {
		CustomerDocumentDto customerDocument = new CustomerDocumentDto();

		customerDocument.setBusinessDate(businessDate);
		customerDocument.setCustomerMasterId(customerMasterId);
		customerDocument.setCustomerId(tepReponse.getCustomerId());
		customerDocument.setLocationCode(CommonUtil.getLocationCode());
		customerDocument.setIsSynced(Boolean.FALSE);
		customerDocument.setDocumentType(PrintDocumentTypeEnum.TEP.name());
		customerDocument.setFileType(PrintFileTypeEnum.INVOICE_PRINT.name());
		customerDocument.setDocumentSubType(DocumentBucketEnum.CUSTOMER_TRANSACTION.name());
		customerDocument.setTxnId(tepReponse.getId());
		customerDocument.setDocumentPath(generateFilePath(customerDocument));
		customerDocument.setCustSignature(custSignature);
		customerDocument.setCashierSignature(cashierSignature);

		return customerDocument;
	}

	@Override
	public List<String> getTemplateName() {
		return List.of(FtlTemplateName.TEP_INVOICE_PRINT);
	}
}
