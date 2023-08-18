/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.factory;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;
import com.titan.poss.integration.dto.QcgcConfigDto;
import com.titan.poss.integration.dto.request.AirpayConfigPropertiesDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class VendorConfigFactory {

	Map<String, BaseFieldsValidator> vendorConfigs = new HashMap<>();

	VendorConfigFactory() {
		vendorConfigs.put(VendorCodeEnum.QC_GC.toString(), new QcgcConfigDto());
		vendorConfigs.put(VendorCodeEnum.PAYMENT_AIRPAY.toString(), new AirpayConfigPropertiesDto());

	}

	public BaseFieldsValidator getVendorConfig(String ruleType) {
		return vendorConfigs.get(ruleType);
	}

}
