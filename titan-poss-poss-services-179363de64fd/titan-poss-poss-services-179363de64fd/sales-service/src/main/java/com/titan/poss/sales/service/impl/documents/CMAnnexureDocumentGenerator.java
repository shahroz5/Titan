/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.documents;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.dto.TaxDetailDto;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.TxnTypeTotalDetailDto;
import com.titan.poss.sales.dto.print.CMAnnexurePrintDto;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.dto.response.ItemDetailsResponseDto;
import com.titan.poss.sales.factory.DocumentFactory;
import com.titan.poss.sales.inventory.service.InventoryEngineService;
import com.titan.poss.sales.repository.CashMemoDetailsRepositoryExt;
import com.titan.poss.sales.service.CommonCashMemoService;
import com.titan.poss.sales.service.DocumentGenerator;
import com.titan.poss.sales.service.impl.BusinessDayServiceImpl;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class CMAnnexureDocumentGenerator extends SalesDocumentGenerator implements DocumentGenerator {

	@Autowired
	private BusinessDayServiceImpl businessDayService;

	@Autowired
	private CashMemoDetailsRepositoryExt cashMemoDetailsRepo;

	@Autowired
	private CommonCashMemoService cashMemoCommonService;
	
	@Autowired
	private EngineServiceClient engineService;
	
	@Autowired
	private InventoryEngineService inventoryEngineService;

	public CMAnnexureDocumentGenerator(DocumentFactory documentFactory) {
		documentFactory.registerDocumentService(PrintDocumentTypeEnum.CM_ANNEXURE.name(),
				PrintFileTypeEnum.INVOICE_PRINT.name(), this);
	}

	@Override
	public PrintableDto getPrintableDto(String txnId, String productCode) {
		return getftlBindingObjectForCMAnnexture(txnId);
	}

	/**
	 * @param txnId
	 * @return
	 */
	private CMAnnexurePrintDto getftlBindingObjectForCMAnnexture(String txnId) {
		CMAnnexurePrintDto cashMemoPrint = new CMAnnexurePrintDto();
		SimpleDateFormat docDate = new SimpleDateFormat("dd/MM/yyyy");
		cashMemoPrint.setStoreDetails(getStoreDetails());
		cashMemoPrint.setCashMemo(getCashMemo(txnId, CommonUtil.getStoreCode()));
		List<ItemDetailsResponseDto> itemDetails = getCashMemoDetails(txnId);
		cashMemoPrint.setItemDetails(itemDetails);
//		List<String> itemCodes = itemDetails.stream().map(ItemDetailsResponseDto::getItemCode)
//				.collect(Collectors.toList());
		cashMemoPrint.setCmTotalDetail(getCMTotalDetail(itemDetails));
		cashMemoPrint.setCustomer(getCustomerDetails(txnId, CommonUtil.getLocationCode()));
		cashMemoPrint.setCustomerMasterId(getCustomerId(cashMemoPrint.getCashMemo().getCustomerId(),null));
		cashMemoPrint.setDocDate(docDate.format(cashMemoPrint.getCashMemo().getDocDate()));
		cashMemoPrint.setBusinessDate(businessDayService.getBusinessDay().getBusinessDate());
		cashMemoPrint.setDocNo(cashMemoPrint.getCashMemo().getDocNo());
		cashMemoPrint.setLocationCode(getStoreDetails().getCompanyName() );
		List<String> itemCodes = itemDetails.stream().map(ItemDetailsResponseDto::getItemCode)
				.collect(Collectors.toList());
		cashMemoPrint.setItems(engineService.listItemDetails(itemCodes));
		cashMemoPrint.setProductCategories(inventoryEngineService.getProductCategories());
		return cashMemoPrint;
	}

	private TxnTypeTotalDetailDto getCMTotalDetail(List<ItemDetailsResponseDto> itemDetails) {

		TxnTypeTotalDetailDto cmTotalDetail = new TxnTypeTotalDetailDto();

		BigDecimal totalGrossWeight = BigDecimal.ZERO;
		BigDecimal totalStoneWeight = BigDecimal.ZERO;
		BigDecimal totalMakingCharges = BigDecimal.ZERO;
		BigDecimal totalProductValue = BigDecimal.ZERO;
		BigDecimal totalPriceValue = BigDecimal.ZERO;

		List<String> taxCodeList = new ArrayList<>();

		Map<String, BigDecimal> totalTax = new HashMap<>();

		for (ItemDetailsResponseDto itemDetailResponse : itemDetails) {
			totalProductValue = totalProductValue.add(itemDetailResponse.getFinalValue()).setScale(2,RoundingMode.HALF_UP);
			totalPriceValue = totalPriceValue.add(itemDetailResponse.getTotalValue()).setScale(2,RoundingMode.HALF_UP);

			for (Entry<String, TaxDetailDto> taxCalculation : itemDetailResponse.getTaxDetails().getData().entrySet()) {
				if (totalTax.containsKey(taxCalculation.getValue().getTaxCode())) {
					totalTax.put(taxCalculation.getValue().getTaxCode(), totalTax
							.get(taxCalculation.getValue().getTaxCode()).add(taxCalculation.getValue().getTaxValue()));
				} else {
					taxCodeList.add(taxCalculation.getValue().getTaxCode());
					totalTax.put(taxCalculation.getValue().getTaxCode(), taxCalculation.getValue().getTaxValue());
				}
			}

			if (BooleanUtils.isFalse(itemDetailResponse.getPriceDetails().getIsUcp())
					&& itemDetailResponse.getPriceDetails().getStonePriceDetails().getStoneWeight() != null) {
				totalStoneWeight = totalStoneWeight
						.add(itemDetailResponse.getPriceDetails().getStonePriceDetails().getStoneWeight()).setScale(3,RoundingMode.HALF_UP);
			} else {
				if (BooleanUtils.isFalse(itemDetailResponse.getPriceDetails().getIsUcp()))
					itemDetailResponse.getPriceDetails().getStonePriceDetails().setStoneWeight(BigDecimal.ZERO);
			}
			if (BooleanUtils.isFalse(itemDetailResponse.getPriceDetails().getIsUcp()))
				totalMakingCharges = totalMakingCharges
						.add(itemDetailResponse.getPriceDetails().getMakingChargeDetails().getPreDiscountValue()).setScale(2,RoundingMode.HALF_UP);

			if (itemDetailResponse.getTotalWeight() != null)
				totalGrossWeight = totalGrossWeight.add(itemDetailResponse.getTotalWeight()).setScale(3,RoundingMode.HALF_UP);
			
			if(BooleanUtils.isFalse(itemDetailResponse.getPriceDetails().getIsUcp()) && 
					itemDetailResponse.getPriceDetails().getStonePriceDetails().getPreDiscountValue()==null) {
				itemDetailResponse.getPriceDetails().getStonePriceDetails().setPreDiscountValue(BigDecimal.ZERO);
			}

		}

		// For HMGST to be at the 2nd row of last column put HMGST to the end of the
		// list
		if (taxCodeList.contains(CommonConstants.HMGST)) {
			taxCodeList.remove(CommonConstants.HMGST);
			taxCodeList.add(CommonConstants.HMGST);
		}

		cmTotalDetail.setTotalGrossWeight(totalGrossWeight);
		cmTotalDetail.setTotalMakingCharges(totalMakingCharges);
		cmTotalDetail.setTotalPriceValue(totalPriceValue);
		cmTotalDetail.setTotalProductValue(totalProductValue);
		cmTotalDetail.setTotalStoneWeight(totalStoneWeight);
		cmTotalDetail.setTotalTax(totalTax);
		cmTotalDetail.setTaxCodeList(taxCodeList);
		cmTotalDetail.setHmGst(CommonConstants.HMGST);

		return cmTotalDetail;

	}

	/**
	 * 
	 * @param txnId
	 * @return List<ItemDetailsResponseDto>
	 */
	private List<ItemDetailsResponseDto> getCashMemoDetails(String txnId) {

		List<CashMemoDetailsDaoExt> cashMemoDetailsList = cashMemoDetailsRepo.findByCashMemoDaoId(txnId);

		List<ItemDetailsResponseDto> itemDetailsList = new ArrayList<>();
		for (CashMemoDetailsDaoExt cashMemoDetails : cashMemoDetailsList) {
			ItemDetailsResponseDto itemDetails = cashMemoCommonService.mapCashMemoDetailsToItemDto(cashMemoDetails);
			itemDetailsList.add(itemDetails);
		}

		return itemDetailsList;
	}

	@Override
	public PrintableDto getDto() {
		return new CMAnnexurePrintDto();
	}

	@Override
	public PrintableDto getPrintableto(PrintRequestDto printRequest) {
		// TODO Auto-generated method stub
		return null;
	}

}
