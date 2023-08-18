/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.service;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.user.dto.response.AclDto;
import com.titan.poss.user.dto.response.AclGroupResponse;

/**
 * service layer of ACL controller
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("userAclService")
public interface AclService {

	/**
	 * Returns ACL-group of parent ACL-group provided <br>
	 * If null 1st level, else any level from 2nd level onwards
	 * 
	 * @param roleCode
	 * 
	 * @param parentAclGroupCode
	 * @param pageable
	 * @return PagedRestResponse<List<AclGroupResponse>>
	 */
	ListResponse<AclGroupResponse> listAclGroup(String parentAclGroup, String roleCode, Pageable pageable);

	/**
	 * Returns ACL list under an ACL-group with roleCode assigned or not
	 * 
	 * @param aclGroupCode
	 * @param roleCode
	 * @param pageable
	 * @return
	 */
	ListResponse<AclDto> listAclBasedOnAclGroupAndRoleCode(String aclGroupCode, String roleCode, Pageable pageable);

}
