/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.ExchangeConfigProductMappingDao;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Repository("exchangeConfigProductMappingRepository")
public interface ExchangeConfigProductMappingRepository extends JpaRepository<ExchangeConfigProductMappingDao, String> {

	/**
	 * @param configId
	 * @param rangeId
	 * @param productCategoryCode
	 * @param productGroupCode
	 * @return ExchangeConfigProductMappingDao
	 */
	ExchangeConfigProductMappingDao findByExchangeConfigConfigIdAndRangeIdAndProductCategoryCodeAndProductGroupCode(
			String configId, String rangeId, String productCategoryCode, String productGroupCode);

	/**
	 * @param gepConfigId
	 * @param gepPurity
	 * @param productGroupCode
	 * @return ExchangeConfigProductMappingDao
	 */
	@Query("SELECT ecp FROM ExchangeConfigProductMappingDao ecp WHERE ecp.range.id IN (SELECT r.id FROM RangeMasterDao r WHERE :gepPurity BETWEEN r.fromRange AND r.toRange "
			+ " AND r.rangeType = 'GEP_GOLD_PURITY' AND r.isActive = 1 ) AND ecp.exchangeConfig.configId = :gepConfigId AND ecp.productGroupCode = :productGroupCode ")
	ExchangeConfigProductMappingDao validateProductGroup(@Param("gepConfigId") String gepConfigId,
			@Param("gepPurity") BigDecimal gepPurity, @Param("productGroupCode") String productGroupCode);

	/**
	 * This method will get product group code based on config Id and purity.
	 * 
	 * @param gepConfigId
	 * @param gepPurity
	 * @return List<String>
	 */
	// @formatter:off
	@Query("SELECT ecp FROM ExchangeConfigProductMappingDao ecp \r\n"
			+ " WHERE ecp.range.id IN (	SELECT r.id FROM RangeMasterDao r \r\n"
			+ "							WHERE :gepPurity BETWEEN r.fromRange AND r.toRange \r\n"
			+ " 						AND r.rangeType = 'GEP_GOLD_PURITY' AND r.isActive = 1 \r\n"
			+ " ) \r\n"
			+ " AND ecp.exchangeConfig.configId = :gepConfigId")
	// @formatter:on
	List<ExchangeConfigProductMappingDao> findByExchangeCongifIdAndPurity(@Param("gepConfigId") String gepConfigId,
			@Param("gepPurity") BigDecimal gepPurity);

}
