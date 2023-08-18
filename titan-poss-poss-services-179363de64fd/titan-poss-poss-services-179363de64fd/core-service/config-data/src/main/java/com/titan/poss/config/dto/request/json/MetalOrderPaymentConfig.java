package com.titan.poss.config.dto.request.json;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MetalOrderPaymentConfig {
	
	OrderPaymentConfigDetails gold;
	
	OrderPaymentConfigDetails platinum;

}
