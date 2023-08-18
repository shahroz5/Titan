/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dto;

import java.util.List;

import com.titan.poss.core.dto.ItemStoneMappingDto;
import com.titan.poss.product.dao.LotDetailsDao;
import com.titan.poss.product.dao.LotMaterialDetailsDao;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class LotDetailsDto {
	
private List<LotDetailsDao> lotStoneList;

private List<LotMaterialDetailsDao> lotMaterialList;

private List<ItemStoneMappingDto> itemStoneMapping;

}
