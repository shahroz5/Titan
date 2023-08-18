/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.product.dto.MaterialDto;
import com.titan.poss.product.dto.request.MaterialUpdateDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface MaterialService {

	/**
	 * This method will return the list of Material details based on the materialType and isActive.
	 * 
	 * @param materialType
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<MaterialDto>>
	 */
	PagedRestResponse<List<MaterialDto>> listMaterial(String materialType, Boolean isActive, Pageable pageable);


	/**
	 * This method will return the Material details based on the materialCode.
	 * 
	 * @param materialCode
	 * @return MaterialDto
	 */
	MaterialDto getMaterial(String materialCode);





	/**
	 * This method will save the Material details.
	 * 
	 * @param materialDto
	 * @return MaterialDto
	 */
	MaterialDto addMaterial(MaterialDto materialDto);





	/**
	 * This method will update the Material details.
	 * 
	 * @param materialCode
	 * @param materialUpdateDto
	 * @return MaterialDto
	 */
	MaterialDto updateMaterial(String materialCode, MaterialUpdateDto materialUpdateDto);


}
