package com.titan.poss.sales.dto.response;




import com.titan.poss.sales.dao.CustomerDaoExt;
import com.titan.poss.sales.dto.BaseCustomerDigitalSignatureDto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper=false)
public class CustomerDigitalSignatureResponseDto extends BaseCustomerDigitalSignatureDto {

	
	public CustomerDaoExt customer;
	public String digitalSignature;
	
	
	public CustomerDigitalSignatureResponseDto(String mobileNumber, String ulpNumber,
			String applicableTransactionTypes, String customerId, String customerName, String customerEmail,
			String customerAddress,CustomerDaoExt customer,String customerType, String digitalSignature,String customerDocumentTxnId) {
		super(customerId, customerName, customerEmail, customerAddress, mobileNumber, ulpNumber,
				applicableTransactionTypes,customerType,customerDocumentTxnId);
		this.customer = customer;
		this.digitalSignature = digitalSignature;
		// TODO Auto-generated constructor stub
	}	
}
