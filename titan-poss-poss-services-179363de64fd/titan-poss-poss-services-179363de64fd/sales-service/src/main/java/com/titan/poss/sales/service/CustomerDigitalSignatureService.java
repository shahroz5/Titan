package com.titan.poss.sales.service;



import java.util.List;

import com.titan.poss.sales.dto.DigitalSignatureResponseDto;
import com.titan.poss.sales.dto.request.CustomerDigitalSignatureRequestDto;

public interface CustomerDigitalSignatureService {

	List<DigitalSignatureResponseDto> getCustomerDigitalSignatureData(String mobileNumber, String ulpNumber,String customerType);
	
	List<DigitalSignatureResponseDto> getCustomerData(String mobileNumber, String ulpNumber);

	DigitalSignatureResponseDto saveCustomerSignature(CustomerDigitalSignatureRequestDto customerDigitalSignatureRequestDto);

	DigitalSignatureResponseDto uploadFile(String digitalSignature,String mobileNumber,String customerType);

	
	
}
