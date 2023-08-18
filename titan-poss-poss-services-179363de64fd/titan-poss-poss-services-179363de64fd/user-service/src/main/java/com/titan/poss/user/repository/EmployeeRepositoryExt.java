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
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.EmployeeDao;
import com.titan.poss.user.dto.response.EmployeeListDto;

/**
 * Handles repository operations for <b>Employee</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("UserEmployeeRepositoryExt")
public interface EmployeeRepositoryExt extends EmployeeRepository {
	
	int countByEmailIdAndIsActiveAndEmployeeCodeNot(@Param("emailId")String emailId, @Param("isActive")Boolean isActive,  @Param("employeeCode") String employeeCode);
	
	int countByMobileNoAndIsActiveAndEmployeeCodeNot(@Param("mobileNo") String mobileNo, @Param("isActive")Boolean isActive, @Param("employeeCode") String employeeCode);

	int countByEmailIdAndIsActive(String emailId, Boolean isActive);
	int countByMobileNoAndIsActive(String mobileNo, Boolean isActive);
	
	Optional<EmployeeDao> findByEmployeeCodeAndOrgCodeAndIsActive(String id, String orgCode,Boolean isActive);

	Optional<EmployeeDao> findByMobileNoAndOrgCodeAndIsActive(String mobileNo, String orgCode,Boolean isActive);
	
	Optional<EmployeeDao> findByEmailIdAndOrgCodeAndIsActive(String emailId, String orgCode,Boolean isActive);

	
	Optional<EmployeeDao> findByEmployeeCodeAndLocationCodeAndOrgCode(String employeeCode, String locationCode,
			String orgCode);

	// @formatter:off
	@Query("SELECT em FROM UserEmployee em \r\n"
			+ " WHERE em.isActive = 1 \r\n"
			+ "	AND ((:locationCategory = 'LOC' AND em.locationCode = :locationCode)"
			+ " 	OR (:locationCategory = 'REG' AND em.regionCode = :locationCode)"
			+ " 	OR (:locationCategory = 'ORG' AND em.orgCode = :locationCode))")
	// @formatter:on
	List<EmployeeDao> listAllActiveByLocationCode(@Param("locationCode") String locationCode,
			@Param("locationCategory") String locationCategory);

	// @formatter:off
	@Query("SELECT em FROM UserEmployee em \r\n"
			+ " WHERE em.isActive = 0 \r\n"
			+ " AND (em.resignationDate IS NULL OR em.resignationDate > :now) \r\n"
			+ "	AND ((:locationCategory = 'LOC' AND em.locationCode = :locationCode)"
			+ " 	OR (:locationCategory = 'REG' AND em.regionCode = :locationCode)"
			+ " 	OR (:locationCategory = 'ORG' AND em.orgCode = :locationCode))")
	// @formatter:on
	List<EmployeeDao> listAllActiveElligibleByLocationCode(@Param("locationCode") String locationCode,
			@Param("locationCategory") String locationCategory, @Param("now") Date now);

	// @formatter:off
	@Query("SELECT new com.titan.poss.user.dto.response.EmployeeListDto(em.employeeCode, em.empName, "
			+ " CASE "
			+ "		WHEN (em.userType IN (:storeUserTypes)) THEN em.locationCode "
			+ "		WHEN (em.userType = :regionUserType) THEN em.regionCode "
			+ "		WHEN (em.userType = :orgUserType) THEN em.orgCode "
			+ " END, "
			+ " em.userType, ul.isLoginActive, ul.isLocked, em.isActive, em.employeeType, erm.role.roleCode, rm.roleName, em.mobileNo) "
			+ " FROM UserEmployee em \r\n"
			+ " LEFT JOIN UserLogin ul \r\n"
			+ "		ON em.employeeCode = ul.employee.employeeCode \r\n"
			+ " LEFT JOIN com.titan.poss.user.dao.EmployeeRoleMappingDao erm \r\n"
			+ "		ON em.employeeCode = erm.employee.employeeCode AND erm.isPrimary = true \r\n"
			+ " LEFT JOIN com.titan.poss.user.dao.RoleDao rm \r\n"
			+ "		ON erm.role = rm \r\n"
			+ " WHERE ((:searchField1 IS NULL OR em.employeeCode = :searchField1) \r\n"
			+ " OR (:searchField2 IS NULL OR em.empName = :searchField2)) \r\n"
			+ " AND (:userType IS NULL OR em.userType = :userType) \r\n"
			+ " AND (:employeeType IS NULL OR em.employeeType = :employeeType) \r\n"
			+ " AND (:isActive IS NULL OR em.isActive = :isActive) \r\n"
			+ " AND (:orgCode IS NULL OR em.orgCode = :orgCode) \r\n"
			+ " AND (nullif(CHOOSE(1,:locationCodes),'') IS NULL OR em.locationCode IN (:locationCodes)) \r\n"
			+ " AND (nullif(CHOOSE(1,:regionCodes),'') IS NULL OR em.regionCode IN (:regionCodes)) \r\n"
			+ " AND (nullif(CHOOSE(1,:roleCodes),'') IS NULL OR erm.role.roleCode IN (:roleCodes))")
	// @formatter:on
	Page<EmployeeListDto> listAllEmployees(@Param("searchField1") String searchField1,
			@Param("searchField2") String searchField2, @Param("userType") String userType,
			@Param("employeeType") String employeeType, @Param("isActive") Boolean isActive,
			@Param("locationCodes") Set<String> locationCodes, @Param("regionCodes") Set<String> regionCodes,
			@Param("roleCodes") Set<String> roleCodes, @Param("orgCode") String orgCode,
			@Param("storeUserTypes") List<String> storeUserTypes, @Param("regionUserType") String regionUserType,
			@Param("orgUserType") String orgUserType, Pageable pageable);

}
