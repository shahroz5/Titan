/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.FocSchemeDetailsDao;
import com.titan.poss.config.dao.FocSchemeMasterDao;
import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class FocSchemeDetailsSyncDto extends MasterSyncableEntity {

	private String id;

	private String focSchemeMasterDao;

	private String itemCode;

	private String itemType;

	private String category;

	private String focEligibility;

	private String offerType;

	private BigDecimal stdSaleValue;

	private BigDecimal fromSaleValue;

	private BigDecimal toSaleValue;

	private BigDecimal weight;

	private Integer quantity;

	private Integer rowId;

	private BigDecimal karat;

	private Boolean isSingle;

	private Boolean isMultiple;

	public FocSchemeDetailsDao getFocSchemeDetailsDao(FocSchemeDetailsSyncDto focSchemeDetailsSyncDto) {
		FocSchemeDetailsDao focSchemeDetailsDao = new FocSchemeDetailsDao();
		focSchemeDetailsDao = (FocSchemeDetailsDao) MapperUtil.getObjectMapping(focSchemeDetailsSyncDto,
				focSchemeDetailsDao);

		FocSchemeMasterDao focSchemeMaster = new FocSchemeMasterDao();
		focSchemeMaster.setId(focSchemeDetailsSyncDto.getFocSchemeMasterDao());

		focSchemeDetailsDao.setFocSchemeMasterDao(focSchemeMaster);

		return focSchemeDetailsDao;
	}

	public List<FocSchemeDetailsDao> getDaoList(List<FocSchemeDetailsSyncDto> syncDtos) {
		List<FocSchemeDetailsDao> daos = new ArrayList<>();
		syncDtos.forEach(dto -> {
			FocSchemeDetailsSyncDto syncDto = new FocSchemeDetailsSyncDto();
			daos.add(syncDto.getFocSchemeDetailsDao(dto));
		});
		return daos;
	}
}
