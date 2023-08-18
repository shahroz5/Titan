/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.config.dao.DiscountDao;
import com.titan.poss.config.dao.DiscountItemMappingDao;
import com.titan.poss.config.repository.DiscountRepository;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.ItemGroupLevelDiscountDto;
import com.titan.poss.file.dto.PreviewConfigDetailsDto;
import com.titan.poss.file.dto.RegularConfigDetailsDto;
import com.titan.poss.file.service.ItemGroupLevelDiscountValidationService;
import com.titan.poss.inventory.repository.InventoryDetailsRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class ItemGroupLevelDiscountIngestionProcessor
		implements ItemProcessor<ItemGroupLevelDiscountDto, DiscountItemMappingDao> {

	@Autowired
	DiscountRepository discountMasterRepo;

	@Autowired
	ItemGroupLevelDiscountValidationService validation;

	@Autowired
	InventoryDetailsRepository inventoryDetailsRepo;

	private static SimpleDateFormat inSDF = new SimpleDateFormat("MM/dd/yyyy");
	private static SimpleDateFormat outSDF = new SimpleDateFormat("yyyy-MM-dd");

	@Override
	public DiscountItemMappingDao process(ItemGroupLevelDiscountDto item) throws Exception {

		DiscountItemMappingDao discountItemMappingDao = new DiscountItemMappingDao();

		discountItemMappingDao.setId(item.getId());
		DiscountDao discountDao = discountMasterRepo.findOneByDiscountCode(item.getDiscountCode());
		discountItemMappingDao.setDiscount(discountDao);
		discountItemMappingDao.setItemCode(item.getItemCode());
		discountItemMappingDao.setLotNumber(item.getLotNumber());
		discountItemMappingDao.setLocationCode(item.getLocationCode());

		discountItemMappingDao.setStartDate(formatDate(item.getRegularStartDate()));
		discountItemMappingDao.setEndDate(formatDate(item.getRegularEndDate()));

		discountItemMappingDao.setIsPreviewApplicable(item.getIsPreviewApplicable());
		discountItemMappingDao.setIsTransferredLocation(item.getIsTransferredLocation());
		discountItemMappingDao.setRegularConfigDetails(getRegularConfigDetailsDependents(item));
		if (item.getIsPreviewApplicable()) {
			discountItemMappingDao.setPreviewConfigDetails(getPreviewConfigDetailsDependents(item));
			discountItemMappingDao.setPreviewStartDate(formatDate(item.getPreviewStartDate()));
			discountItemMappingDao.setPreviewEndDate(formatDate(item.getPreviewEndDate()));
		}

		discountItemMappingDao.setIsActive(item.getIsActive());
		discountItemMappingDao.setCreatedBy(item.getLoginId());
		discountItemMappingDao.setCreatedDate(item.getCreatedDate());
		discountItemMappingDao.setLastModifiedBy(item.getLastModifiedId());
		discountItemMappingDao.setLastModifiedDate(item.getLastModifiedDate());
		discountItemMappingDao.setCorrelationId(item.getFileAuditId());
		discountItemMappingDao.setSrcSyncId(0);
		discountItemMappingDao.setDestSyncId(0);
		return discountItemMappingDao;
	}

	public static Date formatDate(String inDate) {

		String outDate = "";
		if (inDate != null) {
			try {
				Date date = inSDF.parse(inDate);
				outDate = outSDF.format(date);
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
				return sdf.parse(outDate);
			} catch (ParseException ex) {
			}
		}
		return null;

	}

	/**
	 * @param item
	 * @param discountDao
	 * @return
	 */
	private String getPreviewConfigDetailsDependents(ItemGroupLevelDiscountDto item) {
		PreviewConfigDetailsDto previewConfigDetailsDto = new PreviewConfigDetailsDto();
		if (item.getPreviewF1IsPercent() != null)
			previewConfigDetailsDto.setPreviewF1IsPercent(item.getPreviewF1IsPercent());
		if (item.getPreviewF2IsPercent() != null)
			previewConfigDetailsDto.setPreviewF2IsPercent(item.getPreviewF2IsPercent());
		if (item.getPreviewUcpIsPercent() != null)
			previewConfigDetailsDto.setPreviewUcpIsPercent(item.getPreviewUcpIsPercent());
		if (item.getPreviewVIsPercent() != null)
			previewConfigDetailsDto.setPreviewVIsPercent(item.getPreviewVIsPercent());
		if (item.getPreviewIsGrossWeight() != null)
			previewConfigDetailsDto.setPreviewIsGrossWeight(item.getPreviewIsGrossWeight());
		if (item.getPreviewF1Value() != null) {
			previewConfigDetailsDto.setPreviewF1Value(item.getPreviewF1Value());
		}
		if (item.getPreviewF2Value() != null)
			previewConfigDetailsDto.setPreviewF2Value(item.getPreviewF2Value());
		if (item.getPreviewUcpValue() != null)
			previewConfigDetailsDto.setPreviewUcpValue(item.getPreviewUcpValue());
		if (item.getPreviewVValue() != null)
			previewConfigDetailsDto.setPreviewVValue(item.getPreviewVValue());
		if (item.getPreviewWeightValue() != null)
			previewConfigDetailsDto.setPreviewWeightValue(item.getPreviewWeightValue());
		return MapperUtil.getJsonString(previewConfigDetailsDto);
	}

	/**
	 * @param item
	 * @return
	 */
	private String getRegularConfigDetailsDependents(ItemGroupLevelDiscountDto item) {
		RegularConfigDetailsDto regularConfigDetailsDto = new RegularConfigDetailsDto();
		regularConfigDetailsDto.setRegularF1IsPercent(item.getRegularF1IsPercent());
		regularConfigDetailsDto.setRegularF2IsPercent(item.getRegularF2IsPercent());
		regularConfigDetailsDto.setRegularUcpIsPercent(item.getRegularUcpIsPercent());
		regularConfigDetailsDto.setRegularVIsPercent(item.getRegularVIsPercent());
		regularConfigDetailsDto.setRegularIsGrossWeight(item.getRegularIsGrossWeight());
		regularConfigDetailsDto.setRegularF1Value(item.getRegularF1Value());
		regularConfigDetailsDto.setRegularF2Value(item.getRegularF2Value());
		regularConfigDetailsDto.setRegularUcpValue(item.getRegularUcpValue());
		regularConfigDetailsDto.setRegularVValue(item.getRegularVValue());
		regularConfigDetailsDto.setRegularWeightValue(item.getRegularWeightValue());
		return MapperUtil.getJsonString(regularConfigDetailsDto);
	}

}
