/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.util;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Map;

import org.apache.commons.lang.BooleanUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.MakingChargeDetailsDto;
import com.titan.poss.core.dto.MaterialPriceDetailsDto;
import com.titan.poss.core.dto.MetalPriceDetailsDto;
import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.dto.StonePriceDetailsDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.engine.constant.EngineConstants;
import com.titan.poss.engine.service.PriceUtilService;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ProductGroupDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public abstract class NonUcpPriceCalculator {

	String locationCode;
	ItemDao itemDto;
	InventoryDetailsDao inventoryDetail;
	ProductGroupDao productGroupDetail;
	BigDecimal measuredWeight;
	Short measuredQuantity;
	Map<String, StandardPriceResponseDto> standardPrice;
	PriceResponseDto priceResponseData;
	Boolean checkInventory;
	Boolean isCOMPrice;

	void v(PriceUtilService priceUtilService) {
	}

	void f1(PriceUtilService priceUtilService) {
	}

	void f2(PriceUtilService priceUtilService) {
	}

	public PriceResponseDto price(PriceUtilService priceUtilService) {

		v(priceUtilService);
		f1(priceUtilService);
		f2(priceUtilService);
		return priceUtilService.getFinalPrice(priceResponseData);
	}

	public NonUcpPriceCalculator(String locationCode, ItemDao itemDto, InventoryDetailsDao inventoryDetail,
			ProductGroupDao productGroupDetail, BigDecimal measuredWeight, Short measuredQuantity,
			Map<String, StandardPriceResponseDto> standardPrice, Boolean checkInventory, Boolean isCOMPrice) {
		super();
		this.locationCode = locationCode;
		this.itemDto = itemDto;
		this.inventoryDetail = inventoryDetail;
		this.productGroupDetail = productGroupDetail;
		this.measuredWeight = measuredWeight;
		this.measuredQuantity = measuredQuantity;
		this.standardPrice = standardPrice;
		this.checkInventory = checkInventory;
		this.isCOMPrice =isCOMPrice;
		this.priceResponseData = intializePriceResponseData(inventoryDetail, productGroupDetail, itemDto);
	}

	private PriceResponseDto intializePriceResponseData(InventoryDetailsDao inventoryDetail,
			ProductGroupDao productGroupDetail, ItemDao itemDto) {

		PriceResponseDto priceResponseDto = new PriceResponseDto();
		PriceDetailsDto priceDetailDto = new PriceDetailsDto();
		MetalPriceDetailsDto metalPriceDetails = new MetalPriceDetailsDto();
		StonePriceDetailsDto stonePriceDetails = new StonePriceDetailsDto();
		MakingChargeDetailsDto makingChargeDetails = new MakingChargeDetailsDto();
		MaterialPriceDetailsDto materialPriceDetails = new MaterialPriceDetailsDto();
		priceResponseDto.setCheckInventory(this.checkInventory);
		priceResponseDto.setIsCOMPrice(this.isCOMPrice);
		if (BooleanUtils.isFalse(this.checkInventory)) {
			priceResponseDto.setItemCode(itemDto.getItemCode());
			priceResponseDto.setStdWeight(itemDto.getStdWeight());

		} else {
			priceResponseDto.setBinCode(inventoryDetail.getBinCode());
			priceResponseDto.setInventoryId(inventoryDetail.getId());
			priceResponseDto.setItemCode(inventoryDetail.getItemCode());
			priceResponseDto.setLotNumber(inventoryDetail.getLotNumber());
			priceResponseDto.setStdWeight(inventoryDetail.getStdWeight());
		}
		priceResponseDto.setProductDesc(productGroupDetail.getDescription());
		priceResponseDto.setItemQuantity((short) 1);
		priceResponseDto.setProductGroupDesc(productGroupDetail.getDescription());
		priceResponseDto.setComplexityCode(itemDto.getComplexity().getComplexityCode());
		priceResponseDto.setProductCategoryCode(itemDto.getProductCategory().getProductCategoryCode());
		priceResponseDto.setProductGroupCode(productGroupDetail.getProductGroupCode());
		priceResponseDto.setItemTypeCode(productGroupDetail.getItemType().getItemTypeCode());
		priceResponseDto.setPricingType(productGroupDetail.getPricingType());
		priceResponseDto.setPriceFactor(itemDto.getPriceFactor());
		priceDetailDto.setMetalPriceDetails(metalPriceDetails);
		priceDetailDto.setStonePriceDetails(stonePriceDetails);
		priceDetailDto.setMakingChargeDetails(makingChargeDetails);
		priceDetailDto.setMaterialDetails(materialPriceDetails);
		priceDetailDto.setIsUcp(false);
		priceResponseDto.setPriceDetails(priceDetailDto);

		// set price details for mandatory prices.
		try {
			ObjectMapper mapper = new ObjectMapper();
			JsonNode root = mapper.readTree(productGroupDetail.getPricingDetails());
			JsonNode dataNode = root.path("data");

			if (!dataNode.isMissingNode()) {
				if (dataNode.hasNonNull(EngineConstants.IS_GOLD_PRICE_MANDATORY))
					priceResponseDto.setIsGoldPriceMandatory(
							dataNode.path(EngineConstants.IS_GOLD_PRICE_MANDATORY).booleanValue());
				if (dataNode.hasNonNull(EngineConstants.IS_SILVER_PRICE_MANDATORY))
					priceResponseDto.setIsSilverPriceMandatory(
							dataNode.path(EngineConstants.IS_SILVER_PRICE_MANDATORY).booleanValue());
				if (dataNode.hasNonNull(EngineConstants.IS_PLATINUM_PRICE_MANDATORY))
					priceResponseDto.setIsPlatinumPriceMandatory(
							dataNode.path(EngineConstants.IS_PLATINUM_PRICE_MANDATORY).booleanValue());
				if (dataNode.hasNonNull(EngineConstants.IS_STONE_PRICE_MANDATORY))
					priceResponseDto.setIsStonePriceMandatory(
							dataNode.path(EngineConstants.IS_STONE_PRICE_MANDATORY).booleanValue());
				if (dataNode.hasNonNull(EngineConstants.IS_MAKING_CHARGE_MANDATORY))
					priceResponseDto.setIsMakingChargeMandatory(
							dataNode.path(EngineConstants.IS_MAKING_CHARGE_MANDATORY).booleanValue());
			}
		} catch (IOException e) {
			throw new ServiceException("UNABLE_TO_PARSE_JSON", "ERR-CORE-003");
		}
		return priceResponseDto;
	}

}
