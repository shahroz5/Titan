/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.TaxDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface TaxRepository extends JpaRepository<TaxDao, String> {

	/**
	 * This method will return the list of Tax details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return Page<Tax>
	 */
	public Page<TaxDao> findByIsActive(Boolean isActive, Pageable pageable);

	/**
	 * This method will return the Tax details based on the taxCode.
	 * 
	 * @param taxCode
	 * @return Tax
	 */
	public TaxDao findOneByTaxCode(String taxCode);
}
