/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.titan.poss.inventory.dao.BinCodeLocationMappingDaoExt;
import com.titan.poss.inventory.dao.BinDaoExt;
import com.titan.poss.inventory.dao.BinGroupDao;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dto.response.LocationCodeDto;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
public interface BinCodeLocationRepositoryExt extends JpaRepository<BinCodeLocationMappingDaoExt, String> {

	/**
	 * This method will deactivate the locations mapping based on bin and
	 * locationSet.
	 * 
	 * @param bin
	 * @param locationSet
	 * @param isActive
	 * @return void
	 */
	@Modifying
	@Query("update BinCodeLocationMappingDaoExt s set s.isActive =:isActive where s.bin = :bin AND s.locationCode IN (:locationSet)")
	void deactivateLocationsMapping(@Param("bin") BinDaoExt bin, @Param("locationSet") Set<String> locationSet,
			@Param("isActive") Boolean isActive);

	/**
	 * This method will delete the locations mapping based on bin and locationSet.
	 * 
	 * @param bin
	 * @param locationSet
	 * @return void
	 */
	@Modifying
	@Query("delete from BinCodeLocationMappingDaoExt s where s.bin = :bin AND s.locationCode IN (:locationSet)")
	void deleteLocationsMapping(@Param("bin") BinDaoExt bin, @Param("locationSet") Set<String> locationSet);

	/**
	 * This method will return the page of BinGroup details based on locationCode.
	 * 
	 * @param locationCode
	 * @param pageable
	 * @return Page<BinGroup>
	 */
	@Query("select DISTINCT s.bin.binGroup from BinCodeLocationMappingDaoExt s where s.locationCode =:locationCode")
	Page<BinGroupDao> pageBinGroup(@Param("locationCode") String locationCode, Pageable pageable);

	/**
	 * This method will return the page of BinGroup details based on locationCode
	 * and isActive.
	 * 
	 * @param locationCode
	 * @param isActive
	 * @param pageable
	 * @return Page<BinGroup>
	 */
	@Query("select DISTINCT s.bin.binGroup from BinCodeLocationMappingDaoExt s where s.locationCode =:locationCode AND s.isActive =:isActive")
	Page<BinGroupDao> pageBinGroup(@Param("locationCode") String locationCode, @Param("isActive") Boolean isActive,
			Pageable pageable);

	/**
	 * This method will return the page of Bin details based on binGroupCode and
	 * locationCode.
	 * 
	 * @param binGroupCode
	 * @param locationCode
	 * @param pageable
	 * @return Page<Bin>
	 */
	@Query("select DISTINCT s.bin from BinCodeLocationMappingDaoExt s where s.bin.binGroup.binGroupCode =:binGroupCode AND s.locationCode =:locationCode")
	Page<BinDaoExt> pageBin(@Param("binGroupCode") String binGroupCode, @Param("locationCode") String locationCode,
			Pageable pageable);

	/**
	 * This method will return the page of Bin details based on locationCode and
	 * binGroupCode.
	 * 
	 * @param binGroupCode
	 * @param locationCode
	 * @param isActive
	 * @param pageable
	 * @return Page<Bin>
	 */
	@Query("SELECT bm FROM BinCodeLocationMappingDaoExt blm JOIN blm.bin bm WHERE bm.isActive = :isActive "
			+ " AND blm.isActive = :isActive AND bm.binGroup.binGroupCode = :binGroupCode AND blm.locationCode = :locationCode")
	Page<BinDaoExt> pageBin(@Param("binGroupCode") String binGroupCode, @Param("locationCode") String locationCode,
			@Param("isActive") Boolean isActive, Pageable pageable);

	/**
	 * This method will return the list of location codes based on binGroupCode and
	 * binCodes.
	 * 
	 * @param binGroupCode
	 * @param binCodes
	 * @param count
	 * @return List<LocationCodeDto>
	 */
	@Query("SELECT new com.titan.poss.inventory.dto.response.LocationCodeDto(s.locationCode, s.isActive) FROM BinCodeLocationMappingDaoExt s WHERE s.bin.binGroup.binGroupCode =:binGroupCode AND s.bin.binCode IN (:binCodes) GROUP BY s.locationCode, s.isActive HAVING count(s) =:count")
	List<LocationCodeDto> getLocationCodes(@Param("binGroupCode") String binGroupCode,
			@Param("binCodes") List<String> binCodes, @Param("count") Long count);

	/**
	 * This method will return the list of location codes based on binGroupCode,
	 * binCodes and isActive.
	 * 
	 * @param binGroupCode
	 * @param binCodes
	 * @param isActive
	 * @param count
	 * @return List<LocationCodeDto>
	 */
	@Query("SELECT new com.titan.poss.inventory.dto.response.LocationCodeDto(s.locationCode, s.isActive) FROM BinCodeLocationMappingDaoExt s WHERE s.bin.binGroup.binGroupCode =:binGroupCode AND s.bin.binCode IN (:binCodes) AND s.isActive =:isActive GROUP BY s.locationCode, s.isActive HAVING count(s) =:count")
	List<LocationCodeDto> getLocationCodes(@Param("binGroupCode") String binGroupCode,
			@Param("binCodes") List<String> binCodes, @Param("isActive") Boolean isActive, @Param("count") Long count);

	/**
	 * This method will return the list of InventoryDetails based on binGroupCode,
	 * binCode and locationCodes.
	 * 
	 * @param binGroupCode
	 * @param binCode
	 * @param locationCodes
	 * @return List<InventoryDetails>
	 */
	@Query("select s from InventoryDetailsDao s where s.binGroupCode =:binGroupCode AND s.binCode =:binCode AND s.locationCode IN (:locationCodes)")
	List<InventoryDetailsDao> getInventoryDetails(@Param("binGroupCode") String binGroupCode,
			@Param("binCode") String binCode, @Param("locationCodes") Set<String> locationCodes);

	/**
	 * @param bin
	 * @param locationSet
	 * @return List<BinCodeLocationMappingDaoExt>
	 */
	@Modifying
	@Query("SELECT s from BinCodeLocationMappingDaoExt s where s.bin = :bin AND s.locationCode IN (:locationSet)")
	List<BinCodeLocationMappingDaoExt> getBinCodeLocationMapping(@Param("bin") BinDaoExt bin,
			@Param("locationSet") Set<String> locationSet);

}
