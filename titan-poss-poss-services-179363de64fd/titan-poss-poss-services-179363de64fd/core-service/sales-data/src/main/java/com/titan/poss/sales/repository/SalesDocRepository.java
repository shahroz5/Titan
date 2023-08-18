/*  
 * Copyright 2019. Titan Company Limited
 */
package com.titan.poss.sales.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.SalesDocDao;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesDocRepository")
public interface SalesDocRepository extends JpaRepository<SalesDocDao, String>{

	Optional<SalesDocDao> findOneByLocationCodeAndDocTypeAndFiscalYear(String locationCode, String docType,
			Short fiscalYear);

}
