/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.OrganizationDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface OrganizationRepository extends JpaRepository<OrganizationDao, String> {

	/**
	 * This method will return the Organization details based on the orgCode.
	 * 
	 * @param orgCode
	 * @return Organization
	 */
	public OrganizationDao findOneByOrgCode(String orgCode);

}
