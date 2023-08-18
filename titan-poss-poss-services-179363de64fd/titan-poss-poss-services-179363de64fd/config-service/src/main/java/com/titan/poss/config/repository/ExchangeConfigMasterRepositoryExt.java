/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.ExchangeConfigMasterDaoExt;
import com.titan.poss.config.dto.response.TepExceptionErrorResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface ExchangeConfigMasterRepositoryExt extends JpaRepository<ExchangeConfigMasterDaoExt, String> {

	ExchangeConfigMasterDaoExt findByConfigIdAndConfigType(String configId, String configType);

	/**
	 * This query should be used only when config_type is TEP_GLOBAL or
	 * CUT_PIECE_TEP
	 */
	Optional<ExchangeConfigMasterDaoExt> findByConfigTypeAndIsActiveTrue(String configType);

	//@formatter:off
	/**
	 * This query will be used to check start date,end date is overlapping between
	 * any date or not based on location codes,customer mobile nos,item code and config id. 
	 * If record is available then count should be more than 0.
	 * This query is used only for TEP_EXCEPTION config type.
	 */
	@Query(value="select new com.titan.poss.config.dto.response.TepExceptionErrorResponseDto(loc.locationCode,ecm.configId,ecm.description,ecm.configType,"
			+ " ecm.itemCode,ecm.startDate,ecm.endDate,cus.customerMobileNo)"
			+ " from ExchangeConfigMasterDaoExt ecm,ExchangeConfigCustomerMappingDaoExt cus,"
			+ " ExchangeConfigLocationMappingDaoExt loc where loc.exchangeConfig.configId=ecm.configId "
			+ " and cus.exchangeConfig.configId=ecm.configId and ecm.configId != :configId"
			+ " and (:startDate between ecm.startDate and ecm.endDate or :endDate between ecm.startDate and ecm.endDate) "
			+ " and ecm.itemCode = :itemCode and cus.customerMobileNo in (:customerMobileNos) "
			+ " and loc.locationCode in (select l.locationCode from ExchangeConfigLocationMappingDaoExt l where "
			+ " l.exchangeConfig.configId = :configId)")
	//@formatter:on
	List<TepExceptionErrorResponseDto> checkExchangeConfigExist(@Param("configId") String configId,
			@Param("startDate") Date startDate, @Param("endDate") Date endDate, @Param("itemCode") String itemCode,
			@Param("customerMobileNos") Collection<String> customerMobileNos);

	/**
	 * This query should be used for configType: TEP_GENERAL_CODES
	 */
	ExchangeConfigMasterDaoExt findByItemCodeAndConfigType(String itemCode, String configType);

	/**
	 * This query should be used for configType: TEP_CUT_PIECE_TOT
	 */
	ExchangeConfigMasterDaoExt findByItemCodeAndKaratAndConfigType(String itemCode, BigDecimal karat,
			String configType);

	Optional<ExchangeConfigMasterDaoExt> findByConfigTypeAndDescriptionAndIsActiveTrue(String configType,
			String description);

	@Query("SELECT ec FROM ExchangeConfigMasterDaoExt ec WHERE (:description IS NULL OR ec.description LIKE '%'+:description +'%') AND (:isActive IS NULL OR ec.isActive = :isActive)")
	Page<ExchangeConfigMasterDaoExt> findAllGepConfig(@Param("description")String description, @Param("isActive")Boolean isActive, Pageable pageable);

	@Query("SELECT ecm FROM ExchangeConfigMasterDaoExt ecm WHERE (:description IS NULL OR ecm.description LIKE '%'+:description+ '%') AND (:itemCode IS NULL OR ecm.itemCode = :itemCode) AND (:configType IS NULL OR ecm.configType = :configType) AND (:isActive IS NULL OR ecm.isActive = :isActive)")
	Page<ExchangeConfigMasterDaoExt> findAllConfigType(@Param("description")String description,@Param("itemCode") String itemCode, @Param("isActive")Boolean isActive, @Param("configType") String configType, Pageable pageable);
}
