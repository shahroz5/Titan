/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.MetalPriceConfigDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface MetalPriceConfigRepository extends JpaRepository<MetalPriceConfigDao, String> {

}
