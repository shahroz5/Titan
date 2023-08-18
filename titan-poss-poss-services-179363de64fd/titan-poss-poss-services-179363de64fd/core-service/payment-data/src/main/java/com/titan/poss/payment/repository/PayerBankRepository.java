/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.repository;

import static com.titan.poss.payment.constants.PaymentConstants.PAYER_BANK_REPOSITORY;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.core.dto.PayerBankDto;
import com.titan.poss.payment.dao.PayerBankDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository(PAYER_BANK_REPOSITORY)
public interface PayerBankRepository extends JpaRepository<PayerBankDao, String> {

	/**
	 * @param bankName
	 * @return PayerBankDao
	 */
	PayerBankDao findOneByBankName(String bankName);

	/**
	 * @param bankName
	 * @return
	 */
	List<PayerBankDao> findAllByBankNameIn(Set<String> bankName);

	/**
	 * @param bankList
	 * @return
	 */
	List<PayerBankDao> findByBankNameIn(List<String> bankList);

	/**
	 *
	 * @param activeBankName
	 * @param status
	 * @return  List<PayerBankDao>lastModifiedDate
	 */
    List<PayerBankDao> findAllByBankNameInAndIsActive(List<String> activeBankName, Boolean status);
    
    
    @Query(nativeQuery = true ,value = "SELECT pblm.location_code, pbm.bank_name, pbm.is_active, pbm.created_by, pbm.created_date, pbm.last_modified_by, pbm.last_modified_date   \r\n"
    		+ "from payer_bank_master pbm LEFT join payer_bank_config_details pbcd on pbm.bank_name=pbcd.bank_name\r\n"
    		+ "LEFT join payer_bank_location_mapping pblm on pbcd.config_id = pblm.config_id\r\n"
    		+ "where pblm.location_code= :locationCode and pblm.payment_code='CARD'")
     List<Object[]> getPayerBankLists(@Param("locationCode") String locationCode); 
     
   
    
    @Query("SELECT pbd FROM PayerBankDao pbd WHERE (:bankName IS NULL OR pbd.bankName LIKE '%'+:bankName +'%') AND (:isActive IS NULL OR pbd.isActive = :isActive)")
	Page<PayerBankDao> findPayeeBankName(@Param("isActive")Boolean isActive, Pageable pageable,@Param("bankName") String bankName);
}