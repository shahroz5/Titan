/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.util;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

import com.titan.poss.core.domain.constant.TepTypeEnum;
import com.titan.poss.core.dto.BaseStoneDetails;
import com.titan.poss.core.dto.ItemLotStoneDto;
import com.titan.poss.core.dto.MakingChargeDetailsDto;
import com.titan.poss.core.dto.MaterialPriceDetailsDto;
import com.titan.poss.core.dto.MetalPriceDetailsDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.dto.StonePriceDetailsDto;
import com.titan.poss.core.dto.TepPriceRequest;
import com.titan.poss.core.dto.TepPriceResponseDto;
import com.titan.poss.core.enums.PricingTypeEnum;
import com.titan.poss.engine.constant.EngineConstants;
import com.titan.poss.engine.dto.TepConfigurations;
import com.titan.poss.engine.service.TEPPriceUtilService;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ProductGroupDao;
import com.titan.poss.sales.dao.CashMemoDetailsDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@EqualsAndHashCode(callSuper = false)
@Data
public abstract class TEPPriceCalculator {

	String locationCode;
	ItemDao itemDto;
	ProductGroupDao productGroupDetail;

	TepPriceRequest tepRequest;
	Map<String, StandardPriceResponseDto> standardPrice;
	TepPriceResponseDto priceResponseData;
	TepConfigurations tepConfig;
	List<BaseStoneDetails> stones;

	CashMemoDetailsDao cashMemo;

	public TEPPriceCalculator(String locationCode, ItemDao itemDto, ProductGroupDao productGroupDetail,
			TepPriceRequest tepPriceRequest, TepConfigurations tepConfig, CashMemoDetailsDao cashMemo) {
		super();
		this.locationCode = locationCode;
		this.itemDto = itemDto;
		this.productGroupDetail = productGroupDetail;
		this.tepRequest = tepPriceRequest;
		this.standardPrice = tepPriceRequest.getStandardPrice();
		this.tepConfig = tepConfig;
		this.priceResponseData = new TepPriceResponseDto();
		this.stones = tepPriceRequest.getStones();
		this.cashMemo = cashMemo;
	}

	void setInitialResponse(TEPPriceUtilService priceUtilService) {
		intializePriceResponseData(productGroupDetail, itemDto);
		// common method for all
		priceUtilService.setInitialResponse(locationCode, tepConfig, priceResponseData, itemDto,
				tepRequest.getMeasuredWeight());

	}

	void getFlatItemExceptionValue(TEPPriceUtilService priceUtilService) {
		// common method for all
		priceUtilService.getFlatItemExceptionValue(locationCode, tepConfig, priceResponseData, itemDto.getStdWeight(),
				tepRequest.getMeasuredWeight());
	}

	/**
	 * @param priceUtilService
	 */
	private void calculateStdWeight(TEPPriceUtilService priceUtilService) {
		priceUtilService.calculateStdWeight(itemDto, priceResponseData, tepRequest.getMeasuredWeight(),
				tepRequest.getMeasuredQuantity(), tepConfig);

	}

	void applyDeductions(TEPPriceUtilService priceUtilService) {
	}

	void applyStoneDeductions(TEPPriceUtilService priceUtilService) {

	}

	void v(TEPPriceUtilService priceUtilService) {
	}

	void f1(TEPPriceUtilService priceUtilService) {
	}

	void f2(TEPPriceUtilService priceUtilService) {
	}

	// defaulted to take cm weight if cm is available
	// in ucp its overrided to take cm value
	void setCMData(TEPPriceUtilService priceUtilService) {
		priceUtilService.setCMData(cashMemo, priceResponseData);
	}

	/**
	 * @param priceUtilService
	 */
	void applyRefundDeductions(TEPPriceUtilService priceUtilService) {
		priceUtilService.applyRefundDeductions(tepConfig, priceResponseData);
	}
	
	void applyDiscountRecovery(TEPPriceUtilService priceUtilService) {

	}
	
	void applyftepDiscountRecovery(TEPPriceUtilService priceUtilService) {
		priceUtilService.ftepDiscountRecovery(priceResponseData,tepConfig,tepRequest);
	}

	void getTotalPrice(TEPPriceUtilService priceUtilService) {
		priceUtilService.getFinalPrice(priceResponseData);
	}

	/**
	 * @param priceUtilService
	 */
	void calculateStdValue(TEPPriceUtilService priceUtilService) {

	}

	TepPriceResponseDto getPrice() {
		// round off all values to 2 decimal.
		priceResponseData.setFinalValue(
				priceResponseData.getFinalValue().setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP));
		return priceResponseData;
	}

	public TepPriceResponseDto price(TEPPriceUtilService priceUtilService) {
		setInitialResponse(priceUtilService);
		priceResponseData.setTepExceptionDetails(tepRequest.getTepExceptionDetails());
		// in case of ucp gets cmValue
		// for others gets weight details
		setCMData(priceUtilService);
		// if finalvalue is having value then can be returned as it is exceptionValue.
		if (priceResponseData == null || !priceResponseData.getIsExceptionValue()) {
			// used in case of Studded
			applyStoneDeductions(priceUtilService);
			// following calculation is common for all other than UCP.
			// can be splitted in different methods and to be called from different
			if (priceResponseData != null && !priceResponseData.getIsUCPCMValue()
					&& !itemDto.getPricingType().equals(PricingTypeEnum.UCP.toString())) {
				calculateStdWeight(priceUtilService);
				v(priceUtilService); // plain and studded
				f1(priceUtilService); // studded
				// making change will be calcualted only for full value TEP
				f2(priceUtilService); // studded
				getTotalPrice(priceUtilService);
			}
			// call for ucp std value calculation as v f1 should not be taken care.
			/** ucp std value call (if exception and cm value is not available) **/
			calculateStdValue(priceUtilService);
			// if ucp and cm value is not available take price from item master and multiply
			// with weight if changed
			if (!(TepTypeEnum.FULL_VALUE_TEP.name().equals(tepRequest.getTepType())
					|| TepTypeEnum.MANUAL_FULL_VALUE_TEP.name().equals(tepRequest.getTepType()))) {
				applyDeductions(priceUtilService);
				// discountRecovery
				applyDiscountRecovery(priceUtilService);
			}else {
				applyftepDiscountRecovery(priceUtilService);
				if(productGroupDetail.getPricingType().equals(EngineConstants.PLAIN)) {
					priceResponseData.setDiscountRecovered(priceResponseData.getDiscountRecovered());
					priceResponseData.setFinalValue(priceResponseData.getFinalValue().subtract(priceResponseData.getDiscountRecovered()));	
				}
			}		
		}
		getFlatItemExceptionValue(priceUtilService);
		// should take care separately.. common for all the flows..
		applyRefundDeductions(priceUtilService);
		// multiply with total quantity for updated final value

		if (itemDto.getPricingType().equalsIgnoreCase("UCP")) {
			priceResponseData.setIsUCPproduct(Boolean.TRUE);
			priceResponseData.setNetWeight(BigDecimal.ZERO);
		}

		return getPrice();
	}

	private void intializePriceResponseData(ProductGroupDao productGroupDetail, ItemDao itemDto) {
		ItemLotStoneDto stone = new ItemLotStoneDto();
		stone.setStoneWeight(BigDecimal.ZERO);
		priceResponseData.setStones(List.of(stone));
		MetalPriceDetailsDto metalPriceDetails = new MetalPriceDetailsDto();
		StonePriceDetailsDto stonePriceDetails = new StonePriceDetailsDto();
		MaterialPriceDetailsDto materialPriceDetails = new MaterialPriceDetailsDto();
		MakingChargeDetailsDto makingChargeDetails = new MakingChargeDetailsDto();
		priceResponseData.setTepType(tepRequest.getTepType());
		priceResponseData.setItemQuantity((short) 1);
		priceResponseData.setDiscountRecovered(BigDecimal.ZERO);
		priceResponseData.setProductGroupDesc(productGroupDetail.getDescription());
		priceResponseData.setProductCategoryCode(itemDto.getProductCategory().getProductCategoryCode());
		priceResponseData.setProductGroupCode(productGroupDetail.getProductGroupCode());
		priceResponseData.setCmUnavailableDeductionAmount(BigDecimal.ZERO);
		priceResponseData.setItemCode(itemDto.getItemCode());
		priceResponseData.setProductGroupDesc(productGroupDetail.getDescription());
		if (itemDto.getPricingType().equalsIgnoreCase("UCP")) {
			priceResponseData.setIsUCPproduct(Boolean.TRUE);
		} else
			priceResponseData.setIsUCPproduct(Boolean.FALSE);
		priceResponseData.setMetalPriceDetails(metalPriceDetails);
		priceResponseData.setStonePriceDetails(stonePriceDetails);
		priceResponseData.setMaterialDetails(materialPriceDetails);
		priceResponseData.setMakingChargeDetails(makingChargeDetails);
		priceResponseData.setItemTypeCode(productGroupDetail.getItemType().getItemTypeCode());
		// default to false..
		priceResponseData.setIscashMemoAvailable(false);
		priceResponseData.setIsUCPCMValue(false);
		priceResponseData.setIsExceptionValue(false);

		if (this.cashMemo != null) {
			priceResponseData.setBilledWeight(this.cashMemo.getTotalWeight());
			priceResponseData.setIscashMemoAvailable(true);
			priceResponseData.setCmDocNo(this.cashMemo.getCashMemoDao().getSalesTxnDao().getDocNo());
			priceResponseData.setCmLocationCode(this.cashMemo.getCashMemoDao().getSalesTxnDao().getLocationCode());
			priceResponseData.setCmFiscalYear(this.cashMemo.getCashMemoDao().getSalesTxnDao().getFiscalYear());
		}
	}

}
