/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.product.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.StoneDao;
import com.titan.poss.product.repository.StoneRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("engineStoneRepository")
public interface StoneRepositoryExt extends StoneRepository {

	/**
	 * This method will return the ratePerCarat based on the stoneCode
	 * 
	 * @param stoneCode
	 * @return ratePerCarat
	 */
	@Query("select s.ratePerCarat from StoneDao s where (s.stoneCode= :stoneCode)")
	public BigDecimal findRateByCaratByStoneCode(@Param("stoneCode") String stoneCode);

	/**
	 * This method will return the List<StoneDao> details based on the stoneCodeList
	 * 
	 * @param stoneCodeList
	 * @return List<StoneDao>
	 */
	@Query("select s from StoneDao s where s.stoneCode in (:stoneCodeList)")
	public List<StoneDao> findRatesByCaratByStoneCode(@Param("stoneCodeList") List<String> stoneCode);

	/**
	 * This method will return the List<Object[]> details based on the
	 * itemCode,lotNumber
	 * 
	 * @param itemCode
	 * @param lotNumber
	 * @return List<Object[]>
	 */
	// COALESCE(req_details.status, 'OPEN')

	@Query(nativeQuery = true, value = "SELECT sm.stone_code,sm.color,sm.quality,lm.no_of_stones,sm.rate_per_carat,lm.stone_weight,st.description,"
			+ "sm.currency_code, sm.weight_unit, sm.stone_type_code FROM lot_stone_details lm LEFT JOIN stone_master sm ON lm.stone_code=sm.stone_code LEFT JOIN stone_type_master "
			+ "st ON st.stone_type_code= sm.stone_type_code WHERE lm.item_code=convert(varchar(20),:itemCode) AND lm.lot_number=convert(varchar(20),:lotNumber)")
	List<Object[]> getStoneDetailsByItem(@Param("itemCode") ItemDao itemCode, @Param("lotNumber") String lotNumber);

	@Query("SELECT sm.stoneCode, lm.noOfStones, sm.ratePerCarat, lm.stoneWeight, sm.currencyCode, sm.weightUnit, sm.stoneType.stoneTypeCode, sm.quality FROM LotDetailsDao "
			+ " lm LEFT JOIN StoneDao sm ON lm.stone = sm.stoneCode "
			+ " WHERE lm.lotDetailsId.item.itemCode = :itemCode AND lm.lotDetailsId.lotNumber = :lotNumber")
	List<Object[]> getStoneDetailsByItemCodeAndLotNumber(@Param("itemCode") String itemCode,
			@Param("lotNumber") String lotNumber, Pageable pageable);
	
	/*@Query(nativeQuery = true, value = "SELECT  TOP(1) sm.stone_code, lm.no_of_stones, sm.rate_per_carat, "
			+ " lm.stone_weight, sm.currency_code, sm.weight_unit, st.stone_Type_Code,"
			+ " sm.quality FROM lot_stone_details lm LEFT JOIN stone_master sm ON lm.stone_code=sm.stone_code LEFT JOIN stone_type_master " 
		    + " st ON st.stone_type_code= sm.stone_type_code where item_code =convert(varchar(20),:itemCode) "
		    + " AND lm.lot_number=convert(varchar(20),:lotNumber) " 
			+ " order by stone_weight,no_of_stones asc")
	List<Object[]> getLowestStoneDetailsByItemCodeAndLotNumber(@Param("itemCode") String itemCode,
			@Param("lotNumber") String lotNumber);*/

//	@Query("SELECT sm.stoneCode, lm.noOfStones, sm.ratePerCarat, lm.stoneWeight, sm.currencyCode, sm.weightUnit, sm.stoneType.stoneTypeCode, sm.quality FROM LotDetailsDao lm"
//			+ " LEFT JOIN StoneDao sm ON lm.stone = sm.stoneCode "
//			+ " WHERE lm.lotDetailsId.item.itemCode = :itemCode and lm.stoneWeight="
//			+ "(SELECT min(lm.stoneWeight) FROM LotDetailsDao lm WHERE lm.lotDetailsId.item = :itemCode)")
//	List<Object[]> getStoneDetailsByItemCode(@Param("itemCode") String itemCode, Pageable pageable);

	@Query("SELECT sm.stoneCode, lm.noOfStones, sm.ratePerCarat, lm.noOfStones * sm.stdWeight, sm.currencyCode, sm.weightUnit, sm.stoneType.stoneTypeCode, sm.quality FROM StoneDao sm"
			+ " LEFT JOIN ItemStoneMappingDao lm ON lm.stone.stoneCode = sm.stoneCode "
			+ " WHERE lm.item.itemCode = :itemCode")
	List<Object[]> getStoneDetailsByItemCode(@Param("itemCode") String itemCode, Pageable pageable);

	//@formatter:off
	@Query(value="select s from StoneDao s where (s.stoneCode = :stoneCode OR :stoneCode IS NULL) AND \r\n"
			+ " (:fromStdValue IS NULL OR :fromStdValue <= s.stdValue) AND \r\n "
			+ " (:toStdValue IS NULL OR s.stdValue <= :toStdValue) AND \r\n "
			+ " (s.color = :color OR :color IS NULL) AND (s.stoneType.stoneTypeCode = :stoneTypeCode OR :stoneTypeCode IS NULL) AND "
			+ " (s.quality = :quality OR :quality IS NULL) AND (s.ratePerCarat = :ratePerCarat OR :ratePerCarat IS NULL)")
	//@formatter:on
	Page<StoneDao> getStones(@Param("stoneCode") String stoneCode, @Param("fromStdValue") BigDecimal fromStdValue,
			@Param("toStdValue") BigDecimal toStdValue, @Param("color") String color,
			@Param("stoneTypeCode") String stoneTypeCode, @Param("quality") String quality,
			@Param("ratePerCarat") BigDecimal ratePerCarat, Pageable pageable);
	
	@Query(nativeQuery = true, value = "SELECT sm.stone_code,sm.color,sm.quality,lm.no_of_stones,sm.rate_per_carat,sm.std_weight,st.description,\r\n" + 
			"sm.currency_code, sm.weight_unit, st.stone_type_code FROM item_stone_mapping lm LEFT JOIN stone_master sm ON lm.stone_code=sm.stone_code LEFT JOIN stone_type_master \r\n" + 
			"st ON st.stone_type_code= sm.stone_type_code WHERE lm.item_code=convert(varchar(20),:itemCode)")
	List<Object[]> getListOfStoneDetailsByItemCode(@Param("itemCode") String itemCode);

	@Query("SELECT sm.stoneCode, lm.noOfStones, sm.ratePerCarat, lm.stoneWeight, sm.currencyCode, sm.weightUnit, sm.stoneType.stoneTypeCode, sm.quality FROM LotDetailsDao "
			+ " lm INNER JOIN StoneDao sm ON lm.stone.stoneCode = sm.stoneCode "
			+ " WHERE sm.stoneType.stoneTypeCode ='DI' and lm.lotDetailsId.item.itemCode = :itemCode AND lm.lotDetailsId.lotNumber = :lotNumber")
	List<Object[]> getDimondStoneDetailsByItemCodeAndLotNumber(@Param("itemCode") String itemCode,
			@Param("lotNumber") String lotNumber, Pageable pageable);
	
	@Query(nativeQuery = true, value = "SELECT TOP(1) item_code,lot_number,SUM(stone_weight) AS stone_weight, \r\n"
			+ "SUM(no_of_stones) AS no_of_stones FROM lot_stone_details WHERE item_code=:itemCode GROUP BY item_code,\r\n"
			+ "lot_number ORDER BY stone_weight,no_of_stones ASC")
	List<Object[]> getLowestStoneDetailsByItemCode(@Param("itemCode") String itemCode);

	
	
}
