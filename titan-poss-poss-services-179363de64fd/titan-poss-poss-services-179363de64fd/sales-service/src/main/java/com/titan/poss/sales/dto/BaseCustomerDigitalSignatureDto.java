package com.titan.poss.sales.dto;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class BaseCustomerDigitalSignatureDto {
	
	public String customerId;
	public String customerName;
	public String customerEmail;
	public String customerAddress;
	public String mobileNumber;
	public String ulpNumber;
	public String applicableTransactionTypes;
	public String customerType;
	public String customerDocumentTxnId;
	
}
