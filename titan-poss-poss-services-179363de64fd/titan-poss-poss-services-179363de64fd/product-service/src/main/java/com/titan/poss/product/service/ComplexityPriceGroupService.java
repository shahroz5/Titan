/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.product.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.product.dto.response.ComplexitityPriceGroupDTOList;
import com.titan.poss.product.dto.ComplexityPriceGroupMappingDto;
import com.titan.poss.product.dto.request.CompPriceGrpCreateDto;
import com.titan.poss.product.dto.request.CompPriceGrpUpdateDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface ComplexityPriceGroupService {

	/**
	 * This method returns the page of complexity price group list
	 * 
	 * @param pageable
	 * @return PagedRestResponse<List<ComplexityPriceGroupMappingDto>>
	 */
	PagedRestResponse<List<ComplexityPriceGroupMappingDto>> listComplexityPriceGroup(String complexityCode,
			String priceGroup, Pageable pageable, Boolean isActive);

	/**
	 * This method will return the particular data of Complexity price group
	 * mapping.
	 * 
	 * @param id
	 * @param priceGroup
	 * @return ComplexityPriceGroupMappingDto
	 */
	ComplexityPriceGroupMappingDto getComplexityPriceGroup(String id);

	/**
	 * This method will save new Complexity price group mapping details.
	 * 
	 * @param compPriceGrpCreateDto
	 * @return ComplexityPriceGroupMappingDto
	 */
	ComplexityPriceGroupMappingDto addComplexityPriceGroup(CompPriceGrpCreateDto compPriceGrpCreateDto);

	/**
	 * This method will update existing Complexity price group mapping details.
	 * 
	 * @param id
	 * @param compPriceGrpUpdateDto
	 * @return ComplexityPriceGroupMappingDto
	 */
	ComplexityPriceGroupMappingDto updateComplexityPriceGroup(String id, CompPriceGrpUpdateDto compPriceGrpUpdateDto);

	ComplexitityPriceGroupDTOList uploadFile(MultipartFile reqFile);

}
