/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.GrnDao;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface GrnRepository extends JpaRepository<GrnDao, String> {

}
