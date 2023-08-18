/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.DiscountDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface DiscountRepositoryExt extends JpaRepository<DiscountDaoExt, String> {

	/**
	 * This method will return the Discount details based on the discountCode.
	 * 
	 * @param discountCode
	 * @return Discount
	 */
	public DiscountDaoExt findOneByDiscountCode(String discountCode);

	/**
	 * @param discountType
	 * @param true1
	 */
	@Modifying
	@Query("UPDATE DiscountDaoExt c SET c.isActive = FALSE WHERE c.discountType = :discountType AND c.isActive = TRUE")
	public void inactivateExistingDiscountsByDiscountType(@Param("discountType") String discountType);

	/**
	 * @param status
	 * @param discountCode
	 * @param discountType
	 * @param today
	 * @param published
	 * @param clubbingDiscountType
	 * @param pageable
	 * @return
	 */
	@Query("select dm from DiscountDaoExt dm where dm.id IN (select dlm.discount.id from DiscountLocationMappingDao dlm WHERE dm.id = dlm.discount.id\r\n"
			+ "AND dm.isActive = 1 AND dlm.isActive = 1 and ((:today between dlm.offerStartDate and dlm.offerEndDate)) OR "
			+ "(dm.discountType = 'EMPOWERMENT_DISCOUNT' and dm.isActive = 1))"
			+ " AND (dm.discountType = (:discountType) OR  nullif(CHOOSE(1,:discountType),'') IS NULL )"
			+ "AND (dm.discountCode LIKE '%'+:discountCode +'%' OR  nullif(CHOOSE(1,:discountCode),'') IS NULL ) AND (:published IS NULL OR dm.isPublishPending = :published)"
			+ " AND (dm.occasion LIKE '%'+:occasion +'%' OR  nullif(CHOOSE(1,:occasion),'') IS NULL )"
			+ " AND ((dm.isCreatedByWorkflow = 1 AND dm.publishTime IS NOT NULL) OR (dm.isCreatedByWorkflow = 0))")
	public Page<DiscountDaoExt> findRunningDiscounts(@Param("discountCode") String discountCode,
			@Param("occasion") String occasion, @Param("discountType") String discountType, @Param("today") Date today,
			@Param("published") Boolean published, Pageable pageable);

	/**
	 * @param status
	 * @param discountCode
	 * @param discountType
	 * @param today
	 * @param published
	 * @param clubbingDiscountType
	 * @param pageable
	 * @return
	 */
	@Query("select dm from DiscountDaoExt dm where dm.id IN (select dlm.discount.id from DiscountLocationMappingDao dlm WHERE dm.id = dlm.discount.id\r\n"
			+ "AND dm.isActive = 1 AND dlm.isActive = 1 and (:today not between dlm.offerStartDate and dlm.offerEndDate)) "
			+ "AND dm.id NOT IN (select distinct(dlm1.discount.id) from DiscountLocationMappingDao dlm1 WHERE dm.id = dlm1.discount.id\r\n"
			+ "AND dm.isActive = 1 AND dlm1.isActive = 1 AND (:today between dlm1.offerStartDate and dlm1.offerEndDate))"
			+ " AND (dm.discountType = (:discountType) OR  nullif(CHOOSE(1,:discountType),'') IS NULL) "
			+ "AND (dm.discountCode LIKE '%'+:discountCode +'%' OR  nullif(CHOOSE(1,:discountCode),'') IS NULL ) AND (:published IS NULL OR dm.isPublishPending = :published)"
			+ " AND (dm.occasion LIKE '%'+:occasion +'%' OR  nullif(CHOOSE(1,:occasion),'') IS NULL )"
			+ "AND ((dm.isCreatedByWorkflow = 1 AND dm.publishTime IS NOT NULL) OR (dm.isCreatedByWorkflow = 0))")
	public Page<DiscountDaoExt> findActiveAndNotRunningDiscounts(@Param("discountCode") String discountCode,
			@Param("occasion") String occasion, @Param("discountType") String discountType, @Param("today") Date today,
			@Param("published") Boolean published, Pageable pageable);

	/**
	 * @param status
	 * @param discountCode
	 * @param discountType
	 * @param published
	 * @param clubbingDiscountType
	 * @param pageable
	 * @return
	 */
	@Query("select dm from DiscountDaoExt dm where dm.isActive = 0 "
			+ " AND (dm.discountType = (:discountType) OR  nullif(CHOOSE(1,:discountType),'') IS NULL) "
			+ "AND (dm.discountCode LIKE '%'+:discountCode +'%' OR  nullif(CHOOSE(1,:discountCode),'') IS NULL ) AND (:published IS NULL OR dm.isPublishPending = :published)"
			+ " AND (dm.occasion LIKE '%'+:occasion +'%' OR  nullif(CHOOSE(1,:occasion),'') IS NULL )"
			+ " AND ((dm.isCreatedByWorkflow = 1 AND dm.publishTime IS NOT NULL) OR (dm.isCreatedByWorkflow = 0))")
	public Page<DiscountDaoExt> findInactiveDiscounts(@Param("discountCode") String discountCode,
			@Param("occasion") String occasion, @Param("discountType") String discountType,
			@Param("published") Boolean published, Pageable pageable);

	@Query("Select dm from DiscountDaoExt dm where (dm.discountCode LIKE '%'+:discountCode +'%' OR  nullif(CHOOSE(1,:discountCode),'') IS NULL)"
			+ " AND ((dm.isCreatedByWorkflow = 1 AND dm.publishTime IS NOT NULL) OR (dm.isCreatedByWorkflow = 0))")
	public List<DiscountDaoExt> findByDiscountCodeUsingLike(@Param("discountCode") String discountCode);

	/**
	 * @param discountId
	 * @return
	 */
	public DiscountDaoExt findOneById(String discountId);

	public List<DiscountDaoExt> findByDiscountCodeIn(List<String> addLinks);

	/**
	 * @param discountId
	 * @param b
	 * @return
	 */
	public DiscountDaoExt findOneByIdAndIsActive(String discountId, boolean b);

	/**
	 * @param clubbingDiscountType
	 * @param pageable
	 * @return
	 */
	@Query("select dm from DiscountDaoExt dm where dm.isActive = 1 and dm.discountType !='COIN_OFFER_DISCOUNT' and json_value(club_discount_type,'$.data.discountType')=:clubbingDiscountType "
			+ " AND json_value(club_discount_type,'$.data.isClubbedOtherDiscounts')='true'"
			+ " AND ((dm.isCreatedByWorkflow = 1 AND dm.publishTime IS NOT NULL) OR (dm.isCreatedByWorkflow = 0))")
	public Page<DiscountDaoExt> findDiscountsForClubbingRule(@Param("clubbingDiscountType") String clubbingDiscountType,
			Pageable pageable);

	/**
	 * @param discountType
	 */
	@Query("select dm from DiscountDaoExt dm where dm.isActive = 1 AND dm.discountType = :discountType")
	public List<DiscountDaoExt> findActiveDiscount(@Param("discountType") String discountType);

	/**
	 * @param discountType
	 * @param discountCode
	 * @param published
	 * @param pageable
	 * @return
	 */
	@Query("select dm from DiscountDaoExt dm WHERE (:discountType IS NULL or dm.discountType = :discountType) AND (:discountCode IS NULL or dm.discountCode LIKE '%'+:discountCode +'%') "
			+ "AND (:published IS NULL OR dm.isPublishPending = :published) AND (:occasion IS NULL or dm.occasion LIKE '%'+:occasion +'%')  AND (:isActive IS NULL OR dm.isActive = :isActive)" 
			+ " AND ((dm.isCreatedByWorkflow = 1 AND dm.publishTime IS NOT NULL) OR (dm.isCreatedByWorkflow = 0))")
	public Page<DiscountDaoExt> getDiscounts(@Param("discountType") String discountType,
			@Param("discountCode") String discountCode, @Param("occasion") String occasion,
			@Param("published") Boolean published, @Param("isActive") Boolean isActive, Pageable pageable);

	/**
	 * @param processId
	 * @return
	 */
	public DiscountDaoExt findOneByWorkflowProcessId(String processId);

}
