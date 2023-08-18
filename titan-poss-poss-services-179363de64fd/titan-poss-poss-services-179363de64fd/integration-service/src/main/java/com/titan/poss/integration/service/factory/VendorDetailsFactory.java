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
import com.titan.poss.integration.dto.AirpayVendorDetailsDto;
import com.titan.poss.integration.dto.NetcarrotsVendorDetailsDto;
import com.titan.poss.integration.dto.QcgcVendorDetailsDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class VendorDetailsFactory {

	Map<String, BaseFieldsValidator> vendorDetails = new HashMap<>();

	VendorDetailsFactory() {
		vendorDetails.put(VendorCodeEnum.QC_GC.toString(), new QcgcVendorDetailsDto());
		vendorDetails.put(VendorCodeEnum.PAYMENT_AIRPAY.toString(), new AirpayVendorDetailsDto());
		vendorDetails.put(VendorCodeEnum.ULP_NETCARROTS.toString(), new NetcarrotsVendorDetailsDto());
		
	}

	public BaseFieldsValidator getVendorConfig(String ruleType) {
		return vendorDetails.get(ruleType);
	}

}
