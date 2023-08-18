/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.titan.poss.core.domain.constant.DocumentBucketEnum;
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.sales.constants.FtlTemplateName;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dto.CustomerDocumentDto;
import com.titan.poss.sales.dto.PrintableDto;

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
public class AcceptAdvancePrintDto implements PrintableDto {

	private SalesTxnDao salesTxnDao;

	private CustomerPrintDto customer;

	private StoreDetails storeDetails;

	private List<SalesPaymentDto> paymentDetails;

	private String priceInWords;

	private BigDecimal totalAmount;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date businessDate;

	private String customerMasterId;

	private String locationCode;

	private Integer cnDocNo;

	private Integer docNo;

	private Short fiscalYear;

	private String docDate;

	private String custSignature;
	
	private String cashierSignature;
	
	private String prints;

	@Override
	public CustomerDocumentDto getDocumentDetails() {
		CustomerDocumentDto customerDocument = new CustomerDocumentDto();

		customerDocument.setBusinessDate(businessDate);
		customerDocument.setCustomerMasterId(customerMasterId);
		customerDocument.setLocationCode(CommonUtil.getLocationCode());
		customerDocument.setIsSynced(Boolean.FALSE);
		customerDocument.setDocumentType(PrintDocumentTypeEnum.ACCEPT_ADVANCE.name());
		customerDocument.setFileType(PrintFileTypeEnum.INVOICE_PRINT.name());
		customerDocument.setDocumentSubType(DocumentBucketEnum.CUSTOMER_TRANSACTION.name());
		customerDocument.setTxnId(salesTxnDao.getId());
		customerDocument.setDocumentPath(generateFilePath(customerDocument));
		customerDocument.setCustSignature(custSignature);
		customerDocument.setCashierSignature(cashierSignature);		

		return customerDocument;
	}

	@Override
	public List<String> getTemplateName() {
		return List.of(FtlTemplateName.ACCEPT_ADV_INVOICE_PRINT);
	}

}
