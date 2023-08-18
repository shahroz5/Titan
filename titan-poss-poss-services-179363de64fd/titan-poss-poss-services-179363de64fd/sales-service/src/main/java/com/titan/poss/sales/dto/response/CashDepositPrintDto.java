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
import com.titan.poss.core.domain.constant.enums.FileExtensionEnum;
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.sales.constants.FtlTemplateName;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.dao.BankDepositDaoExt;
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
public class CashDepositPrintDto implements PrintableDto {

	private CustomerPrintDto customer;

	private StoreDetails storeDetails;

	private BankDepositDaoExt bankDepositDao;

	private Date businessDate;

	private Map<String, Integer> depositDetail;

	private String priceInWords;

	private String hierarchyCode;

	private String slipNo;

	private String coinAmount;
	
	private BigDecimal depositAmount;

	@Override
	public CustomerDocumentDto getDocumentDetails() {
		CustomerDocumentDto customerDocument = new CustomerDocumentDto();

		customerDocument.setBusinessDate(businessDate);
		customerDocument.setLocationCode(CommonUtil.getLocationCode());
		customerDocument.setIsSynced(Boolean.FALSE);
		customerDocument.setDocumentType(PrintDocumentTypeEnum.DEPOSIT.name());
		customerDocument.setFileType(PrintFileTypeEnum.CASH_PRINT.name());
		customerDocument.setDocumentSubType(DocumentBucketEnum.BANKING.name());
		customerDocument.setDocumentPath(generateFilePath(customerDocument));

		return customerDocument;
	}

	/**
	 * 
	 * @param customerDocument
	 * @param basePath
	 * @return
	 */
	@Override
	public String generateFilePath(CustomerDocumentDto customerDocument) {

		DocumentBucketEnum baseFolder = DocumentBucketEnum.valueOf(customerDocument.getDocumentSubType());

		return new StringBuilder().append("/").append(baseFolder.getBucketName()).append("/")
				.append(customerDocument.getLocationCode()).append("/").append("/")
				.append(customerDocument.getDocumentType()).append(".").append(FileExtensionEnum.PDF.getValue())
				.toString();
	}

	@Override
	public List<String> getTemplateName() {
		return List.of(FtlTemplateName.CASH_DEPOSIT_PRINT);
	}

}
