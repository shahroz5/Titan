/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.dto.OrgDto;
import com.titan.poss.location.dto.request.OrgUpdateDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface OrganizationService {

	/**
	 * This method will return the list of Organization details based on the
	 * isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<OrgDto>>
	 */
	PagedRestResponse<List<OrgDto>> listOrganization(Boolean isActive, Pageable pageable);

	/**
	 * This method will return the Organization details based on the orgCode.
	 * 
	 * @param orgCode
	 * @return OrgDto
	 */
	OrgDto getOrganization(String orgCode);

	/**
	 * This method will save the Organization details.
	 * 
	 * @param orgDto
	 * @return OrgDto
	 */
	OrgDto addOrganization(OrgDto orgDto);

	/**
	 * This method will update the Organization details.
	 * 
	 * @param orgCode
	 * @param orgUpdateDto
	 * @return OrgDto
	 */
	OrgDto updateOrganization(String orgCode, OrgUpdateDto orgUpdateDto);

}
