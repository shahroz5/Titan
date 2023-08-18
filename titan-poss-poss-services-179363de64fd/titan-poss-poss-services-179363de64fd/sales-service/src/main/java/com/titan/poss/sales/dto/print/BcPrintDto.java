package com.titan.poss.sales.dto.print;

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
import com.titan.poss.sales.dto.response.CNResponseDto;
import com.titan.poss.sales.dto.response.CustomerPrintDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BcPrintDto implements PrintableDto {
	private StoreDetails storeDetails;

	private Date businessDate;

	private String customerMasterId;
	private String priceInWords;
	private String custSignature;
	private CustomerPrintDto customer;
	private String cashierSignature;
	private CNResponseDto cnResponseDto;
	private String docDate;
	private String prints;
	private String id;
	private String locationCode;
	private Integer docNo;
	private String txnType;
	private String header;

	@Override
	public List<String> getTemplateName() {
		return List.of(FtlTemplateName.BC_INVOICE_PRINT);
	}

	@Override
	public CustomerDocumentDto getDocumentDetails() {
		CustomerDocumentDto customerDocument = new CustomerDocumentDto();

		customerDocument.setBusinessDate(businessDate);
		customerDocument.setCustomerMasterId(customerMasterId);
		customerDocument.setCustomerId(cnResponseDto.getCustomerId());
		customerDocument.setLocationCode(CommonUtil.getLocationCode());
		customerDocument.setIsSynced(Boolean.FALSE);
		customerDocument.setDocumentType(PrintDocumentTypeEnum.BILL_CANCELLATION.name());
		customerDocument.setFileType(PrintFileTypeEnum.INVOICE_PRINT.name());
		customerDocument.setDocumentSubType(DocumentBucketEnum.CUSTOMER_TRANSACTION.name());
		customerDocument.setTxnId(id);
		customerDocument.setDocumentPath(generateFilePath(customerDocument));
		customerDocument.setCustSignature(custSignature);
		customerDocument.setCashierSignature(cashierSignature);
		// customerDocument.setProcessId(cnResponseDto.getId());
		return customerDocument;
	}

}
