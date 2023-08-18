/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.DiscountDao;
import com.titan.poss.config.dao.DiscountDaoExt;
import com.titan.poss.config.dao.DiscountDetailsDaoExt;
import com.titan.poss.config.dao.DiscountLocationMappingDaoExt;
import com.titan.poss.config.dao.DiscountProductGroupMappingDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface DiscountProductGroupMappingRepositoryExt
		extends JpaRepository<DiscountProductGroupMappingDaoExt, String> {

	@Modifying
	@Query("SELECT d from DiscountProductGroupMappingDaoExt d WHERE d.discount = :discountCode AND d.productGroupCode IN (:productGroupList)")
	List<DiscountProductGroupMappingDaoExt> getProductGroupMapping(@Param("discountCode") DiscountDao discountCode,
			@Param("productGroupList") List<String> productGroupList);

	@Modifying
	@Query("DELETE DiscountProductGroupMappingDaoExt d WHERE d.discount = :discountCode AND d.productGroupCode IN (:productGroupList)")
	void deleteProductGroupMapping(@Param("discountCode") DiscountDao discountCode,
			@Param("productGroupList") List<String> productGroupList);

	/**
	 * @param discountDaoExt
	 * @return
	 */
	List<DiscountProductGroupMappingDaoExt> findAllByDiscount(DiscountDaoExt discountDaoExt);

	@Query("SELECT d from DiscountProductGroupMappingDaoExt d WHERE d.discount = :discountId AND (d.discountDetail = :discountDetailsId OR :discountDetailsId IS NULL) AND (d.karatType = :karatType OR :karatType IS NULL ) AND (d.productType = :productType OR :productType IS NULL ) AND "
			+ "(d.productGroupCode IN (:productGroupCodeList) OR nullif(CHOOSE(1, :productGroupCodeList), '') IS NULL)")
	Page<DiscountProductGroupMappingDaoExt> findAllByProductGroupCodeList(@Param("discountId") DiscountDaoExt discount,
			@Param("discountDetailsId") DiscountDetailsDaoExt discountDetailDao, @Param("karatType") String karatType,
			@Param("productType") String productType, @Param("productGroupCodeList") List<String> productGroupCodeList,
			Pageable pageable);

	/**
	 * @param discountId
	 * @param productGroupList
	 * @param discountType
	 * @return
	 */

	@Query("Select dlm from DiscountProductGroupMappingDaoExt dpm, DiscountLocationMappingDaoExt dlm, DiscountDaoExt dm WHERE dm.id = dpm.discount.id AND dpm.discount.id = dlm.discount.id AND dpm.productGroupCode IN (:productGroupList)"
			+ " AND dm.isActive = 1 AND dpm.discount.id != :discountId AND dpm.discount.discountType = :discountType AND dpm.isActive = 1 AND dpm.discount.id IN "
			+ "(Select distinct(dlm.discount.id) from DiscountLocationMappingDaoExt dlm "
			+ "where dlm.discount.id != :discountId AND dlm.discount.discountType = :discountType AND dlm.isActive = 1 AND dlm.locationCode "
			+ "IN (Select dlm.locationCode from DiscountLocationMappingDaoExt dlm where dlm.discount.id = :discountId and dlm.isActive = 1))")
	List<DiscountLocationMappingDaoExt> getMappedActiveLocations(@Param("discountId") String discountId,
			@Param("productGroupList") List<String> productGroupList, @Param("discountType") String discountType);

	/**
	 * @param discountId
	 * @param productGroupList
	 * @return
	 */
	@Query("SELECT dpm FROM DiscountProductGroupMappingDaoExt dpm WHERE dpm.discount.id = :discountId AND dpm.isActive = 1 AND  "
			+ "(dpm.productGroupCode IN (:productGroupList) OR nullif(CHOOSE(1, :productGroupList), '') IS NULL) AND "
			+ "dpm.karatType IN ('1','2')")
	List<DiscountProductGroupMappingDaoExt> checkBasedOnKaratType(@Param("discountId") String discountId,
			@Param("productGroupList") List<String> productGroupList);
	
	/**
	 * @param discountId
	 * @param productGroupList
	 * @return
	 */
	@Query("SELECT dpm FROM DiscountProductGroupMappingDaoExt dpm WHERE dpm.discount.id = :discountId AND dpm.isActive = 1 AND  "
			+ "(dpm.productGroupCode IN (:productGroupList) OR nullif(CHOOSE(1, :productGroupList), '') IS NULL) AND "
			+ "dpm.productType IN ('MC','UCP')")
	List<DiscountProductGroupMappingDaoExt> checkBasedOnProductType(@Param("discountId") String discountId,
			@Param("productGroupList") List<String> productGroupList);

	/**
	 * @param discountType
	 * @param id
	 * @return
	 */
	@Query("select dlm1 from DiscountProductGroupMappingDaoExt dlm1 WHERE dlm1.discount.id = :id AND dlm1.discount.discountType = :discountType AND  dlm1.isActive = 1")
	List<DiscountProductGroupMappingDaoExt> getActiveProductMapping(@Param("discountType") String discountType,
			@Param("id") String id);

	/**
	 * @param productMappingId
	 * @return
	 */
	DiscountProductGroupMappingDaoExt findOneById(String productMappingId);

	/**
	 * @param removeDetails
	 * @return
	 */
	@Query("select dpm from DiscountProductGroupMappingDaoExt dpm WHERE dpm.discountDetail.id IN (:removeDetails)")
	List<DiscountProductGroupMappingDaoExt> getMappedProducts(@Param("removeDetails") List<String> removeDetails);

	/**
	 * @param discountId
	 * @param productGroups
	 * @param discountDetailId
	 * @return
	 */
	@Query("select dpm from DiscountProductGroupMappingDaoExt dpm, DiscountDetailsDaoExt dd WHERE dd.id != :discountDetailId AND dd.id = dpm.discountDetail.id AND dpm.discount.id = :discountId AND dpm.productGroupCode IN (:productGroups)  AND dpm.isActive = 1")
	List<DiscountProductGroupMappingDaoExt> getByDiscountAndProductGroup(@Param("discountId") String discountId,
			@Param("productGroups") Set<String> productGroups, @Param("discountDetailId") String discountDetailId);

	/**
	 * @param id
	 * @return
	 */
	@Query("select dpm from DiscountProductGroupMappingDaoExt dpm WHERE dpm.discountDetail.id = :discountDetailId AND dpm.isActive = 1")
	List<DiscountProductGroupMappingDaoExt> getProductByDiscountDetailId(
			@Param("discountDetailId") String discountDetailId);

}
