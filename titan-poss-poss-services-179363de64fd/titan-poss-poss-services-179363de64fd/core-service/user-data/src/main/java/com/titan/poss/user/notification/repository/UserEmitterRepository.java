package com.titan.poss.user.notification.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.user.notification.dao.UserEmitterMappingDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("UserEmitterRepository")
public interface UserEmitterRepository extends JpaRepository<UserEmitterMappingDao, String> {

	List<UserEmitterMappingDao> findByEmployeeCode(String employeeCode);

}
