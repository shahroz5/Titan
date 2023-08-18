/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import java.math.BigDecimal;
import java.util.Arrays;

import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.OwnerTypeEnum;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.dto.FirMerFileDto;
import com.titan.poss.file.dto.FirMerStageDto;
import com.titan.poss.file.service.CommonValidationService;
import com.titan.poss.file.service.FileService;
import com.titan.poss.file.service.FirMerValidationService;
import com.titan.poss.location.dao.CountryDao;
import com.titan.poss.location.dao.LocationDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class FirMerStageProcessor implements ItemProcessor<FirMerFileDto, FirMerStageDto>, StepExecutionListener {

	@Autowired
	private FirMerValidationService firMerValidationService;

	@Autowired
	private CommonValidationService commonValidationService;
	
	@Autowired
	private FileService fileService;

	private String type;
	private String fileId;
	private String createdBy;

	@Override
	public FirMerStageDto process(FirMerFileDto firMerFileDto) throws Exception {

		firMerFileDto.setFileId(fileId);
		if (firMerValidationService.dataValidation(firMerFileDto)) {
			FirMerStageDto firMerStageDto = new FirMerStageDto();
			firMerStageDto.setType(type);
			firMerStageDto.setItemCode(firMerFileDto.getItemCode().trim());
			firMerStageDto.setLotNumber(firMerFileDto.getLotNumber().trim().replaceAll("[^\\x00-\\x7F]", ""));
			BigDecimal unitWeight = commonValidationService.validateBigDecimalField(firMerFileDto.getItemCode(),
					firMerFileDto, "Invalid unit weight: " + firMerFileDto.getUnitWeight(),
					firMerFileDto.getUnitWeight(), fileId, ErrorTypeEnum.ERROR.toString());
			if (unitWeight == null) {
				return null;
			}
			firMerStageDto.setUnitWeight(unitWeight);
			Short quantity = commonValidationService.validateShortField(firMerFileDto.getItemCode(), firMerFileDto,
					"Invalid quantity: " + firMerFileDto.getQuantity(), firMerFileDto.getQuantity(), fileId,
					ErrorTypeEnum.ERROR.toString());
			if (quantity == null) {
				return null;
			}
			firMerStageDto.setQuantity(quantity);

			firMerStageDto.setInitiatedLocationCode(firMerFileDto.getInitiatedLocationCode());
			// validating source location code and location type should be a btq
			// check for l1 and l2 for src and dest locations
			LocationDao srcLocation = commonValidationService.validateLocationCode(
					firMerFileDto.getSourceLocationCode(), firMerFileDto.getItemCode(), firMerFileDto, fileId,
					FileIntegrationConstants.LOCATION_TYPE_BTQ,
					Arrays.asList(OwnerTypeEnum.L1.toString(), OwnerTypeEnum.L2.toString()));
			if (srcLocation == null) {
				return null;
			}
			// validating destination location code and location type should be a btq and L1
			// or L2 if it
			// is MER or fac if it FIR
			LocationDao destLocation = commonValidationService.validateLocationCode(
					firMerFileDto.getDestinationLocationCode(), firMerFileDto.getItemCode(), firMerFileDto, fileId,
					type.equalsIgnoreCase(FileGroupEnum.FIR.toString()) ? FileIntegrationConstants.LOCATION_TYPE_FAC
							: FileIntegrationConstants.LOCATION_TYPE_BTQ,
					type.equalsIgnoreCase(FileGroupEnum.FIR.toString()) ? null
							: Arrays.asList(OwnerTypeEnum.L1.toString(), OwnerTypeEnum.L2.toString()));
			if (destLocation == null) {
				return null;
			}
			firMerStageDto.setSourceLocationCode(firMerFileDto.getSourceLocationCode());
			firMerStageDto.setDestinationLocationCode(firMerFileDto.getDestinationLocationCode());
			//removed fiscal year settings from STN file.
//			Integer fiscalYear = commonValidationService.validateIntegerField(firMerFileDto.getItemCode(),
//					firMerFileDto, "Invalid fiscal year: " + firMerFileDto.getFiscalYear(),
//					firMerFileDto.getFiscalYear(), fileId, ErrorTypeEnum.ERROR.toString());
			
			// setting fiscal year from country_master
			CountryDao countryData = fileService.getCountryData();
			Integer fiscalYear = countryData.getFiscalYear();
			firMerStageDto.setFiscalYear(fiscalYear);
			//Fiscal year validation removed
//			if (!commonValidationService.validateFiscalYear(firMerFileDto.getItemCode(),
//					firMerFileDto.getSourceLocationCode(), firMerFileDto, firMerStageDto.getFiscalYear(), fileId,
//					ErrorTypeEnum.ERROR.toString())) {
//				return null;
//			}

			firMerStageDto.setFileId(fileId);
			firMerStageDto.setCreatedBy(createdBy);
			firMerStageDto.setLastModifiedBy(createdBy);
			firMerStageDto.setCreatedDate(CalendarUtils.getCurrentDate());
			firMerStageDto.setLastModifiedDate(CalendarUtils.getCurrentDate());
			return firMerStageDto;
		}
		return null;
	}

	@Override
	public void beforeStep(StepExecution stepExecution) {
		fileId = stepExecution.getJobExecution().getJobParameters().getString("fileAuditId");
		createdBy = stepExecution.getJobExecution().getJobParameters().getString("user");
		type = stepExecution.getJobExecution().getJobParameters().getString("fileGroup");
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		return ExitStatus.COMPLETED;
	}

}
