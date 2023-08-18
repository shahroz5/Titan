/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.ComplexityDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface ComplexityRepository extends JpaRepository<ComplexityDao, String> {

	/**
	 * This method will return the Complexity details based on the complexityCode.
	 * 
	 * @param complexityCode
	 * @return Complexity
	 */
	public ComplexityDao findOneByComplexityCode(String complexityCode);
	
	//@Query(value = "SELECT c FROM complexity_master c where c.is_active = 0 and c.complexity_code in (:complexityList)")
	//public List<ComplexityDao> findAllComplexityCode(List<String> complexityList);
	
}
