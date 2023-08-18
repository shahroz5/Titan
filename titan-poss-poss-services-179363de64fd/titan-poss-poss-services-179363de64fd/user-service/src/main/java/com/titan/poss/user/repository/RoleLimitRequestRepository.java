/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.RoleLimitRequestDao;

/**
 * Handles repository operations for <b>RoleLimitRequest</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("UserRoleLimitRequestRepository")
public interface RoleLimitRequestRepository extends JpaRepository<RoleLimitRequestDao, Integer> {

	RoleLimitRequestDao findFirstByOrderByIdDesc();

	List<RoleLimitRequestDao> findByStatusAndReqLocationCode(String reqStatus, String locationCode);

}
