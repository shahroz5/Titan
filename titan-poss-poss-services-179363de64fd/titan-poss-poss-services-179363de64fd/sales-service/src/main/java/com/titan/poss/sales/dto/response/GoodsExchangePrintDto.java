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
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.sales.constants.FtlTemplateName;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.dto.CustomerDocumentDto;
import com.titan.poss.sales.dto.ExchangePriceItemDetailsDto;
import com.titan.poss.sales.dto.ItemDetailsDto;
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
public class GoodsExchangePrintDto implements PrintableDto {

	@Value("${docs.file.source.path}")
	private String fileBasePath;

	private CustomerPrintDto customer;

	private GepResponseDto gepReponse; // using ae response for TEP and GEP

	private List<ExchangePriceItemDetailsDto> itemDetails;

	private StoreDetails storeDetails;

	private List<SalesPaymentDto> paymentDetails;

	private TxnTypeTotalDetailDto orderTotalDetails;

	private Map<String, ItemDetailsDto> items;

	private String priceInWords;

	private Date businessDate;

	private String customerMasterId;

	@Override
	public CustomerDocumentDto getDocumentDetails() {
		CustomerDocumentDto customerDocument = new CustomerDocumentDto();

		customerDocument.setBusinessDate(businessDate);
		customerDocument.setCustomerMasterId(customerMasterId);
		customerDocument.setCustomerId(gepReponse.getCustomerId());
		customerDocument.setLocationCode(CommonUtil.getLocationCode());
		customerDocument.setIsSynced(Boolean.FALSE);
		customerDocument.setDocumentType(PrintDocumentTypeEnum.TEP.name());
		customerDocument.setFileType(PrintFileTypeEnum.INVOICE_PRINT.name());
		customerDocument.setDocumentSubType(DocumentBucketEnum.CUSTOMER_TRANSACTION.name());
		customerDocument.setTxnId(gepReponse.getId());
		customerDocument.setDocumentPath(generateFilePath(customerDocument));

		return customerDocument;
	}

	@Override
	public List<String> getTemplateName() {
		return List.of(FtlTemplateName.TEP_INVOICE_PRINT);
	}

}
