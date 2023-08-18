package com.titan.poss.engine.product.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.titan.poss.product.dao.ItemMaterialMappingDao;
import com.titan.poss.product.dto.ItemMaterialDto;
import com.titan.poss.product.repository.ItemMaterialMappingRepository;

public interface ItemMaterialMappingRepositoryExt extends ItemMaterialMappingRepository{
	
	@Query("SELECT new com.titan.poss.product.dto.ItemMaterialDto(mm.id,mm.correlationId,mm.item.itemCode,mm.material,mm.noOfMaterials,mm.isActive,mm.createdBy,mm.createdDate,mm.lastModifiedBy,mm.lastModifiedDate) "
			 + "FROM ItemMaterialMappingDao mm WHERE mm.item.itemCode=convert(varchar(20),:itemCode)")
	List<ItemMaterialDto> findByItemCodes(@Param("itemCode") String itemCode);

}
