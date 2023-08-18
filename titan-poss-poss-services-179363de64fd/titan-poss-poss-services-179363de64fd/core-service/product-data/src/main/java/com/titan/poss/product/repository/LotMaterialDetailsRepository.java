/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.product.repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.LotMaterialDetailsDao;


/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface LotMaterialDetailsRepository extends JpaRepository<LotMaterialDetailsDao, String> {

	/**
	 * @param itemCodes
	 * @return List<LotMaterialDetailsDao>
	 */
	List<LotMaterialDetailsDao> findAllByLotDetailsIdItemItemCodeIn(Set<String> itemCodes);

	List<LotMaterialDetailsDao> findByLotDetailsIdItemItemCodeAndLotDetailsIdLotNumber(String itemCode, String lotNumber);
	
	boolean existsByLotDetailsIdItemItemCodeAndLotDetailsIdLotNumberAndMaterialMaterialCode(String itemCode, String lotNumber,String materialCode);

	@Query(nativeQuery = true, value = "SELECT ls.item_code from lot_material_details ls WHERE ls.item_code IN (:itemCode)"
			+ " AND ls.lot_number IN (:lotNumber)"
			+ " AND ls.material_code IN (:materialCode)")
	List<String> fetchLotMaterialDetails(@Param("itemCode") List<String> itemCode,
			@Param("lotNumber") List<String> lotNumber, @Param("materialCode") List<String> materialCode);

	

	@Modifying
	@Query(nativeQuery = true, value = "INSERT INTO lot_material_details (line_item_no,lot_number,item_code,material_code,material_weight,no_of_materials,weight_unit,created_by,created_date,last_modified_date,last_modified_by)"
			+ " VALUES(:lineItemNo,:lotNumber,:itemCode,:multiMetalCode,:materialWeight,:noOfMaterials,'gms','Migration User',:createdDate,:createdDate,'Migration User')")
	@Transactional
	void saveMaterialsDetails(String itemCode, Integer lineItemNo, String lotNumber, BigDecimal materialWeight,
			String multiMetalCode, Integer noOfMaterials, Date currentDate);
	
	@Query(nativeQuery = true, value = "Select * from lot_material_details  where material_code=convert(varchar(20),:materialCode)")
	List<LotMaterialDetailsDao> findByMaterialCode(@Param("materialCode") String materialCode);
}
