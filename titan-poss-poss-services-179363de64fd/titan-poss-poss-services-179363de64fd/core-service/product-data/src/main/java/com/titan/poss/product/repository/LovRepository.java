/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.ProdLovDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("ProductLovRepo")
public interface LovRepository extends JpaRepository<ProdLovDao, String> {

	/**
	 * @param lovType
	 * @param code
	 * @return
	 */
	ProdLovDao findOneByLovTypeAndCode(String lovType, String code);

}
