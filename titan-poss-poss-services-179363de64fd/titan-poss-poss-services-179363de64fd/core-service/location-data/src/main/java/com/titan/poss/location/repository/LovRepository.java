/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.LocationLovDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface LovRepository extends JpaRepository<LocationLovDao, String> {

	/**
	 * @param lovType
	 * @param code
	 * @return
	 */
	LocationLovDao findOneByLovTypeAndCode(String lovType, String code);
	
}
