/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.auth.service;

import org.springframework.stereotype.Service;

import com.titan.poss.auth.dao.UserLoginDao;
import com.titan.poss.auth.dto.request.AclElementRequestDto;
import com.titan.poss.auth.dto.request.AclUrlRequestDto;
import com.titan.poss.auth.dto.response.AclElementResponseDto;
import com.titan.poss.auth.dto.response.AclUrlResponseDto;
import com.titan.poss.core.response.ListResponse;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("authUserService")
public interface UserService {

	UserLoginDao verifyUser(String username, String brandCode, boolean isApiUserAllowed);

	UserLoginDao saveUser(UserLoginDao user);

	void sendLockedNotification(UserLoginDao userLogin);

	void saveUserLogin(UserLoginDao ul);

	void throwMaxLoginTryReachedErr(Integer maxRetryAttempt);

	/**
	 * Get ACL URL mapping lists.
	 * 
	 * @param aclUrlRequestDto
	 * @return ListResponse<AclUrlResponseDto>
	 */
	ListResponse<AclUrlResponseDto> getAclList(AclUrlRequestDto aclUrlRequestDto);

	/**
	 * Get ACL element mapping lists
	 * 
	 * @param aclUrlRequestDto
	 * @return ListResponse<AclElementResponseDto>
	 */
	ListResponse<AclElementResponseDto> getAclElementList(AclElementRequestDto aclElementRequestDto);
}
