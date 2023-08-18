/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.utils;

import java.math.BigDecimal;
import java.util.Map;

import com.titan.poss.core.dto.MakingChargeDetailsDto;
import com.titan.poss.core.dto.MaterialPriceDetailsDto;
import com.titan.poss.core.dto.MetalPriceDetailsDto;
import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.dto.StonePriceDetailsDto;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.sales.dao.OrderDetailsConfigDaoExt;
import com.titan.poss.sales.dao.OrderDetailsDaoExt;
import com.titan.poss.sales.service.OrderPriceUtilService;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public abstract class OrderNonUcpPriceCalculator {

	InventoryDetailsDao inventoryDetail;
	BigDecimal measuredWeight;
	Short measuredQuantity;
	Map<String, StandardPriceResponseDto> freezedPrice;
	OrderDetailsConfigDaoExt orderDetailsConfig;
	PriceDetailsDto priceDetailsOld;
	PriceResponseDto priceResponseDtoNew;

	void v(OrderPriceUtilService priceUtilService) {
	}

	void f1(OrderPriceUtilService priceUtilService) {
	}

	void f2(OrderPriceUtilService priceUtilService) {
	}

	public PriceResponseDto price(OrderPriceUtilService priceUtilService) {

		v(priceUtilService);
		f1(priceUtilService);
		f2(priceUtilService);
		return priceUtilService.getFinalPrice(priceResponseDtoNew);
	}

	public OrderNonUcpPriceCalculator(InventoryDetailsDao inventoryDetail, BigDecimal measuredWeight,
			Short measuredQuantity, Map<String, StandardPriceResponseDto> freezedPrice,
			OrderDetailsDaoExt orderDetailsDao, OrderDetailsConfigDaoExt orderDetailsConfig,
			PriceDetailsDto priceDetailsOld) {
		super();
		this.inventoryDetail = inventoryDetail;
		this.measuredWeight = measuredWeight;
		this.measuredQuantity = measuredQuantity;
		this.freezedPrice = freezedPrice;
		this.orderDetailsConfig = orderDetailsConfig;
		this.priceDetailsOld = priceDetailsOld;
		this.priceResponseDtoNew = intializePriceResponseData(inventoryDetail, orderDetailsDao, priceDetailsOld);
	}

	private PriceResponseDto intializePriceResponseData(InventoryDetailsDao inventoryDetail,
			OrderDetailsDaoExt orderDetailsDao, PriceDetailsDto priceDetailsOld) {

		PriceResponseDto priceResponseDto = new PriceResponseDto();
		PriceDetailsDto priceDetailDto = new PriceDetailsDto();

		MetalPriceDetailsDto metalPriceDetails = new MetalPriceDetailsDto();
		StonePriceDetailsDto stonePriceDetails = new StonePriceDetailsDto();
		MakingChargeDetailsDto makingChargeDetails = new MakingChargeDetailsDto();
		MaterialPriceDetailsDto materialPriceDetails = new MaterialPriceDetailsDto();

		priceResponseDto.setBinCode(inventoryDetail.getBinCode());
		priceResponseDto.setInventoryId(inventoryDetail.getId());
		priceResponseDto.setItemCode(inventoryDetail.getItemCode());
		priceResponseDto.setLotNumber(inventoryDetail.getLotNumber());
		priceResponseDto.setStdWeight(inventoryDetail.getStdWeight());
		priceResponseDto.setItemQuantity((short) 1);
		priceResponseDto.setProductCategoryCode(orderDetailsDao.getProductCategoryCode());
		priceResponseDto.setProductGroupCode(orderDetailsDao.getProductGroupCode());
		priceResponseDto.setItemTypeCode(priceDetailsOld.getItemTypeCode());
		priceDetailDto.setMetalPriceDetails(metalPriceDetails);
		priceDetailDto.setStonePriceDetails(stonePriceDetails);
		priceDetailDto.setMakingChargeDetails(makingChargeDetails);
		priceDetailDto.setMaterialDetails(materialPriceDetails);
		priceDetailDto.setIsUcp(false);
		priceResponseDto.setPriceDetails(priceDetailDto);

		// set price details for mandatory prices.

		return priceResponseDto;
	}

}
