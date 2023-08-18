/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.repository;

import static com.titan.poss.payment.constants.PaymentConstants.PAYMENT_GL_CODE_MAPPING_REPOSITORY;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.GLBoutiqueCodeMappingDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository(PAYMENT_GL_CODE_MAPPING_REPOSITORY)
public interface GLBoutiqueCodeMappingRepository extends JpaRepository<GLBoutiqueCodeMappingDao, String> {

	/*
	 * List all GL Code By Locations
	 */
	List<GLBoutiqueCodeMappingDao> findByLocationCodeIn(List<String> locationCodes);

	/*
	 * List all GL Code By Locations and Payment Codes
	 */
	List<GLBoutiqueCodeMappingDao> findByPaymentPaymentCodeInAndLocationCodeIn(List<String> paymentCodes,
			List<String> removeLocations);

	/**
	 * 
	 * @param locationCode
	 * @param pageable
	 * @return Page<GLBoutiqueCodeMappingDao>
	 */
	@Query("SELECT gbc FROM GLBoutiqueCodeMappingDao gbc where (:locationCode IS NULL OR gbc.locationCode LIKE '%'+:locationCode +'%')")
	Page<GLBoutiqueCodeMappingDao> findByLocationCodeIn(@Param("locationCode") List<String> locationCode, Pageable pageable);

	/**
	 * 
	 * @param idList
	 * @return
	 */
	List<GLBoutiqueCodeMappingDao> findByIdIn(List<String> idList);
}
