package com.titan.poss.user.repository;

import java.util.List;
import java.util.Set;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.EmployeeLocationMappingDao;

@Repository("employeeLocationMappingRepository")
public interface EmployeeLocationMappingRepository extends JpaRepository<EmployeeLocationMappingDao, String> {

	/**
	 * This method will return the list of location codes based on employeeCode and
	 * locations.
	 * 
	 * @param ruleId
	 * @param addLocations
	 * @return List<LocationCodeDto>
	 */

	List<EmployeeLocationMappingDao> findByEmployeeEmployeeCodeAndLocationCodeIn(String employeeCode,
			Set<String> addLocations);

	List<EmployeeLocationMappingDao> findByEmployeeEmployeeCode(String employeeCode);

	@Transactional
	void deleteAllByEmployeeEmployeeCode(String employeeCode);

}
