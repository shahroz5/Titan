package com.titan.poss.sales.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.DiscountConfigDetailsDao;

/**
 * Handles repository operations for <b>discount_config_details</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("salesDiscountConfigDetailsRepository")
public interface DiscountConfigDetailsRepository extends JpaRepository<DiscountConfigDetailsDao, String>{

}
