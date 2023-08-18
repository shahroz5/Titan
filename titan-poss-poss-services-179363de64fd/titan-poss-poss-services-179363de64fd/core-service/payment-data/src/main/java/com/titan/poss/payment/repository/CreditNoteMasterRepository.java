/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.titan.poss.payment.dao.CreditNoteMasterDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface CreditNoteMasterRepository extends JpaRepository<CreditNoteMasterDao, String> {

	/**
	 * @param creditNoteType
	 * @return
	 */
	CreditNoteMasterDao findOneByCreditNoteType(String creditNoteType);

	/**
	 * @param b
	 * @return
	 */
	List<CreditNoteMasterDao> findByIsActive(boolean isActive);
	
	@Query("SELECT cn FROM CreditNoteMasterDao cn WHERE (:creditNoteType IS NULL OR cn.creditNoteType LIKE '%'+:creditNoteType +'%') AND (:isActive IS NULL OR cn.isActive = :isActive)")
	Page<CreditNoteMasterDao> findCnType(@Param("creditNoteType")String creditNoteType, @Param("isActive")Boolean isActive, Pageable pageable);

}
