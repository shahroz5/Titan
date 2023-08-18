/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.PIFSeriesDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class PIFSeriesSyncDto extends MasterSyncableEntity{

	private String bankName;

	private String paymentCode;

	private Integer fromNo;

	private Integer toNo;

	private Integer currentSeqNo;

	private String locationCode;

	private Boolean isHomeBank;
	
	private String id;
	
	public PIFSeriesDao getPIFSeriesDao(PIFSeriesSyncDto syncDto) {
		return (PIFSeriesDao)MapperUtil.getObjectMapping(syncDto,new PIFSeriesDao());
	}
	
	public List<PIFSeriesDao> getPIFSeriesDaoList(List<PIFSeriesSyncDto> syncDtoList){
		 List<PIFSeriesDao> daoList=new ArrayList<>();
		 syncDtoList.forEach(dto->daoList.add(getPIFSeriesDao(dto)));
		return daoList;
	}
}
