/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.AdvanceDao;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesAdvanceRepository")
public interface AdvanceRepository extends JpaRepository<AdvanceDao,String>{
	
	Optional<AdvanceDao> findByIdAndSalesTxnLocationCode(String id, String locationCode);
	
}
