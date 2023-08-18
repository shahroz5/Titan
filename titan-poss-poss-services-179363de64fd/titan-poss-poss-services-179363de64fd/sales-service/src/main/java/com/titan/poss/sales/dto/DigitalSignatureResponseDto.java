package com.titan.poss.sales.dto;



import lombok.Data;
import lombok.EqualsAndHashCode;


@Data
@EqualsAndHashCode(callSuper = false)
public class DigitalSignatureResponseDto extends BaseCustomerDigitalSignatureDto  {

	String digitalSignature;
	
	
	
}
