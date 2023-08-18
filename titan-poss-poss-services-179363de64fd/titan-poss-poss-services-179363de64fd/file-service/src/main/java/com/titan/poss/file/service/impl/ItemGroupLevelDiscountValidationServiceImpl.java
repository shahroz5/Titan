/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import java.text.SimpleDateFormat;
import java.util.List;

import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.config.dao.DiscountDao;
import com.titan.poss.config.dto.request.json.BestDealDiscountConfigDetails;
import com.titan.poss.config.dto.request.json.ItemGroupConfig;
import com.titan.poss.config.repository.DiscountItemMappingRepositoryExt;
import com.titan.poss.config.repository.DiscountRepository;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.dto.DataAuditDto;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.ItemGroupLevelDiscountDto;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.file.service.ItemGroupLevelDiscountValidationService;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.repository.InventoryDetailsRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class ItemGroupLevelDiscountValidationServiceImpl implements ItemGroupLevelDiscountValidationService {

	private static final String VALUE_NOT_IN_THE_CONFIGURED_RANGE = "Value mismatched with configured max % or value";

	private static final String DATE_FORMAT = "MM/dd/yyyy";
	@Autowired
	DiscountRepository discountMasterRepo;

	@Autowired
	private DataAuditService dataAuditService;

	@Autowired
	DiscountItemMappingRepositoryExt discountItemMappingRepo;

	@Autowired
	InventoryDetailsRepository inventoryDetailsRepo;

	@Override
	public boolean dataValidation(ItemGroupLevelDiscountDto item, String discount) {
		if (!checkForNull(item)) {
			return false;
		}
		return checkForInvalidData(item, discount);

	}

	private boolean checkForInvalidData(ItemGroupLevelDiscountDto item, String discount) {

		DiscountDao discountDao = null;

		if (!item.getDiscountCode().matches(RegExConstants.DISCOUNT_CODE_REGEX)
				|| StringUtils.isEmpty(item.getDiscountCode())) {
			saveErrorAudit(item, "Discount code Validation Failed:Please check the DiscountCode");
			return false;
		}
		if (!item.getLotNumber().matches(RegExConstants.LOT_NUMBER_REGEX) || StringUtils.isEmpty(item.getLotNumber())) {
			saveErrorAudit(item, "Lot Number Validation Failed:Please check the LotNumber");
			return false;
		}

		if (!item.getItemCode().matches(RegExConstants.ITEM_CODE_REGEX) || StringUtils.isEmpty(item.getItemCode())) {
			saveErrorAudit(item, "Item code Validation Failed:Please check the ItemCode");
			return false;
		}

		if (discount.equalsIgnoreCase("bestDeal"))
			discountDao = discountMasterRepo.findOneByDiscountCodeAndDiscountType(item.getDiscountCode(),
					DiscountTypeEnum.BEST_DEAL_DISCOUNT.name());

		if (discount.equalsIgnoreCase("itemGroup"))
			discountDao = discountMasterRepo.findOneByDiscountCodeAndDiscountType(item.getDiscountCode(),
					DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT.name());

		if (discountDao == null) {
			saveErrorAudit(item, "No discount available for given discount code and discount type");
			return false;
		}

		SimpleDateFormat format = new SimpleDateFormat("MM/dd/yyyy");
		String currentDate = format.format(CalendarUtils.getCurrentDate());
		// String endDate = CalendarUtils.convertStringToDate(item.getRegularEndDate(),
		// DATE_FORMAT);
		if (CalendarUtils.convertStringToDate(item.getRegularStartDate(), DATE_FORMAT)
				.after(CalendarUtils.convertStringToDate(item.getRegularEndDate(), DATE_FORMAT))
				|| currentDate.compareTo(item.getRegularEndDate()) > 0) {
			saveErrorAudit(item,
					"end date should be greater than or equal to current date and must be after start date");
			return false;
		}

		if (discountItemMappingRepo.ifDiscountExist(item.getDiscountCode(), item.getLocationCode(), item.getItemCode(),
				item.getLotNumber(), item.getIsActive(),
				CalendarUtils.convertStringToDate(item.getRegularStartDate(), DATE_FORMAT),
				CalendarUtils.convertStringToDate(item.getRegularEndDate(), DATE_FORMAT), Boolean.TRUE) != 0) {
			saveErrorAudit(item, "Discount already applicable for the given item");
			return false;
		}

		if (item.getIsPreviewApplicable() && !checkPreviewDependents(item, discountDao))
			return false;
		if (!checkRegularDependents(item, discountDao))
			return false;

		if (discount.equalsIgnoreCase("itemGroup") || discount.equalsIgnoreCase("bestDeal")) {
			List<InventoryDetailsDao> inventoryDetailsDao = inventoryDetailsRepo
					.findAllByLocationCodeAndItemCodeAndLotNumber(item.getLocationCode(), item.getItemCode(),
							item.getLotNumber());

			if (inventoryDetailsDao.isEmpty()) {
				saveErrorAudit(item, "Item code with the given lot number at this location is not available");
				return false;
			}
		}

		if (discount.equalsIgnoreCase("bestDeal")) {
			JsonData jsonData = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(discountDao.getConfigDetails()), JsonData.class);
			BestDealDiscountConfigDetails bestDealConfigDetails = MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(MapperUtil.getJsonString(jsonData.getData())),
					BestDealDiscountConfigDetails.class);

			List<InventoryDetailsDao> inventoryDetailsDao = inventoryDetailsRepo.findByLocationCodeBasedOnLotAgeBinAge(
					item.getLocationCode(), item.getItemCode(), item.getLotNumber(),
					bestDealConfigDetails.getLotAge().getFromValue(), bestDealConfigDetails.getLotAge().getToValue(),
					bestDealConfigDetails.getBinAge().getFromValue(), bestDealConfigDetails.getBinAge().getToValue());
			if (CollectionUtil.isEmpty(inventoryDetailsDao)) {
				saveErrorAudit(item, "Lot age or bin age validation failed");
				return false;
			}
		}
		return true;
	}

	/**
	 * @param item
	 * @param discountDao
	 */
	private boolean checkRegularDependents(ItemGroupLevelDiscountDto item, DiscountDao discountDao) {
		JsonData jsonData = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(discountDao.getItemGroupConfig()), JsonData.class);
		ItemGroupConfig itemGroupConfigDetails = MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.getJsonFromString(MapperUtil.getJsonString(jsonData.getData())), ItemGroupConfig.class);

		if (item.getRegularF1Value() != null) {
			if (!item.getRegularF1IsPercent() && itemGroupConfigDetails.getMaxStoneCharges().getValue() != null
					&& itemGroupConfigDetails.getMaxStoneCharges().getValue().compareTo(item.getRegularF1Value()) < 0) {
				saveErrorAudit(item, VALUE_NOT_IN_THE_CONFIGURED_RANGE);
				return false;
			}
			if (item.getRegularF1IsPercent() && itemGroupConfigDetails.getMaxStoneCharges().getPercent() != null
					&& itemGroupConfigDetails.getMaxStoneCharges().getPercent()
							.compareTo(item.getRegularF1Value()) < 0) {
				saveErrorAudit(item, VALUE_NOT_IN_THE_CONFIGURED_RANGE);
				return false;

			}
		}

		if (item.getRegularF2Value() != null) {
			if (!item.getRegularF2IsPercent() && itemGroupConfigDetails.getMaxMC().getValue() != null
					&& itemGroupConfigDetails.getMaxMC().getValue().compareTo(item.getRegularF2Value()) < 0) {
				saveErrorAudit(item, VALUE_NOT_IN_THE_CONFIGURED_RANGE);
				return false;
			}
			if (item.getRegularF2IsPercent() && itemGroupConfigDetails.getMaxMC().getPercent() != null
					&& itemGroupConfigDetails.getMaxMC().getPercent().compareTo(item.getRegularF2Value()) < 0) {
				saveErrorAudit(item, VALUE_NOT_IN_THE_CONFIGURED_RANGE);
				return false;
			}
		}

		if (item.getRegularVValue() != null) {
			if (!item.getRegularVIsPercent() && itemGroupConfigDetails.getMaxMetalCharge().getValue() != null
					&& itemGroupConfigDetails.getMaxMetalCharge().getValue().compareTo(item.getRegularVValue()) < 0) {
				saveErrorAudit(item, VALUE_NOT_IN_THE_CONFIGURED_RANGE);
				return false;
			}
			if (item.getRegularVIsPercent() && itemGroupConfigDetails.getMaxMetalCharge().getPercent() != null
					&& itemGroupConfigDetails.getMaxMetalCharge().getPercent().compareTo(item.getRegularVValue()) < 0) {
				saveErrorAudit(item, VALUE_NOT_IN_THE_CONFIGURED_RANGE);
				return false;
			}
		}

		if (item.getRegularUcpValue() != null) {
			if (!item.getRegularUcpIsPercent() && itemGroupConfigDetails.getMaxUCP().getValue() != null
					&& itemGroupConfigDetails.getMaxUCP().getValue().compareTo(item.getRegularUcpValue()) < 0) {
				saveErrorAudit(item, VALUE_NOT_IN_THE_CONFIGURED_RANGE);
				return false;
			}
			if (item.getRegularUcpIsPercent() && itemGroupConfigDetails.getMaxUCP().getPercent() != null
					&& itemGroupConfigDetails.getMaxUCP().getPercent().compareTo(item.getRegularUcpValue()) < 0) {
				saveErrorAudit(item, VALUE_NOT_IN_THE_CONFIGURED_RANGE);
				return false;
			}
		}
		if (item.getRegularIsGrossWeight() != null
				&& itemGroupConfigDetails.getMaxPsPerGram().getWeight().compareTo(item.getRegularWeightValue()) < 0) {
			saveErrorAudit(item, VALUE_NOT_IN_THE_CONFIGURED_RANGE);
			return false;
		}

		return true;

	}

	/**
	 * @param item
	 * @param discountDao
	 */
	private boolean checkPreviewDependents(ItemGroupLevelDiscountDto item, DiscountDao discountDao) {
		JsonData jsonData = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(discountDao.getItemGroupConfig()), JsonData.class);
		ItemGroupConfig itemGroupConfigDetails = MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.getJsonFromString(MapperUtil.getJsonString(jsonData.getData())), ItemGroupConfig.class);

		if (item.getPreviewF1Value() != null) {
			if (!item.getPreviewF1IsPercent() && itemGroupConfigDetails.getMaxStoneCharges().getValue() != null
					&& itemGroupConfigDetails.getMaxStoneCharges().getValue().compareTo(item.getPreviewF1Value()) < 0) {
				saveErrorAudit(item, VALUE_NOT_IN_THE_CONFIGURED_RANGE);
				return false;
			}
			if (item.getPreviewF1IsPercent() && itemGroupConfigDetails.getMaxStoneCharges().getPercent() != null
					&& itemGroupConfigDetails.getMaxStoneCharges().getPercent()
							.compareTo(item.getPreviewF1Value()) < 0) {
				saveErrorAudit(item, VALUE_NOT_IN_THE_CONFIGURED_RANGE);
				return false;

			}
		}

		if (item.getPreviewF2Value() != null) {
			if (!item.getPreviewF2IsPercent() && itemGroupConfigDetails.getMaxMC().getValue() != null
					&& itemGroupConfigDetails.getMaxMC().getValue().compareTo(item.getPreviewF2Value()) < 0) {
				saveErrorAudit(item, VALUE_NOT_IN_THE_CONFIGURED_RANGE);
				return false;
			}
			if (item.getPreviewF2IsPercent() && itemGroupConfigDetails.getMaxMC().getPercent() != null
					&& itemGroupConfigDetails.getMaxMC().getPercent().compareTo(item.getPreviewF2Value()) < 0) {
				saveErrorAudit(item, VALUE_NOT_IN_THE_CONFIGURED_RANGE);
				return false;
			}
		}

		if (item.getPreviewVValue() != null) {
			if (!item.getPreviewVIsPercent() && itemGroupConfigDetails.getMaxMetalCharge().getValue() != null
					&& itemGroupConfigDetails.getMaxMetalCharge().getValue().compareTo(item.getPreviewVValue()) < 0) {
				saveErrorAudit(item, VALUE_NOT_IN_THE_CONFIGURED_RANGE);
				return false;
			}
			if (item.getPreviewVIsPercent() && itemGroupConfigDetails.getMaxMetalCharge().getPercent() != null
					&& itemGroupConfigDetails.getMaxMetalCharge().getPercent().compareTo(item.getPreviewVValue()) < 0) {
				saveErrorAudit(item, VALUE_NOT_IN_THE_CONFIGURED_RANGE);
				return false;
			}
		}

		if (item.getPreviewUcpValue() != null) {
			if (!item.getPreviewUcpIsPercent() && itemGroupConfigDetails.getMaxUCP().getValue() != null
					&& itemGroupConfigDetails.getMaxUCP().getValue().compareTo(item.getPreviewUcpValue()) < 0) {
				saveErrorAudit(item, VALUE_NOT_IN_THE_CONFIGURED_RANGE);
				return false;
			}
			if (item.getPreviewUcpIsPercent() && itemGroupConfigDetails.getMaxUCP().getPercent() != null
					&& itemGroupConfigDetails.getMaxUCP().getPercent().compareTo(item.getPreviewUcpValue()) < 0) {
				saveErrorAudit(item, VALUE_NOT_IN_THE_CONFIGURED_RANGE);
				return false;
			}
		}
		if (item.getPreviewIsGrossWeight() != null
				&& itemGroupConfigDetails.getMaxPsPerGram().getWeight().compareTo(item.getPreviewWeightValue()) < 0) {
			saveErrorAudit(item, VALUE_NOT_IN_THE_CONFIGURED_RANGE);
			return false;
		}

		return true;
	}

	private boolean checkForNull(ItemGroupLevelDiscountDto item) {
		if (StringUtils.isEmpty(item.getDiscountCode())) {
			saveErrorAudit(item, "discount code cannot be empty");
			return false;
		}
		if (!BooleanUtils.isTrue(item.getIsActive()) && !BooleanUtils.isFalse(item.getIsActive())) {
			saveErrorAudit(item, "is Active cannot be empty");
			return false;
		}
		return true;
	}

	public void saveErrorAudit(ItemGroupLevelDiscountDto item, String errorMsg) {
		DataAuditDto dataAudit = new DataAuditDto();
		dataAudit.setPrimaryData(StringUtils.isEmpty(item.getItemCode()) ? "" : item.getItemCode());
		dataAudit.setData(MapperUtil.getJsonString(item));
		dataAudit.setErrorMessage(errorMsg);
		dataAudit.setFileId(item.getFileAuditId());
		dataAudit.setErrorType(ErrorTypeEnum.ERROR.toString());
		dataAuditService.saveDataAudit(dataAudit);
	}
}
