/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.RoleDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("UserRoleRepository")
public interface RoleRepository extends JpaRepository<RoleDao, String> {

	RoleDao findOneByRoleCode(String roleCode);

	List<RoleDao> findByRoleName(String roleName);
}
