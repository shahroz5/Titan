package com.titan.poss.sales.dto.response;

import com.titan.poss.sales.dto.AddressDetails;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerPrintDto {

	private String title;

	private String customerName;

	private AddressDetails address;

	private String mobileNumber;

	private String ulpId;
	
	private String customerType;
	
	private String instiTaxNo;
	
	private String custTaxNo;
	
	private String custTaxNoOld;
	
	private String passPortId;
	
	private String emailId;
	
	
}
