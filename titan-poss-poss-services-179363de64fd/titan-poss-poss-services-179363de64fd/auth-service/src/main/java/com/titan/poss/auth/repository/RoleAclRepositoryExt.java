/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.auth.repository;

import org.springframework.stereotype.Repository;

import com.titan.poss.user.repository.RoleAclMappingRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("AuthRoleAclRepositoryExt")
public interface RoleAclRepositoryExt extends RoleAclMappingRepository {

}
