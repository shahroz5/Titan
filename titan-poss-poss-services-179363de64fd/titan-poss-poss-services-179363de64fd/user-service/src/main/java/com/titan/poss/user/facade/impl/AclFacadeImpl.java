/*  
 * Copyright 2019. Titan Company Limited
 */
package com.titan.poss.user.facade.impl;

import static com.titan.poss.core.utils.CommonUtil.updatePageable;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.user.dto.response.AclDto;
import com.titan.poss.user.dto.response.AclGroupResponse;
import com.titan.poss.user.facade.AclFacade;
import com.titan.poss.user.service.AclService;

/**
 * Facade implementation layer of ACL controller
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class AclFacadeImpl implements AclFacade {

	@Autowired
	AclService aclService;

	/**
	 * Returns parent ACL-group
	 * 
	 * @param isPageable if provided will list all data, overrides size of pageable
	 * @param pageable
	 * @return PagedRestResponse<List<AclGroupResponse>>
	 */
	@Override
	public ListResponse<AclGroupResponse> listAclGroupHead(String roleCode, Boolean isPageable, Pageable pageable) {
		pageable = updatePageable(isPageable, pageable);
		return aclService.listAclGroup(null, roleCode, pageable);
	}

	@Override
	public ListResponse<AclGroupResponse> listAclGroup(String parentAclGroupCode, String roleCode, Boolean isPageable,
			Pageable pageable) {
		pageable = updatePageable(isPageable, pageable);
		return aclService.listAclGroup(parentAclGroupCode, roleCode, pageable);
	}

	@Override
	public ListResponse<AclDto> listAclBasedOnAclGroupAndRoleCode(String aclGroupCode, String roleCode,
			Boolean isPageable, Pageable pageable) {
		pageable = updatePageable(isPageable, pageable);
		return aclService.listAclBasedOnAclGroupAndRoleCode(aclGroupCode,
				(StringUtils.isNotBlank(roleCode)) ? roleCode : null, pageable);
	}

}
