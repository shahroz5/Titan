/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.repository;

import static com.titan.poss.payment.constants.PaymentConstants.PAYEE_BANK_REPOSITORY;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.PayeeBankDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository(PAYEE_BANK_REPOSITORY)
public interface PayeeBankRepository extends JpaRepository<PayeeBankDao, String> {

	/**
	 * @param bankName
	 * @return PayerBankDao
	 */
	PayeeBankDao findOneByBankName(String bankName);
	

	/**
	 * 
	 * @param payeeBankList
	 * @param status
	 * @return
	 */
	List<PayeeBankDao> findAllByBankNameInAndIsActive(List<String> payeeBankList, Boolean status);


	@Query("SELECT pb FROM PayeeBankDao pb WHERE (:bankName IS NULL OR pb.bankName LIKE %:bankName%) AND (:isActive IS NULL OR pb.isActive = :isActive)")
	Page<PayeeBankDao> getPayeeBankList(@Param("bankName")String bankName,@Param("isActive")Boolean isActive, Pageable pageable);
	
	@Query("SELECT pb.isActive FROM PayeeBankDao pb WHERE (:bankName IS NULL OR pb.bankName = :bankName)")
	
	Boolean getIsActive(@Param("bankName") String bankName);

}
