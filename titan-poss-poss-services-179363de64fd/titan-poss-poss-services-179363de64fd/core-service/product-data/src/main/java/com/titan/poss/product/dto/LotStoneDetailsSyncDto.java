
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
import com.titan.poss.product.dao.LotDetailsDao;
import com.titan.poss.product.dao.LotDetailsIdDao;
import com.titan.poss.product.dao.StoneDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class LotStoneDetailsSyncDto extends SyncTimeDao {

	private static final long serialVersionUID = 1L;

	private String lotNumber;

	private String itemCode;

	private Short lineItemNo;

	private String stoneCode;

	private BigDecimal stoneWeight;

	private Short noOfStones;

	private String correlationId;
	
	private String weightUnit;

	public LotStoneDetailsSyncDto() {

	}

	public LotStoneDetailsSyncDto(LotDetailsDao lotDetailsDao) {
		MapperUtil.getObjectMapping(lotDetailsDao, this);
		if (lotDetailsDao.getLotDetailsId().getItem() != null) {
			this.setItemCode(lotDetailsDao.getLotDetailsId().getItem().getItemCode());
			this.setLotNumber(lotDetailsDao.getLotDetailsId().getLotNumber());
			this.setLineItemNo(lotDetailsDao.getLotDetailsId().getLineItemNo());
		} else {
			this.setItemCode(null);
		}

		if (lotDetailsDao.getStone() != null) {
			this.setStoneCode(lotDetailsDao.getStone().getStoneCode());
		} else {
			this.setStoneCode(null);
		}
	}

	public List<LotDetailsDao> getDaoList(List<LotStoneDetailsSyncDto> syncDtos) {
		List<LotDetailsDao> daoList = new ArrayList<>();
		syncDtos.forEach(syncDto -> {
			LotStoneDetailsSyncDto dto = new LotStoneDetailsSyncDto();
			daoList.add(dto.getDao(syncDto));
		});
		
		return daoList;
	}

	/**
	 * @param syncDto
	 * @return LotDetailsDao
	 */
	private LotDetailsDao getDao(LotStoneDetailsSyncDto syncDto) {
		LotDetailsDao lotDetailsDao = (LotDetailsDao) MapperUtil.getObjectMapping(syncDto, new LotDetailsDao());

		LotDetailsIdDao lotDetailsId = new LotDetailsIdDao();
		if (syncDto.getLotNumber() != null) {
			lotDetailsId.setLotNumber(syncDto.getLotNumber());
		}
		if (syncDto.getLineItemNo() != null) {
			lotDetailsId.setLineItemNo(syncDto.getLineItemNo());
		}
		if (syncDto.getItemCode() != null) {
			ItemDao itemDao = new ItemDao();
			itemDao.setItemCode(syncDto.getItemCode());
			lotDetailsId.setItem(itemDao);
		} else {
			lotDetailsId.setItem(null);
		}

		lotDetailsDao.setLotDetailsId(lotDetailsId);

		if (syncDto.getStoneCode() != null) {
			StoneDao stoneDao = new StoneDao();
			stoneDao.setStoneCode(syncDto.getStoneCode());
			lotDetailsDao.setStone(stoneDao);
		} else {
			lotDetailsDao.setStone(null);
		}


		return lotDetailsDao;
	}
}
