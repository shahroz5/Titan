/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.inventory.dao.InventoryDetailsDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class InventoryDetailsSyncDto extends SyncableEntity {

	private String id;

	private String binCode;

	private String binGroupCode;

	private String previousBinCode;

	private String previousBinGroupCode;

	private String itemCode;

	private String locationCode;

	private String lotNumber;

	private String serialNumber;

	private Short totalQuantity;

	private Short issuedQuantity;

	private BigDecimal totalWeight;

	private String weightUnit;

	private String currencyCode;

	private Date mfgDate;

	private BigDecimal totalValue;

	private String productCategory;

	private String productGroup;

	private BigDecimal stdWeight;

	private BigDecimal stdValue;

	private Date binModifiedDate;

	private String itemDetails;

	private Short weightModifiedCount;

	private String orgCode;

	private String totalWeightDetails;

	private Date stockInwardDate;

	private String correlationId;

	private Integer docNumber;

	private Short fiscalYear;

	private String docType;

	private String actionType;

	private String isacDetails;

	private Integer stockId;
	
	private Boolean isHallmarked;
	
	private String defectCodeDesc;
	
	private String defectTypeDesc;
		
	private String requestType;
	
	private Short requestQuantity;
	
	private BigDecimal itemDiscount;
	
	private BigDecimal makingCharges;
	
	private BigDecimal makingChargesPct;
	
	private BigDecimal karat;
	
	
	public InventoryDetailsDao getDao(InventoryDetailsSyncDto syncDto) {
		InventoryDetailsDao inventoryDetailsDao = (InventoryDetailsDao) MapperUtil.getObjectMapping(syncDto,
				new InventoryDetailsDao());
		if (syncDto.getSrcSyncId() == null && syncDto.getDestSyncId() == null) {
			inventoryDetailsDao.setSrcSyncId(0);
			inventoryDetailsDao.setDestSyncId(0);
		}
		return inventoryDetailsDao;
	}

	public List<InventoryDetailsDao> getDaoList(List<InventoryDetailsSyncDto> syncDtoList) {
		List<InventoryDetailsDao> daoList = new ArrayList<>();
		for (InventoryDetailsSyncDto syncDto : syncDtoList) {
			InventoryDetailsSyncDto dto = new InventoryDetailsSyncDto();
			daoList.add(dto.getDao(syncDto));
		}
		return daoList;
	}

	public InventoryDetailsSyncDto() {

	}

	public InventoryDetailsSyncDto(InventoryDetailsDao inventoryDetailsDaoExt, Integer stockTransferId) {
		MapperUtil.getObjectMapping(inventoryDetailsDaoExt, this);
		this.setStockId(stockTransferId);
	}

	public List<InventoryDetailsSyncDto> getSyncDtoList(List<InventoryDetailsDao> daoList,
			Integer stockTransferId) {
		List<InventoryDetailsSyncDto> dtoList = new ArrayList<>();
		for (InventoryDetailsDao dao : daoList) {
			InventoryDetailsSyncDto dtoExt = new InventoryDetailsSyncDto(dao, stockTransferId);
			dtoList.add(dtoExt);
		}
		return dtoList;
	}
}
