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
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.response.CNResponseDto;
import com.titan.poss.sales.dto.response.CashMemoResponseDto;
import com.titan.poss.sales.dto.response.CustomerPrintDto;
import com.titan.poss.sales.dto.response.GepResponseDto;
import com.titan.poss.sales.dto.response.ItemDetailsResponseDto;
import com.titan.poss.sales.dto.response.TepDiscountRecoveryDetailsDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TEPRefundDto implements PrintableDto {
	private StoreDetails storeDetails;

	//private CashMemoResponseDto cashMemo;
	private GepResponseDto tepReponse;
	
	private CustomerPrintDto customer;

	private Date businessDate;

	private String customerMasterId;

	private String custSignature;
	
	private Map<String, ItemDetailsDto> items;
	
	private List<TepPriceResponseDto> itemDetails;
	
	private List<TepDiscountRecoveryDetailsDto> discountRecoveryDetails;
	
	private TepGrandTotal tepGrandTotal;
	
	private String priceInWords;
	
	private BigDecimal grossWeight;
	
	private String prints;
	

	
	

	private String cashierSignature;
	@Override
	public List<String> getTemplateName() {
		return List.of(FtlTemplateName.TEP_REFUND_INVOICE_PRINT);
	}
	@Override
	public CustomerDocumentDto getDocumentDetails() {
		CustomerDocumentDto customerDocument = new CustomerDocumentDto();

		customerDocument.setBusinessDate(businessDate);
		customerDocument.setCustomerMasterId(customerMasterId);
		customerDocument.setCustomerId(tepReponse.getCustomerId());
		customerDocument.setLocationCode(CommonUtil.getLocationCode());
		customerDocument.setIsSynced(Boolean.FALSE);
		customerDocument.setDocumentType(PrintDocumentTypeEnum.TEP_REFUND.name());
		customerDocument.setFileType(PrintFileTypeEnum.INVOICE_PRINT.name());
		customerDocument.setDocumentSubType(DocumentBucketEnum.CUSTOMER_TRANSACTION.name());
		customerDocument.setTxnId(tepReponse.getId());
		customerDocument.setDocumentPath(generateFilePath(customerDocument));
		customerDocument.setCustSignature(custSignature);
		customerDocument.setCashierSignature(cashierSignature);
		return customerDocument;
	}
}
