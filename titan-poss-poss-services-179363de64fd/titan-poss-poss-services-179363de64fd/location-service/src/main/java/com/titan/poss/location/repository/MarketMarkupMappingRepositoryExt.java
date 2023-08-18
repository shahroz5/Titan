/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.MarketDao;
import com.titan.poss.location.dao.MarketMarkupMappingDaoExt;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("locationMarketMarkupRepo")
public interface MarketMarkupMappingRepositoryExt extends JpaRepository<MarketMarkupMappingDaoExt, String> {

	List<MarketMarkupMappingDaoExt> findByMarket(MarketDao market);

	@Query("select m from MarketMarkupMappingDaoExt m where ((m.market.marketCode in(:marketCodes) OR nullif(CHOOSE(1,:marketCodes),'') IS NULL)) order by  m.market")
	Page<MarketMarkupMappingDaoExt> findAllMarketMarkupDetails(@Param("marketCodes") List<String> marketCodes,
			Pageable pageable);
	// where si.id = :id AND si.status = 'OPEN'")

	@Query("select m from MarketMarkupMappingDaoExt m where ((m.market.marketCode in(:marketCodes) OR nullif(CHOOSE(1,:marketCodes),'') IS NULL)"
			+ "and (m.metalTypeCode= :metalTypeCode OR :metalTypeCode IS NULL )) order by  m.market")
	Page<MarketMarkupMappingDaoExt> findAllMetalPriceDetails(@Param("marketCodes") List<String> marketCodes,
			@Param("metalTypeCode") String metalTypeCode, Pageable pageable);

	/**
	 * This method wil find the marketMarkupMapping details based on the criteria.
	 * 
	 * @param marketCodes
	 * @param metalTypeCode
	 * @param pageable
	 * @return
	 */
	@Query("select m from MarketMarkupMappingDaoExt m where ((m.market.marketCode in(:marketCodes) OR nullif(CHOOSE(1,:marketCodes),'') IS NULL) "
			+ "and m.metalTypeCode =:metalTypeCode )")
	public Page<MarketMarkupMappingDaoExt> findAllByMetalCode(@Param("marketCodes") List<String> marketCodes,
			@Param("metalTypeCode") String metalTypeCode, Pageable pageable);

	@Query(nativeQuery = true, value = "SELECT market_code from market_markup_mapping  where market_code in (select market_code from market_master where is_active=1) group by market_code ")
	List<String> getActiveUniqueMarketCodes();

	@Query(nativeQuery = true, value = "SELECT * FROM (SELECT mm.market_code, mm.description, lm.location_code, lm.description as descrip, "
			+ " ((:basePrice * mmp.markup_factor) + mmp.add_amount - mmp.deduct_amount) as computedPrice "
			+ " from     market_markup_mapping mmp, market_master mm, location_master lm "
			+ " where    ( mmp.market_code in "

			+ " (:marketCodes) OR nullif(CHOOSE(1,:marketCodes),'') IS NULL) AND mmp.metal_type_code = :metalTypeCode "
			+ "    and       mmp.market_code = mm.market_code and mm.is_active = 'true' "
			+ "    and       mm.market_code = lm.market_code and lm.is_active = 'true') as results WHERE ((results.market_code in (:filterMarketCodes) OR nullif(CHOOSE(1,:filterMarketCodes),'') IS NULL) AND "
			+ "(results.location_code in (:filterLocationCodes) OR nullif(CHOOSE(1,:filterLocationCodes),'') IS NULL)) "
			+ "  ORDER BY results.market_code OFFSET :offset ROWS FETCH NEXT :size ROWS ONLY")
	List<Object[]> getLocationMappedPrice(@Param("basePrice") BigDecimal basePrice,
			@Param("marketCodes") List<String> marketCodes, @Param("metalTypeCode") String metalTypeCode,
			@Param("offset") Integer offset, @Param("size") Integer size,
			@Param("filterMarketCodes") List<String> filterMarketCodes,
			@Param("filterLocationCodes") List<String> filterLocationCodes);

	@Query(nativeQuery = true, value = "SELECT COUNT(*) FROM (select mm.market_code, mm.description, lm.location_code, lm.description as descrip, "
			+ " ((:basePrice * mmp.markup_factor) + mmp.add_amount - mmp.deduct_amount) as computedPrice "
			+ " from     market_markup_mapping mmp, market_master mm, location_master lm "
			+ "where    ( mmp.market_code in "

			+ " (:marketCodes) OR nullif(CHOOSE(1,:marketCodes),'') IS NULL) AND  mmp.metal_type_code = :metalTypeCode "
			+ "    and       mmp.market_code = mm.market_code and mm.is_active = 'true' "
			+ "    and       mm.market_code = lm.market_code and lm.is_active = 'true' ) as result")
	int getLocationMappedPriceSize(@Param("basePrice") BigDecimal basePrice,
			@Param("marketCodes") List<String> marketCodes, @Param("metalTypeCode") String metalTypeCode);

	/**
	 * @param market
	 * @param metalCodeList
	 * @return List<MarketMarkupMappingDao>
	 */
	@Query("select m from MarketMarkupMappingDaoExt m where m.market=:market and m.metalTypeCode in(:metalCodeList) OR nullif(CHOOSE(1,:metalCodeList),'') IS NULL ")
	List<MarketMarkupMappingDaoExt> getMarketMarkupMapping(@Param("market") MarketDao market,
			@Param("metalCodeList") List<String> metalCodeList);

	/**
	 * @param marketCodeList
	 * @param metalTypeList
	 */
	@Query("select mmp from MarketMarkupMappingDaoExt mmp where ("
			+ "(mmp.market.marketCode in (:marketCodes) OR nullif(CHOOSE(1,:marketCodes),'') IS NULL) AND "
			+ "( mmp.metalTypeCode= :metalTypeCode))")
	List<MarketMarkupMappingDaoExt> findByCombination(@Param("marketCodes") List<String> marketCodeList,
			@Param("metalTypeCode") String metalTypeCode);

	/**
	 * @param deleteIds
	 */
	@Transactional
	@Modifying
	@Query("delete from MarketMarkupMappingDaoExt mmp where mmp.id IN (:ids)")
	void deleteByIdIn(@Param("ids") List<String> ids);

	@Query("select mmp from MarketMarkupMappingDaoExt mmp where "
			+ "mmp.market.marketCode = :marketCode AND "
			+ "mmp.metalTypeCode= :metalTypeCode")
	MarketMarkupMappingDaoExt findByMarketCodeAndMetalTypeCode(@Param("marketCode")String marketCode,@Param("metalTypeCode")String metalTypeCode);
}
