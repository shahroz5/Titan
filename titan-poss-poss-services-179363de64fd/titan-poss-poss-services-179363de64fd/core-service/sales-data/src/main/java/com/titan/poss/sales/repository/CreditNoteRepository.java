/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.CreditNoteDao;
import com.titan.poss.sales.dao.SalesTxnDao;

/**
 * Repository for CreditNoteDaoExt.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("salesCreditNoteRepository")
public interface CreditNoteRepository extends JpaRepository<CreditNoteDao, String> {

	List<CreditNoteDao> findByLinkedTxn(SalesTxnDao txnId);

	/**
	 * @param txnId
	 * @return
	 */
	@Query("SELECT c FROM CreditNoteDao c WHERE c.linkedTxn.id= :txnId")
	List<CreditNoteDao> findAllByLinkedTxn(@Param("txnId") String txnId);

	/**
	 * @param id
	 * @return
	 */
	CreditNoteDao findOneById(String id);

}
