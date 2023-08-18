/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.CashbackDaoExt;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface CashbackRepositoryExt extends JpaRepository<CashbackDaoExt, String>{
	
	@Query("SELECT cbd FROM CashbackDaoExt cbd WHERE (:bankName IS NULL OR cbd.payerBankName.bankName LIKE '%'+:bankName +'%') AND (:isActive IS NULL OR cbd.payerBankName.isActive = :isActive)")
	Page<CashbackDaoExt> findAllBankName(@Param("bankName")String bankName, @Param("isActive")Boolean isActive, Pageable pageable);

}
