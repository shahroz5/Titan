/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.print;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.titan.poss.core.domain.constant.DocumentBucketEnum;
import com.titan.poss.core.dto.ItemDetailsDto;
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.dto.TepPriceResponseDto;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.sales.constants.FtlTemplateName;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.dto.CustomerDocumentDto;
import com.titan.poss.sales.dto.ExchangePriceItemDetailsDto;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.TxnTypeTotalDetailDto;
import com.titan.poss.sales.dto.response.CashMemoResponseDto;
import com.titan.poss.sales.dto.response.CustomerPrintDto;
import com.titan.poss.sales.dto.response.GepResponseDto;
import com.titan.poss.sales.dto.response.TepDiscountRecoveryDetailsDto;

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
public class TEPAnnexurePrintDto implements PrintableDto {

	private StoreDetails storeDetails;

	private CashMemoResponseDto cashMemo;

	private CustomerPrintDto customer;

	private Date businessDate;

	private String customerMasterId;

	private String custSignature;

	private String cashierSignature;

	private Map<String, ItemDetailsDto> items;

	private GepResponseDto tepReponse; // using ae response for TEP and GEP

	private List<ExchangePriceItemDetailsDto> itemDetails;

//	private BigDecimal totalCarat;
//
//	private BigDecimal stoneValue;
//
//	private BigDecimal totalStoneDeduction;
//
//	private BigDecimal totalStoneDeductionValue;
//
//	private BigDecimal totalStoneValue;
//
//	private BigDecimal grandTotalCarat;
//
//	private BigDecimal grandStoneValue;
//
//	private BigDecimal grandTotalStoneDeduction;
//
//	private BigDecimal grandTotalStoneDeductionValue;
//
//	private BigDecimal granTotalStoneValue;

	List<TepDiscountRecoveryDetailsDto> discountRecoveryDetails;
	
	
	
	private TxnTypeTotalDetailDto orderTotalDetails;

	@Override
	public List<String> getTemplateName() {
		return List.of(FtlTemplateName.TEP_ANNEXURE_INVOICE_PRINT);
	}

	@Override
	public CustomerDocumentDto getDocumentDetails() {
		CustomerDocumentDto customerDocument = new CustomerDocumentDto();

		customerDocument.setBusinessDate(businessDate);
		customerDocument.setCustomerMasterId(customerMasterId);
		customerDocument.setCustomerId(tepReponse.getCustomerId());
		customerDocument.setLocationCode(CommonUtil.getLocationCode());
		customerDocument.setIsSynced(Boolean.FALSE);
		customerDocument.setDocumentType(PrintDocumentTypeEnum.TEP_ANNEXURE.name());
		customerDocument.setFileType(PrintFileTypeEnum.INVOICE_PRINT.name());
		customerDocument.setDocumentSubType(DocumentBucketEnum.CUSTOMER_TRANSACTION.name());
		customerDocument.setTxnId(tepReponse.getId());
		customerDocument.setDocumentPath(generateFilePath(customerDocument));
		customerDocument.setCustSignature(custSignature);
		customerDocument.setCashierSignature(cashierSignature);
		return customerDocument;
	}

}
