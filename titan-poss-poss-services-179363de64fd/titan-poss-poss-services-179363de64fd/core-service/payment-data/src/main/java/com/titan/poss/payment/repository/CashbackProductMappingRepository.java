/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.repository;

import static com.titan.poss.payment.constants.PaymentConstants.CASHBACK_PRODUCT_REPOSITORY;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.CashbackProductMappingDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository(CASHBACK_PRODUCT_REPOSITORY)
public interface CashbackProductMappingRepository extends JpaRepository<CashbackProductMappingDao, String> {

	/*
	 * This method will return the products mapped to cashback id.
	 * 
	 * @param cashBackId
	 * 
	 * @return List<CashbackProductMappingDao>
	 */
	@Query("SELECT cp FROM CashbackProductMappingDao cp WHERE cp.cashbackDao.id = :cashBackId")
	List<CashbackProductMappingDao> findMappedProduct(@Param("cashBackId") String cashBackId);

	/*
	 * This method will return the cashback product mapping based on cardNumber.
	 * 
	 * @param cardNumber
	 * 
	 * @return List<CashbackProductMappingDao>
	 */
	@Query("SELECT cpm.productGroupCode FROM CashbackProductMappingDao cpm WHERE cpm.cashbackDao.id = :offerId")
	List<String> getMappedProductGroups(@Param("offerId") String offerId);

	/**
	 * @param removeIdList
	 * @return
	 */
	List<CashbackProductMappingDao> findByIdIn(@Param("removeIdList") List<String> removeIdList);

	/**
	 * @param id
	 * @param productGroupCode
	 * @return CashbackProductMappingDao
	 */
	@Query("SELECT cp FROM CashbackProductMappingDao cp WHERE cp.cashbackDao.id = :cashBackId AND cp.productGroupCode = :productGroupCode")
	CashbackProductMappingDao getByCashBackIdAndProductGroup(@Param("cashBackId") String cashBackId,
			@Param("productGroupCode") String productGroupCode);
}
