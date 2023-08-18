/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.util;

import org.springframework.stereotype.Component;

import com.titan.poss.core.dto.TepPriceRequest;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.engine.constant.EngineConstants;
import com.titan.poss.engine.dto.TepConfigurations;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ProductGroupDao;
import com.titan.poss.sales.dao.CashMemoDetailsDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class TEPPriceFactory {

	public TEPPriceCalculator getPriceCalculator(String locationCode, ItemDao itemDto,
			ProductGroupDao productGroupDetail, TepPriceRequest tepPriceRequest, TepConfigurations tepCofigReponse,
			CashMemoDetailsDao cashMemo) {

		if (itemDto.getPricingType().equals(EngineConstants.UCP)) {
			return new TEPUcpCalculator(locationCode, itemDto, productGroupDetail, tepPriceRequest, tepCofigReponse,
					cashMemo);

		} else if (productGroupDetail.getPricingType().equals(EngineConstants.PLAIN) && isMetalTypeLJorJL(productGroupDetail)) {
			return new TEPMultiMetalPlainCalculator(locationCode, itemDto, productGroupDetail, tepPriceRequest, tepCofigReponse, cashMemo);

		} else if (productGroupDetail.getPricingType().equals(EngineConstants.STUDDED) && isMetalTypeLJorJL(productGroupDetail)) {
			return new TEPMultiMetalStuddedCalculator(locationCode, itemDto, productGroupDetail, tepPriceRequest,
					tepCofigReponse, cashMemo);

		} else if (productGroupDetail.getPricingType().equals(EngineConstants.PLAIN)) {
			return new TEPPlainCalculator(locationCode, itemDto, productGroupDetail, tepPriceRequest, tepCofigReponse, cashMemo);

		} else if (productGroupDetail.getPricingType().equals(EngineConstants.STUDDED)) {
			return new TEPStuddedCalculator(locationCode, itemDto, productGroupDetail, tepPriceRequest,
					tepCofigReponse, cashMemo);

		} else if (productGroupDetail.getPricingType().equals(EngineConstants.PJWS)) {
			return new TEPPjwsCalculator(locationCode, itemDto, productGroupDetail, tepPriceRequest, tepCofigReponse,
					cashMemo);

		} else if (productGroupDetail.getPricingType().equals(EngineConstants.PLAIN_STUDDED)) {
			return new TEPPlainStuddedCalculator(locationCode, itemDto, productGroupDetail, tepPriceRequest,
					tepCofigReponse, cashMemo);
		}

		else {
			throw new ServiceException("Type not Found", "ERR-INV-013");
		}
	}
	
	private boolean isMetalTypeLJorJL(ProductGroupDao productGroupDetail) {
		return productGroupDetail.getItemType().getItemTypeCode().equals(EngineConstants.LJ)
				|| productGroupDetail.getItemType().getItemTypeCode().equals(EngineConstants.JL);
	}



}
