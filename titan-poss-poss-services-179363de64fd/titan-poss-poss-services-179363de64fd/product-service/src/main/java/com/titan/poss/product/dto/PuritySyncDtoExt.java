package com.titan.poss.product.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.PurityDaoExt;
import com.titan.poss.product.sync.dto.PuritySyncDto;

public class PuritySyncDtoExt extends PuritySyncDto {

	public PuritySyncDtoExt() {

	}

	public PuritySyncDtoExt(PurityDaoExt purityNewDao) {
		MapperUtil.getObjectMapping(purityNewDao, this);
		this.setItemType(purityNewDao.getItemType().getItemTypeCode());
	}

	public List<PuritySyncDtoExt> getSyncDtoExtList(List<PurityDaoExt> purityNewDto) {
		List<PuritySyncDtoExt> dtoList = new ArrayList<>();
		purityNewDto.forEach(purity -> {
			PuritySyncDtoExt syncDto = new PuritySyncDtoExt(purity);
			dtoList.add(syncDto);
		});

		return dtoList;
	}

}
