/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.titan.poss.inventory.dao.BinDao;
import com.titan.poss.inventory.dao.BinDaoExt;
import com.titan.poss.inventory.dao.BinGroupDao;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
public interface BinRepositoryExt extends JpaRepository<BinDaoExt, String> {

	/**
	 * This method will return the list of Bin details based on binCode.
	 * 
	 * @param binCode
	 * @return List<Bin>
	 */
	public List<BinDaoExt> findByBinCode(String binCode);

	/**
	 * This method will return the list of Bin details based on binGroupCodeList and
	 * isActive.
	 * 
	 * @param binGroupCodeList
	 * @param isActive
	 * @return List<Bin>
	 */
	@Query("select s from BinDaoExt s where s.binGroup.binGroupCode IN (:binGroupCodeList) AND s.isActive =:isActive ORDER BY s.binCode")
	public List<BinDaoExt> listBin(@Param("binGroupCodeList") List<String> binGroupCodeList,
			@Param("isActive") Boolean isActive);

	/**
	 * This method will return the Maximum value of ID
	 * 
	 * @return Integer
	 */
	@Query("SELECT MAX(b.id) FROM BinDao b")
	public Integer getMaxId();

	/**
	 * @param binGroup
	 * @param binCode
	 * @return BinDaoExt
	 */
	public BinDaoExt findOneByBinGroupAndBinCode(BinGroupDao binGroup, String binCode);

	/**
	 * @param binCode
	 * @return BinDao
	 */
	public BinDao findOneByBinCode(String binCode);

	/**
	 * @param binGroup
	 * @param binCode
	 * @return
	 */
	public BinDaoExt findOneByBinGroupBinGroupCodeAndBinCode(String binGroup, String binCode);

}
