/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.engine.user.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.user.notification.dao.UserEmitterMappingDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("EngineUserEmitterRepository")
public interface UserEmitterRepository extends JpaRepository<UserEmitterMappingDao, String> {

	List<UserEmitterMappingDao> findByEmployeeCode(String employeeCode);

}
