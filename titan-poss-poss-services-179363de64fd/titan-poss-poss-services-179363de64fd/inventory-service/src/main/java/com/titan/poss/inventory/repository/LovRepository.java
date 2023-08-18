/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.inventory.dao.InvLovDaoExt;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository("InventoryLovRepo")
public interface LovRepository extends JpaRepository<InvLovDaoExt, String> {

	/**
	 * This method will return the List of Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @return List<InvLov>
	 */
	List<InvLovDaoExt> findByLovType(String lovType);
	
	List<InvLovDaoExt> findByLovTypeAndIsActive(String lovType,Boolean isActive);

}
