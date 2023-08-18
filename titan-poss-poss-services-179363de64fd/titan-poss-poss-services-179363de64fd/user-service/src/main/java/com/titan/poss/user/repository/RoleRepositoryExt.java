/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.RoleDao;
import com.titan.poss.user.dto.response.RoleListDto;

/**
 * Handles repository operations for <b>Role</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("UserRoleRepositoryExt")
public interface RoleRepositoryExt extends RoleRepository {

	@Query("SELECT rm.roleCode " + "FROM com.titan.poss.user.dao.RoleDao rm "
			+ "where rm.isActive = false AND roleCode IN (:roleCodes)")
	List<String> listByActiveRoleCodeIn(@Param("roleCodes") Set<String> roleCodes);

	@Query("SELECT count(rm.roleCode) " + "FROM com.titan.poss.user.dao.RoleDao rm "
			+ "where rm.isActive = true AND rm.accessType LIKE %:accessType% AND roleCode IN (:roleCodes)")
	Short countByActiveAndRoleTypeRoleCodeIn(@Param("accessType") String accessType,
			@Param("roleCodes") Set<String> roleCodes);

	@Query("SELECT rm FROM com.titan.poss.user.dao.RoleDao rm " + "where rm.accessType  LIKE %:accessType%")
	List<RoleDao> listByAccessType(@Param("accessType") String accessType);

	// @formatter:off
	@Query("SELECT new com.titan.poss.user.dto.response.RoleListDto(rm.roleCode as roleCode, rm.roleName as roleName, rm.description as description, "
			+ " rm.isActive as isActive, lrc.userLimit as userLimit, lrc.assignedUsers as assignedUser, rm.corpAccess) "
			+ " FROM com.titan.poss.user.dao.RoleDao rm \r\n"
			+ " RIGHT JOIN com.titan.poss.user.dao.LocationRoleConfigDao lrc \r\n"
			+ "		ON lrc.role = rm \r\n"
			+ " WHERE (lrc.locationCode = :location) AND (lrc.isDefault = :isDefault) AND (:roleCode IS NULL OR rm.roleCode LIKE :roleCode%) \r\n"
			+ " AND (:isActive IS NULL OR rm.isActive = :isActive) AND (:corpAccess IS NULL OR rm.corpAccess = :corpAccess) \r\n")
	// @formatter:on
	Page<RoleListDto> getRolesForStore(@Param("roleCode") String roleCode, @Param("location") String location,
			@Param("isDefault") Boolean isDefault, @Param("corpAccess") Boolean corpAccess,
			@Param("isActive") Boolean isActive, Pageable pageable);

	// @formatter:off
		@Query("SELECT new com.titan.poss.user.dto.response.RoleListDto(rm.roleCode as roleCode, rm.roleName as roleName, rm.description as description,"
				+ " rm.isActive as isActive, rm.corpAccess,rm.isLocationMappingRequired as isLocationMappingRequired) "
				+ " FROM com.titan.poss.user.dao.RoleDao rm \r\n"
				+ " WHERE (:roleCode IS NULL OR rm.roleCode LIKE :roleCode) \r\n"
				+ " AND (:isActive IS NULL OR rm.isActive = :isActive) \r\n"
				+ " AND (:corpAccess IS NULL OR rm.corpAccess = :corpAccess) \r\n"
				+ " AND accessType LIKE %:accessType%"
				)
	// @formatter:on
	Page<RoleListDto> listRoles(@Param("roleCode") String roleCode, @Param("corpAccess") Boolean corpAccess,
			@Param("isActive") Boolean isActive, @Param("accessType") String accessType, Pageable pageable);

	// @formatter:off
	@Query("SELECT COUNT(rm) "
			+ " FROM com.titan.poss.user.dao.RoleDao rm \r\n"
			+ " WHERE (rm.corpAccess = 1) AND (rm.accessType LIKE '%__1__%' OR rm.accessType LIKE '%___1_%' OR rm.accessType LIKE '%___1_%')")
	// @formatter:on
	Short countStoreCorpAccessRoles();

	@Query("SELECT UPPER(rm.roleCode) FROM com.titan.poss.user.dao.RoleDao rm "
			+ "WHERE rm.corpAccess = true AND (rm.accessType LIKE '%__1__%' OR rm.accessType LIKE '%___1_%' OR rm.accessType LIKE '%___1_%')")
	Set<String> findStoreRolesCorpCanAccess();
}
