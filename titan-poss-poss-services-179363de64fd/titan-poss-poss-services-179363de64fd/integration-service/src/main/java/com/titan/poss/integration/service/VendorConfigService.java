/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.VendorConfigDto;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.integration.dto.request.VendorConfigAddDto;
import com.titan.poss.integration.intg.dao.VendorConfigDaoExt;

/**
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface VendorConfigService {

	/**
	 * Creates the vendor config.
	 * 
	 * @param vendorType
	 *
	 * @param vendorConfigAddDto the vendor config dto
	 * @return the vendor config dto
	 */
	VendorConfigDto createVendorConfig(@ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			VendorConfigAddDto vendorConfigAddDto);

	/**
	 * Get vendor config by vendor type & location code
	 * 
	 * @param vendorCode
	 * @param locationCode
	 * @return
	 */
	VendorConfigDaoExt getActiveByVendorCodeAndLocationCode(String vendorCode, String locationCode);

	/**
	 * Update vendor config.
	 *
	 * @param configId              the config id
	 * @param vendorConfigUpdateDto the vendor config update dto
	 * @return the vendor config dto
	 */
	VendorConfigDto updateVendorConfig(String configId, VendorConfigAddDto vendorConfigUpdateDto);

	/**
	 * Gets the all vendor configs.
	 *
	 * @param vendorCode the vendor code
	 * @param isActive   the is active
	 * @return the all vendor configs
	 */
	List<VendorConfigDto> getAllVendorConfigs(String vendorCode, Boolean isActive);

	/**
	 * Gets the vendor config.
	 *
	 * @param configId the config id
	 * @return the vendor config
	 */
	VendorConfigDto getVendorConfig(String configId);

	/**
	 * Gets the all vendor configurations.
	 *
	 * @param vendorCode the vendor code
	 * @return the all vendor configurations
	 */
	PagedRestResponse<Object> getAllVendorConfigurations(String vendorCode, String locationCode, Boolean isActive, Pageable pageable);

}
