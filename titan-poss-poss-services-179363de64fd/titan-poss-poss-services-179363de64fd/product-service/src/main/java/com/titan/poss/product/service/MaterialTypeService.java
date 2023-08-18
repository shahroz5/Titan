/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.product.dto.MaterialTypeDto;
import com.titan.poss.product.dto.request.MaterialTypeUpdateDto;
import com.titan.poss.product.dto.response.MaterialLiteDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface MaterialTypeService {

	/**
	 * This method will return the list of Material details based on the
	 * materialType and isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<MaterialDto>>
	 */
	PagedRestResponse<List<MaterialTypeDto>> listMaterial(Boolean isActive, Pageable pageable);

	/**
	 * This method will return the list of Material type details based on the
	 * materialType and isPageable.
	 * 
	 * @param materialGroup
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<MaterialLiteDto>>
	 */
	PagedRestResponse<List<MaterialLiteDto>> listMaterialLite(Boolean isPageable, Pageable pageable);

	/**
	 * This method will return the Material type details based on the
	 * materialTypeCode.
	 * 
	 * @param materialTypeCode
	 * @return MaterialTypeDto
	 */
	MaterialTypeDto getMaterial(String materialTypeCode);

	/**
	 * This method will save the Material type details.
	 * 
	 * @param materialTypeDto
	 * @return MaterialTypeDto
	 */
	MaterialTypeDto addMaterial(MaterialTypeDto materialTypeDto);

	/**
	 * This method will update the Material type details.
	 * 
	 * @param materialTypeCode
	 * @param materialTypeUpdateDto
	 * @return MaterialTypeDto
	 */
	MaterialTypeDto updateMaterial(String materialTypeCode, MaterialTypeUpdateDto materialTypeUpdateDto);

}
