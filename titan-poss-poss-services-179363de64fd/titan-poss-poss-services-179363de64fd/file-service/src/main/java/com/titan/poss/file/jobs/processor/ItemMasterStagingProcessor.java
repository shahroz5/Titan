/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.ItemMasterFileStageDto;
import com.titan.poss.file.dto.ItemMasterStageDto;
import com.titan.poss.file.service.DataAuditService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class ItemMasterStagingProcessor
		implements ItemProcessor<ItemMasterFileStageDto, ItemMasterStageDto>, StepExecutionListener {

	private static final String DATE_FORMAT = "dd-MMM-yyyy";

	private String fileAuditId;

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public ItemMasterStageDto process(ItemMasterFileStageDto itemMasterDto) throws Exception {

		try {
			ItemMasterStageDto itemMasterStageDto = new ItemMasterStageDto();
			itemMasterStageDto.setStoneWeight(new BigDecimal(itemMasterDto.getStoneWeight().replace("'", "")));
			itemMasterStageDto.setItemCode(itemMasterDto.getItemCode().replace("'", ""));
			itemMasterStageDto.setDescription(itemMasterDto.getDescription().replace("'", ""));
			itemMasterStageDto.setIsActive(getBooleanValue(itemMasterDto.getIsActive().replace("'", "")));
			itemMasterStageDto.setConsignmentFlag(getBooleanValue(itemMasterDto.getConsignmentFlag().replace("'", "")));
			itemMasterStageDto
					.setMaxWeightDeviation(new BigDecimal(itemMasterDto.getMaxWeightDeviation().replace("'", "")));
			itemMasterStageDto.setInventoryType(checkIfNull(itemMasterDto.getInventoryType().replace("'", "")));
			itemMasterStageDto.setStdWeight(new BigDecimal(itemMasterDto.getStdWeight().replace("'", "")));
			itemMasterStageDto.setProductCode(checkIfNull(itemMasterDto.getProductCode().replace("'", "")));
			itemMasterStageDto.setBrandCode(checkIfNull(itemMasterDto.getBrandCode().replace("'", "")));
			itemMasterStageDto.setProductType(checkIfNull(itemMasterDto.getProductType().replace("'", "")));
			itemMasterStageDto.setMaterialCode(checkIfNull(itemMasterDto.getMaterialCode().replace("'", "")));
			itemMasterStageDto.setSupplyChainCode(checkIfNull(itemMasterDto.getSupplyChainCode().replace("'", "")));
			itemMasterStageDto.setStdPrice(new BigDecimal(itemMasterDto.getStdPrice().replace("'", "")));
			itemMasterStageDto.setStoneCharges(new BigDecimal(itemMasterDto.getStoneCharges().replace("'", "")));
			itemMasterStageDto.setComplexityCode(checkIfNull(itemMasterDto.getComplexityCode().replace("'", "")));
			itemMasterStageDto.setPricingType(checkIfNull(itemMasterDto.getPricingType().replace("'", "")));
			itemMasterStageDto.setIsSaleable(getBooleanValue(itemMasterDto.getIsSaleable().replace("'", "")));
			itemMasterStageDto.setTaxClass(checkIfNull(itemMasterDto.getTaxClass().replace("'", "")));
			itemMasterStageDto.setFindingCode(checkIfNull(itemMasterDto.getFindingCode().replace("'", "")));
			itemMasterStageDto.setSize(checkIfNull(itemMasterDto.getSize().replace("'", "")));
			itemMasterStageDto.setFinishing(checkIfNull(itemMasterDto.getFinishing().replace("'", "")));
			itemMasterStageDto.setIsPerGram(getBooleanValue(itemMasterDto.getIsPerGram().replace("'", "")));
			itemMasterStageDto.setPricingGroupType(checkIfNull(itemMasterDto.getPricingGroupType().replace("'", "")));
			itemMasterStageDto.setIsReturnable(getBooleanValue(itemMasterDto.getIsReturnable().replace("'", "")));
			itemMasterStageDto.setKaratage(new BigDecimal(itemMasterDto.getKaratage().replace("'", "")));
			itemMasterStageDto.setItemNature(checkIfNull(itemMasterDto.getItemNature().replace("'", "")));
			itemMasterStageDto.setIndentType(checkIfNull(itemMasterDto.getIndentType().replace("'", "")));
			itemMasterStageDto.setCfaProductCode(checkIfNull(itemMasterDto.getCfaProductCode().replace("'", "")));
			itemMasterStageDto.setLoginId(checkIfNull(itemMasterDto.getLoginId().replace("'", "")));
			itemMasterStageDto.setCreatedDate(
					CalendarUtils.convertStringToDate(itemMasterDto.getCreatedDate().replace("'", ""), DATE_FORMAT));
			itemMasterStageDto.setLastModifiedId(itemMasterDto.getLastModifiedId().replace("'", ""));
			itemMasterStageDto.setLastModifiedDate(CalendarUtils
					.convertStringToDate(itemMasterDto.getLastModifiedDate().replace("'", ""), DATE_FORMAT));
			itemMasterStageDto.setDiamondCaratage(new BigDecimal(itemMasterDto.getDiamondCaratage().replace("'", "")));
			itemMasterStageDto.setDiamondColor(checkIfNull(itemMasterDto.getDiamondColor().replace("'", "")));
			itemMasterStageDto.setDiamondClarity(checkIfNull(itemMasterDto.getDiamondClarity().replace("'", "")));
			itemMasterStageDto.setLeadTime(new BigDecimal(itemMasterDto.getLeadTime().replace("'", "")));
			itemMasterStageDto.setIsForIndent(getBooleanValue(itemMasterDto.getIsForIndent().replace("'", "")));
			itemMasterStageDto.setBusinessGroup(checkIfNull(itemMasterDto.getBusinessGroup().replace("'", "")));
			itemMasterStageDto.setCollectionName(checkIfNull(itemMasterDto.getCollectionName().replace("'", "")));
			itemMasterStageDto.setDesignerName(checkIfNull(itemMasterDto.getDesignerName().replace("'", "")));
			itemMasterStageDto.setThemeDesign(checkIfNull(itemMasterDto.getThemeDesign().replace("'", "")));
			itemMasterStageDto.setDesignStyle1(checkIfNull(itemMasterDto.getDesignStyle1().replace("'", "")));
			itemMasterStageDto.setDesignStyle2(checkIfNull(itemMasterDto.getDesignStyle2().replace("'", "")));
			itemMasterStageDto.setDelicateCode(checkIfNull(itemMasterDto.getDelicateCode().replace("'", "")));
			itemMasterStageDto.setGender(checkIfNull(itemMasterDto.getGender().replace("'", "")));
			itemMasterStageDto.setPlatingType(checkIfNull(itemMasterDto.getPlatingType().replace("'", "")));
			itemMasterStageDto.setProductionRoute(checkIfNull(itemMasterDto.getProductionRoute().replace("'", "")));
			itemMasterStageDto.setShape(checkIfNull(itemMasterDto.getShape().replace("'", "")));
			itemMasterStageDto.setMaterialColour(checkIfNull(itemMasterDto.getMaterialColour().replace("'", "")));
			itemMasterStageDto.setStoneCombination(checkIfNull(itemMasterDto.getStoneCombination().replace("'", "")));
			itemMasterStageDto
					.setGuaranteePeriod(Integer.parseInt(itemMasterDto.getGuaranteePeriod().replace("'", "")));
			itemMasterStageDto.setUsageOccasion(checkIfNull(itemMasterDto.getUsageOccasion().replace("'", "")));
			itemMasterStageDto.setPricingPyramid(checkIfNull(itemMasterDto.getPricingPyramid().replace("'", "")));
			itemMasterStageDto.setIndicativePrice(checkIfNull(itemMasterDto.getIndicativePrice().replace("'", "")));
			itemMasterStageDto.setIsCustomerOrderDropped(
					getBooleanValue(itemMasterDto.getIsCustomerOrderDropped().replace("'", "")));
			itemMasterStageDto.setIsSplit(getBooleanValue(itemMasterDto.getIsSplit().replace("'", "")));
			itemMasterStageDto.setParentRef(checkIfNull(itemMasterDto.getParentRef().replace("'", "")));
			itemMasterStageDto.setIsFocItem(getBooleanValue(itemMasterDto.getIsFocItem().replace("'", "")));
			itemMasterStageDto.setHsnSacCode(checkIfNull(itemMasterDto.getHsnSacCode().replace("'", "")));
			itemMasterStageDto.setPurity(new BigDecimal((StringUtils.isEmpty(itemMasterDto.getPurity()) ? "0"
					: itemMasterDto.getPurity().replace("'", ""))));
			itemMasterStageDto.setBIMetal(checkIfNull(itemMasterDto.getBIMetal().replace("'", "")));
			itemMasterStageDto.setTotCategory(checkIfNull(itemMasterDto.getTotCategory().replace("'", "")));
			String priceFactor = checkIfNull(itemMasterDto.getPriceFactor().replace("'", ""));
			itemMasterStageDto.setPriceFactor(priceFactor == null ? new BigDecimal(1) : new BigDecimal(priceFactor));
			itemMasterStageDto.setFileAuditId(fileAuditId);
			itemMasterStageDto.setItemDetails(getItemDetails(itemMasterStageDto));
			itemMasterStageDto.setConfigDetails(getConfigDetails(itemMasterStageDto));
			// default is update because more records will be update flow, if the records
			// are to be inserted then
			// it will be changed in ItemMasterIngestionTasklet
			itemMasterStageDto.setTransferType("UPDATE");
			itemMasterStageDto.setProductType(checkIfNull(itemMasterDto.getProductType().replace("'", "")));
			return itemMasterStageDto;
		} catch (Exception e) {
			dataAuditService.saveDataAuditData(itemMasterDto.getItemCode(), MapperUtil.getJsonString(itemMasterDto),
					e.getMessage(), fileAuditId, ErrorTypeEnum.ERROR.toString());
			return null;
		}

	}

	private String getItemDetails(ItemMasterStageDto itemMasterStageDto) {

		Map<String, String> itemDetails = new HashMap<>();
		itemDetails.put("MaxWeightDeviation", itemMasterStageDto.getMaxWeightDeviation().toString());
		itemDetails.put("InventoryType", itemMasterStageDto.getInventoryType());
		itemDetails.put("SupplyChainCode", itemMasterStageDto.getSupplyChainCode());
		itemDetails.put("FindingCode", itemMasterStageDto.getFindingCode());
		itemDetails.put("Size", itemMasterStageDto.getSize());
		itemDetails.put("Finishing", itemMasterStageDto.getFinishing());
		itemDetails.put("ItemNature", itemMasterStageDto.getItemNature());
		itemDetails.put("CollectionName", itemMasterStageDto.getCollectionName());
		itemDetails.put("DesignerName", itemMasterStageDto.getDesignerName());
		itemDetails.put("ThemeDesign", itemMasterStageDto.getThemeDesign());
		itemDetails.put("DesignStyle1", itemMasterStageDto.getDesignStyle1());
		itemDetails.put("DesignStyle2", itemMasterStageDto.getDesignStyle2());
		itemDetails.put("Gender", itemMasterStageDto.getGender());
		itemDetails.put("PlatingType", itemMasterStageDto.getPlatingType());
		itemDetails.put("ProductionRoute", itemMasterStageDto.getProductionRoute());
		itemDetails.put("Shape", itemMasterStageDto.getShape());
		itemDetails.put("MaterialColor", itemMasterStageDto.getMaterialColour());
		itemDetails.put("GuaranteePeriod", itemMasterStageDto.getGuaranteePeriod().toString());
		itemDetails.put("UsageOcassion", itemMasterStageDto.getUsageOccasion());
		itemDetails.put("PricingPyramid", itemMasterStageDto.getPricingPyramid());
		itemDetails.put("IndicativePrice", itemMasterStageDto.getIndicativePrice());
		itemDetails.put("BIMetal", itemMasterStageDto.getBIMetal());
		itemDetails.put("IndentType", itemMasterStageDto.getIndentType());

		Map<String, Object> itemMasterObject = new LinkedHashMap<>();
		itemMasterObject.put("type", "ITEM_DETAILS");
		itemMasterObject.put("data", itemDetails);
		return MapperUtil.getStringFromJson(itemMasterObject);

	}

	private String getConfigDetails(ItemMasterStageDto itemMasterStageDto) {

		Map<String, String> itemConfigDetails = new HashMap<>();
		itemConfigDetails.put("ConsignmentFlag", itemMasterStageDto.getConsignmentFlag().toString());
		itemConfigDetails.put("IsPerGram", itemMasterStageDto.getIsPerGram().toString());
		itemConfigDetails.put("DelicateCode", itemMasterStageDto.getDelicateCode());
		itemConfigDetails.put("IsCustomerOrderDropped", itemMasterStageDto.getIsCustomerOrderDropped().toString());
		itemConfigDetails.put("IsSplit", itemMasterStageDto.getIsSplit().toString());
		itemConfigDetails.put("IsForIndent", itemMasterStageDto.getIsForIndent().toString());

		Map<String, Object> itemMasterObject = new LinkedHashMap<>();
		itemMasterObject.put("type", "CONFIG_DETAILS");
		itemMasterObject.put("data", itemConfigDetails);
		return MapperUtil.getStringFromJson(itemMasterObject);
	}

	private String checkIfNull(String input) {
		return StringUtils.isEmpty(input.trim()) ? null : input;
	}

	private Boolean getBooleanValue(String input) {
		return input.equalsIgnoreCase("1");
	}

	@Override
	public void beforeStep(StepExecution stepExecution) {
		fileAuditId = stepExecution.getJobExecution().getExecutionContext().getString("itemMasterFileAuditId");
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		return ExitStatus.COMPLETED;
	}
}
