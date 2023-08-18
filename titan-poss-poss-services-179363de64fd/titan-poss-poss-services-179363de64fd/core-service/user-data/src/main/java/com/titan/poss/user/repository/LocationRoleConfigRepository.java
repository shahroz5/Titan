/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.LocationRoleConfigDao;

/**
 * Handles repository operations for <b>LocationRoleConfig</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("UserLocationRoleConfigRepository")
public interface LocationRoleConfigRepository extends JpaRepository<LocationRoleConfigDao, Integer> {

	List<LocationRoleConfigDao> findByLocationCode(String locationCode);

	Page<LocationRoleConfigDao> findByLocationCodeAndIsDefault(String locationCode, Boolean isDefault,
			Pageable pageable);

	List<LocationRoleConfigDao> findByLocationCodeAndIsDefaultAndIsActiveTrue(String locationCode, Boolean isDefault);

	List<LocationRoleConfigDao> findByLocationCodeAndIsDefault(String locationCode, Boolean isDefault);

	Optional<LocationRoleConfigDao> findOneByLocationCodeAndRoleRoleCodeAndIsDefault(String locationCode,
			String roleCode, Boolean isDefault);

	// @formatter:off
	@Query("SELECT lrc from com.titan.poss.user.dao.LocationRoleConfigDao lrc"
			+ " WHERE lrc.locationCode = :locationCode AND lrc.isDefault = :isDefault AND lrc.role.accessType LIKE :accessType")
	// @formatter:on
	List<LocationRoleConfigDao> listByLocCodeAndIsDefaultAndAccessType(@Param("locationCode") String locationCode,
			@Param("isDefault") boolean isDefault, @Param("accessType") String accessType);

	// @formatter:off
		@Query("SELECT lrc from com.titan.poss.user.dao.LocationRoleConfigDao lrc"
				+ " WHERE lrc.locationCode = :locationCode AND lrc.role.roleCode IN (:roleCodes)")
		// @formatter:on
	Set<LocationRoleConfigDao> findByLocationCodeAndRoleCodes(@Param("locationCode") String locationCode,
			@Param("roleCodes") List<String> roleCodes);

	Set<LocationRoleConfigDao> findByRoleRoleCodeAndIsDefault(String roleCode, Boolean isDefault);

	public List<LocationRoleConfigDao> findByRoleRoleCode(String roleCode);

	// @formatter:off
	@Query("SELECT lrc from com.titan.poss.user.dao.LocationRoleConfigDao lrc"
			+ " WHERE lrc.role.roleCode = :roleCode AND lrc.locationCode IN (:locationCodes) AND lrc.isDefault = true")
	// @formatter:on
	List<LocationRoleConfigDao> listBasedOnRoleCodeAndLocation(@Param("roleCode") String roleCode,
			@Param("locationCodes") Set<String> locationCodes);

	// @formatter:off
		@Query("SELECT lrc " 
				+ " FROM UserEmployeeRoleMapping erm" 
				+ "	LEFT JOIN UserEmployee em"
				+ "		ON erm.employee = em" 
				+ "	LEFT JOIN UserLocationRoleConfig lrc"
				+ "		ON lrc.locationCode = em.locationCode AND lrc.role = erm.role"
				+ "	WHERE em.employeeCode IN (:storeEmployeeCodes) AND lrc.locationCode IS NOT NULL AND erm.employee.userType != 'API'")
		// @formatter:on
	List<LocationRoleConfigDao> listLocationToUpdateByEmp(@Param("storeEmployeeCodes") List<String> storeEmployeeCodes);

	// @formatter:off
		@Query("SELECT lrc "
				+ " FROM UserEmployeeRoleMapping erm"
				+ "	LEFT JOIN UserEmployee em"
				+ "		ON erm.employee = em"
				+ "	LEFT JOIN UserLocationRoleConfig lrc"
				+ "		ON lrc.locationCode = em.locationCode AND lrc.role = erm.role"
				+ "	WHERE erm.isPrimary = false AND em.locationCode IS NOT NULL AND erm.employee.userType != 'API'"
				+ " AND erm.expiryDate IS NOT NULL AND erm.expiryDate <= :currentDate AND lrc.id IS NOT NULL")
		// @formatter:on
	List<LocationRoleConfigDao> listLocationToUpdate(@Param("currentDate") Date currentDate);

}
