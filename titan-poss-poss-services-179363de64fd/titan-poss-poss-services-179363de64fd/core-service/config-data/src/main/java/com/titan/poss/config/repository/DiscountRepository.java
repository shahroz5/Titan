/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.config.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.DiscountDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("DiscountRepository")
public interface DiscountRepository extends JpaRepository<DiscountDao, String> {

	/**
	 * This method will return the Discount details based on the discountCode.
	 * 
	 * @param discountCode
	 * @return Discount
	 */
	public DiscountDao findOneByDiscountCode(String discountCode);

	/**
	 * @param discountType
	 * @param true1
	 */
	@Modifying
	@Query("UPDATE DiscountDao c SET c.isActive = FALSE WHERE c.discountType = :discountType AND c.isActive = TRUE")
	public void inactivateExistingEmpowermentDiscounts(@Param("discountType") String discountType);

	/**
	 * @param status
	 * @param discountCode
	 * @param discountType
	 * @param clubbingDiscountType
	 * @param pageable
	 * @return
	 */
	@Query("select dm from DiscountDao dm inner join DiscountLocationMappingDao dlm on dm.id = dlm.discount.id\r\n"
			+ "where dm.isActive = 1 AND dlm.isActive = 1 and (GETDATE() between dlm.offerStartDate and dlm.offerEndDate)"
			+ " AND (dm.discountType = (:discountType) OR  nullif(CHOOSE(1,:discountType),'') IS NULL )"
			+ "AND (dm.discountCode = (:discountCode) OR  nullif(CHOOSE(1,:discountCode),'') IS NULL )")
	public Page<DiscountDao> findRunningDiscounts(@Param("discountCode") String discountCode,
			@Param("discountType") String discountType, Pageable pageable);

	/**
	 * @param status
	 * @param discountCode
	 * @param discountType
	 * @param clubbingDiscountType
	 * @param pageable
	 * @return
	 */
	@Query("select dm from DiscountDao dm inner join DiscountLocationMappingDao dlm on dm.id = dlm.discount.id\r\n"
			+ "where dm.isActive = 1 AND dlm.isActive = 1 and (GETDATE() < dlm.offerEndDate OR :businessDate > dlm.offerStartDate) "
			+ " AND (dm.discountType = (:discountType) OR  nullif(CHOOSE(1,:discountType),'') IS NULL) "
			+ "AND (dm.discountCode = (:discountCode) OR  nullif(CHOOSE(1,:discountCode),'') IS NULL )")
	public Page<DiscountDao> findActiveAndNotRunningDiscounts(@Param("discountCode") String discountCode,
			@Param("discountType") String discountType, Pageable pageable);

	/**
	 * @param status
	 * @param discountCode
	 * @param discountType
	 * @param clubbingDiscountType
	 * @param pageable
	 * @return
	 */
	@Query("select dm from DiscountDao dm where dm.isActive = 0 "
			+ " AND (dm.discountType = (:discountType) OR  nullif(CHOOSE(1,:discountType),'') IS NULL) "
			+ "AND (dm.discountCode = (:discountCode) OR  nullif(CHOOSE(1,:discountCode),'') IS NULL )")
	public Page<DiscountDao> findInactiveDiscounts(@Param("discountCode") String discountCode,
			@Param("discountType") String discountType, Pageable pageable);

	/**
	 * @param id
	 * @return
	 */
	@Query("SELECT d from DiscountDao d where d.id = :id")
	public DiscountDao findOneById(@Param("id") String id);

	/**
	 * @param discountCode
	 * @param name
	 * @return
	 */
	public DiscountDao findOneByDiscountCodeAndDiscountType(String discountCode, String name);

	/**
	 * @param discountType
	 */
	@Modifying
	@Query("UPDATE DiscountDao c SET c.isActive = 0  WHERE c.discountType = :discountType AND c.isActive = 1")
	public void inactivateExistingDiscountsByDiscountType(@Param("discountType") String discountType);

	/**
	 * @param discountType
	 * @return
	 */
	@Query("select dm from DiscountDao dm where dm.isActive = 1 and dm.discountType = :discountType")
	public List<DiscountDao> findActiveDiscounts(@Param("discountType") String discountType);
	
	@Transactional
	@Modifying
	@Query("UPDATE DiscountDao c SET c.isPublishPending = 1  WHERE c.id = :id")
	public void updateIsPublishedFlag(@Param("id") String id);
	
}