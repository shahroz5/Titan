/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.GepConfigDetailsDaoExt;

/**
 * Repository for <b>gep_config_details</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("salesGepConfigDetailsRepositoryExt")
public interface GepConfigDetailsRepositoryExt extends JpaRepository<GepConfigDetailsDaoExt, String> {

}
