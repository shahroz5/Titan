/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.GrnDao;
import com.titan.poss.sales.dao.GrnDetailsDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class GrnDetailsSyncDto extends SyncableEntity{
	
	private String id;

	private String grn;
	
	private String cashMemoDetailsId;

	private String focDetailsId;

	private String itemCode;

	private String lotNumber;

	private String binCode;

	private Short totalQuantity;

	private BigDecimal finalValue;

	private String inventoryId;
	
	public List<GrnDetailsDao> getGrnDetailsDaoList(List<GrnDetailsSyncDto> syncDtoList) {
		List<GrnDetailsDao> grnDetails=new ArrayList<>();
		syncDtoList.forEach(syncDto->grnDetails.add(getGrnDetailsDao(syncDto)));
		return grnDetails;
	}

	public GrnDetailsDao getGrnDetailsDao(GrnDetailsSyncDto syncDto) {
		GrnDetailsDao grnDetails=(GrnDetailsDao)MapperUtil.getObjectMapping(syncDto, new GrnDetailsDao());
		if(syncDto.getGrn()!=null) {
			GrnDao grnD=new GrnDao();
			grnD.setId(syncDto.getGrn());
			grnDetails.setGrn(grnD);
		}
		return grnDetails;
	}

}
