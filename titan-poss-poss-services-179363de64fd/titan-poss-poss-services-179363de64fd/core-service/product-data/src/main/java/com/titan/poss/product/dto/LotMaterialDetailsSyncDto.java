
/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.SyncTimeDao;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.LotMaterialDetailsDao;
import com.titan.poss.product.dao.LotMaterialDetailsIdDao;
import com.titan.poss.product.dao.MaterialDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class LotMaterialDetailsSyncDto extends SyncTimeDao {

	private static final long serialVersionUID = 1L;

	private String lotNumber;

	private String itemCode;

	private Integer lineItemNo;

	private String materialCode;

	private BigDecimal materialWeight;

	private Integer noOfMaterials;

	private String correlationId;
	
	private String weightUnit;

	public LotMaterialDetailsSyncDto() {

	}

	public LotMaterialDetailsSyncDto(LotMaterialDetailsDao lotMaterialDetailsDao) {
		MapperUtil.getObjectMapping(lotMaterialDetailsDao, this);
		if (lotMaterialDetailsDao.getLotDetailsId().getItem() != null) {
			this.setItemCode(lotMaterialDetailsDao.getLotDetailsId().getItem().getItemCode());
			this.setLotNumber(lotMaterialDetailsDao.getLotDetailsId().getLotNumber());
			this.setLineItemNo(lotMaterialDetailsDao.getLotDetailsId().getLineItemNo());
		} else {
			this.setItemCode(null);
		}

		if (lotMaterialDetailsDao.getMaterial() != null) {
			this.setMaterialCode(lotMaterialDetailsDao.getMaterial().getMaterialCode());
		} else {
			this.setMaterialCode(null);
		}
	}

	public List<LotMaterialDetailsDao> getDaoList(List<LotMaterialDetailsSyncDto> syncDtos) {
		List<LotMaterialDetailsDao> daoList = new ArrayList<>();
		syncDtos.forEach(syncDto -> {
			LotMaterialDetailsSyncDto dto = new LotMaterialDetailsSyncDto();
			daoList.add(dto.getDao(syncDto));
		});

		return daoList;
	}

	/**
	 * @param syncDto
	 * @return LotMaterialDetailsDao
	 */
	private LotMaterialDetailsDao getDao(LotMaterialDetailsSyncDto syncDto) {
		LotMaterialDetailsDao lotMaterialDetailsDao = (LotMaterialDetailsDao) MapperUtil.getObjectMapping(syncDto,
				new LotMaterialDetailsDao());

		LotMaterialDetailsIdDao lotDetails = new LotMaterialDetailsIdDao();
		if (syncDto.getLotNumber() != null) {
			lotDetails.setLotNumber(syncDto.getLotNumber());
		}
		if (syncDto.getLineItemNo() != null) {
			lotDetails.setLineItemNo(syncDto.getLineItemNo());
		}
		if (syncDto.getItemCode() != null) {
			ItemDao itemDao = new ItemDao();
			itemDao.setItemCode(syncDto.getItemCode());
			lotDetails.setItem(itemDao);
		} else {
			lotDetails.setItem(null);
		}

		lotMaterialDetailsDao.setLotDetailsId(lotDetails);

		if (syncDto.getMaterialCode() != null) {
			MaterialDao stoneDao = new MaterialDao();
			stoneDao.setMaterialCode(syncDto.getMaterialCode());
			lotMaterialDetailsDao.setMaterial(stoneDao);
		} else {
			lotMaterialDetailsDao.setMaterial(null);
		}

		return lotMaterialDetailsDao;
	}
}
