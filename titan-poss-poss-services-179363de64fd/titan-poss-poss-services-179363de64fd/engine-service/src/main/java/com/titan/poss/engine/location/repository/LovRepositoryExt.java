/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.location.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.LocationLovDao;
import com.titan.poss.location.repository.LovRepository;


/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("engineLovRepository")
public interface LovRepositoryExt extends LovRepository{
	/**
	 * This method will return the List of Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @return List<LocationLov>
	 */
	public List<LocationLovDao> findByLovType(String lovType);
}
