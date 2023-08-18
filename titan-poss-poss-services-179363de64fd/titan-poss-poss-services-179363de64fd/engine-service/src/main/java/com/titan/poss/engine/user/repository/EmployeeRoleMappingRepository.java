package com.titan.poss.engine.user.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;


import com.titan.poss.user.dao.EmployeeRoleMappingDao;

@Repository("engineEmployeeRoleMappingRepository")
public interface EmployeeRoleMappingRepository extends JpaRepository<EmployeeRoleMappingDao, String> {

	
	// @formatter:off
		@Query("select erm" + " FROM UserEmployeeRoleMapping erm"
				+ " WHERE erm.employee.employeeCode = :empCode")
		// @formatter:on
		List<EmployeeRoleMappingDao> findByEmployeeCode(@Param("empCode") String empCode);
}
