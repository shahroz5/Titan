/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.MarketDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface MarketRepositoryExt extends MarketRepository {

	/**
	 * This method will return the list of Market details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return Page<Market>
	 */
	public Page<MarketDao> findByIsActive(Boolean isActive, Pageable pageable);

	/**
	 * This method will return the Market details based on the marketCode and
	 * description.
	 * 
	 * @param description
	 * @return Market
	 */
	public MarketDao findOneByDescription(String description);

	/**
	 * This method wil find the market details based on the criteria.
	 * 
	 * @param marketCodes
	 * @param isActiveList
	 * @param pageable
	 * @return
	 */
	@Query("select m from MarketDao m where ((m.marketCode in(:marketCodes) OR nullif(CHOOSE(1,:marketCodes),'') IS NULL) "
			+ "and m.isActive in (:isActiveList))")
	public Page<MarketDao> findAllMarketDetails(@Param("marketCodes") List<String> marketCodes,
			@Param("isActiveList") List<Boolean> isActiveList, Pageable pageable);

	@Query("select m from MarketDao m where ( " + " m.isActive in (:isActiveList) and "
			+ "(m.description in(:descriptions) OR nullif(CHOOSE(1,:descriptions),'') IS NULL) and"
			+ "(m.marketCode in(:marketCodes) OR nullif(CHOOSE(1,:marketCodes),'') IS NULL))")
	public Page<MarketDao> findCombineAllMarketDetails(@Param("marketCodes") List<String> marketCodes,
			@Param("descriptions") List<String> descriptions, @Param("isActiveList") List<Boolean> isActiveList,
			Pageable pageable);

	/**
	 * @param marketCodeList
	 * @param b
	 * @return
	 */
	@Query("Select m from MarketDao m where (m.marketCode in (:marketCodes) and m.isActive=:isActive)")
	public List<MarketDao> getMarkets(@Param("marketCodes") List<String> marketCodeList,
			@Param("isActive") Boolean isActive);
}
