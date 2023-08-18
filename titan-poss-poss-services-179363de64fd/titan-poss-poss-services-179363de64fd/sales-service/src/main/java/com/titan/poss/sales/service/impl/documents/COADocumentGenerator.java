/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.documents;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.ItemDetailsDto;
import com.titan.poss.core.dto.StoneDetailsLiteDto;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.constants.PrintCommonConstants;
import com.titan.poss.sales.dto.print.COAPrintDto;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.dto.response.ItemDetailsResponseDto;
import com.titan.poss.sales.factory.DocumentFactory;
import com.titan.poss.sales.inventory.service.InventoryEngineService;
import com.titan.poss.sales.repository.CashMemoDetailsRepositoryExt;
import com.titan.poss.sales.service.CommonCashMemoService;
import com.titan.poss.sales.service.DocumentGenerator;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.impl.BusinessDayServiceImpl;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class COADocumentGenerator extends SalesDocumentGenerator implements DocumentGenerator {

	@Autowired
	private BusinessDayServiceImpl businessDayService;

	@Autowired
	private CashMemoDetailsRepositoryExt cashMemoDetailsRepo;

	@Autowired
	private EngineService engineService;

	@Autowired
	private CommonCashMemoService cashMemoCommonService;
	
	@Autowired
	private InventoryEngineService inventoryEngineService;
	
	

	public COADocumentGenerator(DocumentFactory documentFactory) {
		documentFactory.registerDocumentService(PrintDocumentTypeEnum.COA.name(),
				PrintFileTypeEnum.INVOICE_PRINT.name(), this);
	}

	@Override
	public PrintableDto getPrintableDto(String txnId, String id) {
		return getftlBindingObjectForCOA(txnId, id);
	}

	/**
	 * @param txnId
	 * @param id
	 * @return
	 */
	private COAPrintDto getftlBindingObjectForCOA(String txnId, String id) {
		COAPrintDto coaPrintDto = new COAPrintDto();

		coaPrintDto.setStoreDetails(getStoreDetails());
		coaPrintDto.setCashMemo(getCashMemo(txnId, CommonUtil.getStoreCode()));
		coaPrintDto.setCustomerMasterId(getCustomerId(coaPrintDto.getCashMemo().getCustomerId(),null));
		coaPrintDto.setBusinessDate(businessDayService.getBusinessDay().getBusinessDate());
		ItemDetailsResponseDto cashMemoDetails=getCashMemoDetails(txnId, id);
		setStoneDetails(cashMemoDetails,coaPrintDto);
		coaPrintDto.setItemDetails(cashMemoDetails);
		List<String> itemCodes = new ArrayList<>();
		itemCodes.add(coaPrintDto.getItemDetails().getItemCode());
        coaPrintDto.setItems(engineService.listItemDetails(itemCodes));
		Map<String, ItemDetailsDto> items=engineService.listItemDetails(itemCodes);
		ItemDetailsDto itemDetailsDto=items.get(coaPrintDto.getItemDetails().getItemCode());
	/*	if(null != cashMemoDetails.getPricingType() && cashMemoDetails.getPricingType().equals(PricingTypeEnum.PJWS.toString())) {
			BigDecimal otherStoneWeight = BigDecimal.ZERO;
			try {
				otherStoneWeight =new BigDecimal(new JSONObject(cashMemoDetails.getMeasuredWeightDetails()).getJSONObject("data").getString("stoneWeight")).toString());
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			BigDecimal netWeight = itemDetailsDto.getStoneWeight().add(otherStoneWeight);
			coaPrintDto.setStoneWeight(netWeight);
		}
		else*/
		coaPrintDto.setDiamondClarity(itemDetailsDto.getDiamondClarity());
		coaPrintDto.setDiamondColor(itemDetailsDto.getDiamondColor());
		coaPrintDto.setProductCategories(inventoryEngineService.getProductCategories());
		coaPrintDto.setIsPlainItem(SalesConstants.PLAIN.equalsIgnoreCase(itemDetailsDto.getPricingGroupType())?true:false);
		coaPrintDto.setItemTypeCode(itemDetailsDto.getItemType().getItemTypeCode());
		coaPrintDto.setKarat(itemDetailsDto.getKarat());
		coaPrintDto.setPurity(itemDetailsDto.getPurity());
		return coaPrintDto;
	}

	private void setStoneDetails(ItemDetailsResponseDto cashMemoDetails, COAPrintDto coaPrintDto) {
		if(null!=cashMemoDetails.getPriceDetails() && null!=cashMemoDetails.getPriceDetails().getStonePriceDetails()) {
			Boolean isUcp = (null!=cashMemoDetails.getPriceDetails().getIsUcp()) ? cashMemoDetails.getPriceDetails().getIsUcp() : false;
		if (BooleanUtils.isFalse(isUcp)
				&& cashMemoDetails.getPriceDetails().getStonePriceDetails().getStoneWeight() != null
					&& cashMemoDetails.getPriceDetails().getStonePriceDetails().getStoneWeightForView() != null) {
			List<StoneDetailsLiteDto> stoneDetails = engineService.getStoneDetails(cashMemoDetails.getItemCode(),
					cashMemoDetails.getLotNumber());
			if (stoneDetails != null) {
				BigDecimal diamondWeight = BigDecimal.ZERO;
				Set<String> diamondQuality = new HashSet<String>();
				Set<String> diamondColor = new HashSet<String>();
				Map<String, BigDecimal> otherStoneDetails = new HashMap<String, BigDecimal>();
				for (StoneDetailsLiteDto itemStone : stoneDetails) {
					if("DI".equals(itemStone.getStoneTypeCode())) {
						diamondWeight = diamondWeight.add(itemStone.getStoneWeight());
						diamondQuality.add(itemStone.getQuality());
						diamondColor.add(itemStone.getColor());
					}else {
						otherStoneDetails.merge(itemStone.getStoneTypeCode(), itemStone.getStoneWeight(), BigDecimal::add);
					}
				}
				coaPrintDto.setDiamondCaratage(diamondWeight);
				coaPrintDto.setDiamondClarity(String.join(PrintCommonConstants.SLASH, diamondQuality));
				coaPrintDto.setDiamondColor(String.join(PrintCommonConstants.SLASH, diamondColor));
				coaPrintDto.setStoneWeight(otherStoneDetails.values().stream().map(Object::toString).collect(Collectors.joining(PrintCommonConstants.SLASH)));
				coaPrintDto.setStoneCombination(otherStoneDetails.keySet().stream().map(Object::toString).collect(Collectors.joining(PrintCommonConstants.SLASH)));
			}		
			}
		}
	}

	/**
	 * 
	 * @param txnId
	 * @return ItemDetailsResponseDto
	 */
	private ItemDetailsResponseDto getCashMemoDetails(String txnId, String id) {

		CashMemoDetailsDaoExt cashMemoDetails = cashMemoDetailsRepo.findOneByIdAndCashMemoDaoId(id, txnId);

		return cashMemoCommonService.mapCashMemoDetailsToItemDto(cashMemoDetails);

	}

	@Override
	public PrintableDto getDto() {
		return new COAPrintDto();
	}

	@Override
	public PrintableDto getPrintableto(PrintRequestDto printRequest) {
		// TODO Auto-generated method stub
		return null;
	}

}
