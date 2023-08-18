/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.inventory.dao.BinDao;
import com.titan.poss.inventory.dao.BinGroupDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface BinRepository extends JpaRepository<BinDao, String> {

	/**
	 * This method will return the Bin details based on binGroup and binCode.
	 * 
	 * @param binGroup
	 * @param binCode
	 * @return Bin
	 */
	public BinDao findOneByBinGroupAndBinCode(BinGroupDao binGroup, String binCode);

	/**
	 * @param binCode
	 * @return BinDao
	 */
	public BinDao findOneByBinCode(String binCode);

	/**
	 * @param binCode
	 * @param binGroup
	 * @return
	 */
	public BinDao findOneByBinCodeAndBinGroupBinGroupCode(String binCode, String binGroup);

	/**
	 * This method will return the list of Bin details based on binGroupCodeList and
	 * isActive.
	 * 
	 * @param binGroupCodeList
	 * @param isActive
	 * @return List<Bin>
	 */
	@Query("select s from BinDao s where s.binGroup.binGroupCode IN (:binGroupCodeList) AND s.isActive =:isActive ORDER BY s.binCode")
	public List<BinDao> listBin(@Param("binGroupCodeList") List<String> binGroupCodeList,
			@Param("isActive") Boolean isActive);
}
