/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.repository;

import java.util.Set;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.inventory.dao.BinCodeLocationMappingDao;
import com.titan.poss.inventory.dao.BinDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface BinCodeLocationRepository extends JpaRepository<BinCodeLocationMappingDao, String> {

	/**
	 * @param bin
	 * @param locationCodes
	 * @param b
	 */
	@Transactional
	@Modifying
	@Query("update BinCodeLocationMappingDao s set s.isActive =:isActive where s.bin = :bin AND s.locationCode IN (:locationSet)")
	public void deactivateLocationsMapping(@Param("bin") BinDao bin, @Param("locationSet") Set<String> locationSet,
			@Param("isActive") Boolean isActive);

	/**
	 * @param bin
	 * @param locationCodes
	 */
	@Transactional
	@Modifying
	@Query("delete from BinCodeLocationMappingDao s where s.bin = :bin AND s.locationCode IN (:locationSet)")
	public void deleteLocationsMapping(@Param("bin") BinDao bin, @Param("locationSet") Set<String> locationSet);

	/**
	 * @param id
	 * @param locationCode
	 * @return BinCodeLocationMappingDao
	 */
	public BinCodeLocationMappingDao findOneByBinIdAndLocationCode(String id, String locationCode);



}
