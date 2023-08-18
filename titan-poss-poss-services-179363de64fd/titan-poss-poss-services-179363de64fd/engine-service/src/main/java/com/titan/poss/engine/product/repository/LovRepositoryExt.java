/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.product.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.ProdLovDao;
import com.titan.poss.product.repository.LovRepository;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository("EngineLovRepositoryExt")
public interface LovRepositoryExt extends LovRepository {

	List<ProdLovDao> findByLovType(String lovType);

	List<ProdLovDao> findByLovTypeAndIsActiveTrue(String lovType);

}
