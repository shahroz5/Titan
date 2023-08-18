/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.writer;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.sql.DataSource;

import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.FirMerStageDto;
import com.titan.poss.file.dto.FirMerStageUniqueCheckDto;
import com.titan.poss.file.service.DataAuditService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class FirMerStageWriter implements ItemWriter<FirMerStageDto> {

	@Autowired
	private FirMerJobWriter firMerJobWriter;
	
	@Autowired
	private DataSource dataSource;

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public void write(List<? extends FirMerStageDto> items) throws Exception {

		// check for duplicate item code, lot number, weight, source location 
		Set<FirMerStageUniqueCheckDto> uniqueFirMerStageSet = new HashSet();
		List<FirMerStageDto> list = new ArrayList<>();
		for (FirMerStageDto item : items) {
			FirMerStageUniqueCheckDto fiMerUniquecheckDto = new FirMerStageUniqueCheckDto();
			fiMerUniquecheckDto.setItemCode(item.getItemCode());
			fiMerUniquecheckDto.setLotNumber(item.getLotNumber());
			fiMerUniquecheckDto.setUnitWeight(item.getUnitWeight());
			fiMerUniquecheckDto.setSourceLocationCode(item.getSourceLocationCode());
			if (uniqueFirMerStageSet.add(fiMerUniquecheckDto)) {
				list.add(item);
			} else {
				dataAuditService.saveDataAuditData(item.getItemCode(), MapperUtil.getJsonString(item),
						"Duplicate entry for itemCode, lotNumber, stdWeight and srcLocationCode ",
						item.getFileId(), ErrorTypeEnum.ERROR.toString());
			}
		}
		
		if (!list.isEmpty()) {
			firMerJobWriter.firMerStagingWriter(dataSource).write(list);
		}
		
		
// OLD CODE  
/*	List<FirMerStageDto> list = new ArrayList<>();
		for (FirMerStageDto firMerStageDto : items) {
			if (firMerStageDto != null) {
				list.add(firMerStageDto);
			}
		}
		if (!list.isEmpty()) {
			firMerJobWriter.firMerStagingWriter(dataSource).write(list);
		}
		*/
	}
}
