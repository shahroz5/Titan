/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.ConfigLovDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface ConfigLovRepository extends JpaRepository<ConfigLovDao, String> {

	/**
	 * @param lovType
	 * @param code
	 * @return
	 */
	ConfigLovDao findOneByLovTypeAndCode(String lovType, String code);

	List<ConfigLovDao> findByLovTypeAndIsActiveTrue(String lovType, Pageable pageable);

}
