/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.UserLovDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("UserLovRepository")
public interface UserLovRepository extends JpaRepository<UserLovDao, String> {

	/**
	 * This method will return the List of LOV details based on the lovType
	 * 
	 * @param lovType
	 * @return List<UserLov>
	 */
	public List<UserLovDao> findByLovTypeOrderByOrdersAsc(String lovType);
}
