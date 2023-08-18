/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.repository;

import static com.titan.poss.payment.constants.PaymentConstants.PAYMENT_GL_CODE_REPOSITORY;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.GLBoutiqueCodeDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository(PAYMENT_GL_CODE_REPOSITORY)
public interface GLBoutiqueCodeRepository extends JpaRepository<GLBoutiqueCodeDao, String> {

	/*
	 * List All GL Code By Location Code
	 */
	GLBoutiqueCodeDao findByLocationCode(String locationCode);

	/**
	 * @param locationCode
	 * @return
	 */
	@Query("SELECT g FROM GLBoutiqueCodeDao g WHERE location_code = :locationCode")
	GLBoutiqueCodeDao getCostCenterCode(@Param("locationCode") String locationCode);

	@Query("SELECT g FROM GLBoutiqueCodeDao g WHERE (:locationCode IS NULL OR g.locationCode LIKE %:locationCode%) AND (:isActive IS NULL OR g.isActive = :isActive)")
	Page<GLBoutiqueCodeDao> getResults(@Param("locationCode")String locationCode, @Param("isActive")Boolean isActive, Pageable pageable);
}
