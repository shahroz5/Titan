/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.product.dao.ComplexityDao;
import com.titan.poss.product.dto.ComplexityDto;
import com.titan.poss.product.dto.request.ComplexityUpdateDto;
import com.titan.poss.product.dto.response.ComplexityLiteDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface ComplexityService {

	/**
	 * This method will return the list of Complexity details based on the isActive.
	 * 
	 * @param isActive 
	 * @param pageable
	 * @return PagedRestResponse<List<ComplexityDto>>
	 */
	PagedRestResponse<List<ComplexityDto>> listComplexity(Boolean isActive, Pageable pageable);





	/**
	 * This method will return the list of Complexity details based on isPageable.
	 * 
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<ComplexityLiteDto>>
	 */
	PagedRestResponse<List<ComplexityLiteDto>> listComplexityLite(Boolean isPageable, Pageable pageable);





	/**
	 * This method will return the Complexity details based on the complexityCode.
	 * 
	 * @param complexityCode
	 * @return ComplexityDto
	 */
	ComplexityDto getComplexity(String complexityCode);





	/**
	 * This method will save the Complexity details.
	 * 
	 * @param complexityDto
	 * @return ComplexityDto
	 */
	ComplexityDto addComplexity(ComplexityDto complexityDto);





	/**
	 * This method will update the Complexity details.
	 * 
	 * @param complexityCode
	 * @param complexityUpdateDto
	 * @return ComplexityDto
	 */
	ComplexityDto updateComplexity(String complexityCode, ComplexityUpdateDto complexityUpdateDto);

	/**
	 * @param complexityCode
	 * @return ComplexityDao
	 */
	ComplexityDao getComplexityDao(String complexityCode);

}
