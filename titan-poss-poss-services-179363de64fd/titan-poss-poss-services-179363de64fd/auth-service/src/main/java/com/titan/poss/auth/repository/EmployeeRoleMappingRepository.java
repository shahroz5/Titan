
/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.auth.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.auth.dao.EmployeeDao;
import com.titan.poss.auth.dao.EmployeeRoleMappingDao;

/**
 * Handles repository operations for <b>RoleMaster</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("authEmployeeRoleMappingRepo")
public interface EmployeeRoleMappingRepository extends JpaRepository<EmployeeRoleMappingDao, String> {

	List<EmployeeRoleMappingDao> findByEmployee(EmployeeDao employee);
}
