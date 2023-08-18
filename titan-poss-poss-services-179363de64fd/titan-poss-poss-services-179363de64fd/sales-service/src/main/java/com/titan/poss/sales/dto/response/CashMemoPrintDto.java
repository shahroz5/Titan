/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.titan.poss.core.domain.constant.DocumentBucketEnum;
import com.titan.poss.core.dto.EinvoiceDto;
import com.titan.poss.core.dto.ItemDetailsDto;
import com.titan.poss.core.dto.PrintDetails;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.sales.constants.FtlTemplateName;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.FocDetailsDaoExt;
import com.titan.poss.sales.dto.CustomerDocumentDto;
import com.titan.poss.sales.dto.MetalRateListDto;
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
public class CashMemoPrintDto implements PrintableDto {

	private CustomerPrintDto customer;

	private CashMemoResponseDto cashMemo;

	private StoreDetails storeDetails;

	private List<ItemDetailsResponseDto> itemDetails;

	private List<SalesPaymentDto> paymentDetails;

	private TxnTypeTotalDetailDto cmTotalDetail;

	private Map<String, ItemDetailsDto> items;

	private String priceInWords;

	private Date businessDate;

	private String customerMasterId;

	private EinvoiceDto einvoice;

	private String custSignature;

	private String cashierSignature;

	private BigDecimal tcsPercentage;

	private BigDecimal tcsAmountPaid;
	
	private String timeStamp;
	
	private String docDate;
	
	private String prints;
	
	private Map<String, List<StandardPriceResponseDto>> basicMetalDetails;
	
	private Map<String, CustomerDetailsDto> thirdPartyCNDetails;
	
	private List<CreditNoteDaoExt> refundCreditNote;
	
	private Map<String, BigDecimal> discountValues;
	
	private List<FocDetailsDaoExt> focItems;
	
	private Map<String, String> productCategories;
	
	private PrintDetails printDetails; 
	
	private String brandCode;
	
	private Integer totalQuantity;
	
//	private Short focQty;
//	
	private BigDecimal focTotalWt;

	// discount pending

	@Override
	public CustomerDocumentDto getDocumentDetails() {

		CustomerDocumentDto customerDocument = new CustomerDocumentDto();

		customerDocument.setBusinessDate(businessDate);
		customerDocument.setCustomerMasterId(customerMasterId);
		customerDocument.setCustomerId(cashMemo.getCustomerId());
		customerDocument.setLocationCode(CommonUtil.getLocationCode());
		customerDocument.setIsSynced(Boolean.FALSE);
		customerDocument.setDocumentType(PrintDocumentTypeEnum.CM.name());
		customerDocument.setFileType(PrintFileTypeEnum.INVOICE_PRINT.name());
		customerDocument.setDocumentSubType(DocumentBucketEnum.CUSTOMER_TRANSACTION.name());
		customerDocument.setTxnId(cashMemo.getId());
		customerDocument.setDocumentPath(generateFilePath(customerDocument));
		customerDocument.setCustSignature(custSignature);
		customerDocument.setCashierSignature(cashierSignature);
		return customerDocument;
	}

	@Override
	public List<String> getTemplateName() {
		return List.of( FtlTemplateName.CM_INVOICE_MAIL, FtlTemplateName.CM_INVOICE_PRINT);
	}

}
