package com.titan.poss.product.dto;

import java.util.List;

import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ItemMaterialMappingDao;
import com.titan.poss.product.dao.ItemStoneMappingDao;
import com.titan.poss.product.dao.LotDetailsDao;
import com.titan.poss.product.dao.LotMaterialDetailsDao;
import com.titan.poss.product.dao.MaterialDao;
import com.titan.poss.product.dao.StoneDao;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemStoneDetailsDto {
	
	
	private ItemMasterDto itemMasterDetails;
	
	private List<ItemStoneMappingDetailsDto> itemStoneMappingDetails;

	private List<LotStoneDetailsDto> lotStoneDetails;
	
	private List<ItemMaterialDto> itemMaterialMappingDetails;
	
	private List<StoneMasterDto> StoneMasterDetails;

	private MaterialMasterDto materialDetails;
	
	private List<LotMaterialDetailsDto> lotMaterialDetails;



}
