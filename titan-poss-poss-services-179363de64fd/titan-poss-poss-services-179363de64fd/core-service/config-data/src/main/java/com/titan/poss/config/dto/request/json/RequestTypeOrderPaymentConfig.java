package com.titan.poss.config.dto.request.json;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class RequestTypeOrderPaymentConfig {
	
	
	//all smalll
	MetalOrderPaymentConfig ibt;
	
	MetalOrderPaymentConfig mtr;
	
	MetalOrderPaymentConfig prod;
	
	MetalOrderPaymentConfig com;
	
	MetalOrderPaymentConfig autoApproval;

}
