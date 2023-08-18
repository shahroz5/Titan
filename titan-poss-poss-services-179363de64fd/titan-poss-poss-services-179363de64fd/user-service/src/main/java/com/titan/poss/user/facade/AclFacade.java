/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.facade;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.user.dto.response.AclDto;
import com.titan.poss.user.dto.response.AclGroupResponse;

/**
 * Facade layer of ACL controller
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface AclFacade {

	/**
	 * Returns parent ACL-group
	 * 
	 * @param isPageable if provided will list all data, overrides size of pageable
	 * @param pageable
	 * @return PagedRestResponse<List<AclGroupResponse>>
	 */
	public ListResponse<AclGroupResponse> listAclGroupHead(String roleCode, Boolean isPageable, Pageable pageable);

	/**
	 * Returns ACL-group of parent ACL-group provided
	 * 
	 * @param parentAclGroupCode
	 * @param isPageable         if provided will list all data, overrides size of
	 *                           pageable
	 * @param pageable
	 * @return PagedRestResponse<List<AclGroupResponse>>
	 */
	public ListResponse<AclGroupResponse> listAclGroup(String parentAclGroupCode, String roleCode, Boolean isPageable,
			Pageable pageable);

	/**
	 * Returns ACL list under an ACL-group with roleCode assigned or not
	 * 
	 * @param aclGroupCode
	 * @param roleCode
	 * @param isPageable   if provided will list all data, overrides size of
	 *                     pageable
	 * @param pageable
	 * @return
	 */
	public ListResponse<AclDto> listAclBasedOnAclGroupAndRoleCode(String aclGroupCode, String roleCode,
			Boolean isPageable, Pageable pageable);
}
