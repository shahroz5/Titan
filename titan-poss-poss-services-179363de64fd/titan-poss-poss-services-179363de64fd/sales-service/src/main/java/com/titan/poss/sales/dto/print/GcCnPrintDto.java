package com.titan.poss.sales.dto.print;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.titan.poss.core.domain.constant.DocumentBucketEnum;
import com.titan.poss.core.dto.StoreDetails;
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
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GcCnPrintDto implements PrintableDto {

	private StoreDetails storeDetails;
	private Date businessDate;
	private String customerMasterId;
	private String priceInWords;
	private String custSignature;
	private CustomerPrintDto customer;
	private String cashierSignature;
	private String docDate;
	private String txnType;
	private Integer cndocNo;
	private String cnLocationCode;
	private BigDecimal totalValue;
	private String locationCode;
	private Integer docNo;
	private Integer customerId;	
	private String prints;
	
	@Override
	public List<String> getTemplateName() {
		// TODO Auto-generated method stub
		return List.of(FtlTemplateName.GC_WITH_CN_INVOICE_PRINT);
	}

	@Override
	public CustomerDocumentDto getDocumentDetails() {
		
		CustomerDocumentDto customerDocument = new CustomerDocumentDto();
		customerDocument.setBusinessDate(businessDate);
		customerDocument.setCustomerMasterId(customerMasterId);
		customerDocument.setCustomerId(customerId);
		customerDocument.setLocationCode(CommonUtil.getLocationCode());
		customerDocument.setIsSynced(Boolean.FALSE);
		customerDocument.setDocumentType(PrintDocumentTypeEnum.GC_WITH_CN.name());
		customerDocument.setFileType(PrintFileTypeEnum.INVOICE_PRINT.name());
		customerDocument.setDocumentSubType(DocumentBucketEnum.CUSTOMER_TRANSACTION.name());
		//customerDocument.setTxnId(cashMemo.getId());
		customerDocument.setDocumentPath(generateFilePath(customerDocument));
		customerDocument.setCustSignature(custSignature);
		customerDocument.setCashierSignature(cashierSignature);
		return customerDocument;
	}

}
