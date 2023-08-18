/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.integration.service;

import java.util.List;

import javax.validation.constraints.NotNull;

import org.springframework.data.domain.Pageable;
import org.springframework.validation.annotation.Validated;

import com.titan.poss.core.enums.VendorTypeEnum;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.VendorDto;
import com.titan.poss.integration.dto.request.VendorUpdateDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
public interface VendorService {

	/**
	 * Return vendor userName, password, URL for a vendor type
	 * 
	 * @param vendorTypeEnum
	 * @return Integration
	 */
	VendorDao getActiveByVendorType(@NotNull VendorTypeEnum vendorTypeEnum);

	public VendorDto getVendorByVendorCode(String vendorCode);

	public PagedRestResponse<List<VendorDto>> getAllVendors(Boolean isActive, Boolean isPageable, Pageable pageable);

	public VendorDto createVendor(VendorDto vendorDto);

	public VendorDto updateVendor(String vendorCode, VendorUpdateDto vendorupdateDto);

	VendorDto getVendorByVendorType(String vendorType);

}
