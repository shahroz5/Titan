/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.RoleLimitRequestDetailsDao;
import com.titan.poss.user.dto.response.RequestedRoleDetails;

/**
 * Handles repository operations for <b>RoleLimitRequestDetails</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("UserRoleLimitRequestDetailsRepository")
public interface RoleLimitRequestDetailsRepository extends JpaRepository<RoleLimitRequestDetailsDao, Integer> {

	// @formatter:off
	@Query("SELECT new com.titan.poss.user.dto.response.RequestedRoleDetails(rlrd.id, rlrd.role.roleCode, rlrd.role.roleName, lrc.assignedUsers, lrc.userLimit, rlrd.reqValue)"
			+ " FROM com.titan.poss.user.dao.RoleLimitRequestDetailsDao rlrd "
			+ " LEFT JOIN com.titan.poss.user.dao.LocationRoleConfigDao lrc"
			+ " 	ON rlrd.role = lrc.role"
			+ " WHERE rlrd.roleLimitRequest.id = :id AND lrc.locationCode = (SELECT rlr.reqLocationCode FROM RoleLimitRequestDao rlr WHERE rlr.id = :id)")
	// @formatter:on
	List<RequestedRoleDetails> getRoleDetails(@Param("id") Integer id);

	List<RoleLimitRequestDetailsDao> findByRoleLimitRequestId(Integer roleLimitRequestId);

	@Query("SELECT reqDtls from RoleLimitRequestDetailsDao reqDtls " + " WHERE reqDtls.roleLimitRequest IN "
			+ " 		(SELECT id FROM RoleLimitRequestDao  WHERE status = :oldStatus AND reqLocationCode = :locCode)")
	public List<RoleLimitRequestDetailsDao> findByStatusAndLocationCode(@Param("oldStatus") String oldStatus,
			@Param("locCode") String locCode);
}
