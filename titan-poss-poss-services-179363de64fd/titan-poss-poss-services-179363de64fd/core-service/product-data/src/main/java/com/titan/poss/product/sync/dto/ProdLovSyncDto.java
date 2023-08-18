/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.product.sync.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.ProdLovDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class ProdLovSyncDto extends MasterSyncableEntity {

	private String id;

	private String lovType;

	private String code;

	private String value;

	public ProdLovDao getLocLovDao(ProdLovSyncDto prodLovSyncDto) {
		return (ProdLovDao) MapperUtil.getObjectMapping(prodLovSyncDto, new ProdLovDao());
	}

	public List<ProdLovDao> getDaoList(List<ProdLovSyncDto> syncDtos) {

		List<ProdLovDao> daos = new ArrayList<>();

		syncDtos.forEach(dto -> {
			ProdLovSyncDto prodSyncDto = new ProdLovSyncDto();
			daos.add(prodSyncDto.getLocLovDao(dto));
		});
		return daos;
	}
}
