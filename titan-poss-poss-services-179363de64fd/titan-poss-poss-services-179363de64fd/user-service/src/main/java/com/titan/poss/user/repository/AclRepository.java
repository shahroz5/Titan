/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.repository;

import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.AclDao;

/**
 * Handles repository operations for <b>Acl</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("UserAclRepository")
public interface AclRepository extends JpaRepository<AclDao, String> {

	Page<AclDao> findByIsActive(Boolean isActive, Pageable pageable);

	boolean existsByAclCodeInAndIsCorpCanAccess(Set<String> aclCode, Boolean isCorpCanAccess);

	@Query("SELECT COUNT(rm.aclCode) FROM UserAcl rm where rm.isActive = true AND aclCode IN (:aclCodes)")
	Integer countActiveAclIn(@Param("aclCodes") Set<String> aclCodes);
}
