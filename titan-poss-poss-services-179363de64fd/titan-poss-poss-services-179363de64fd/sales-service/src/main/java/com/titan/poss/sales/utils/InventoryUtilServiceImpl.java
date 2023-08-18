/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.utils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
//import com.titan.poss.core.dto.InventoryItemDto;
import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dto.constants.BinGroupEnum;
import com.titan.poss.inventory.dto.response.InventoryItemDtoResExt;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.SalesDocTypeEnum;
import com.titan.poss.sales.dao.CashMemoDetailsDao;
import com.titan.poss.sales.dao.FocDetailsDao;
import com.titan.poss.sales.dao.GrnDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.ItemInvDetailsDto;
import com.titan.poss.sales.dto.constants.GRNCancellationTypeEnum;
import com.titan.poss.sales.inventory.service.InventoryService;
import com.titan.poss.sales.service.InventoryUtilService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("SalesInventoryUtil")
public class InventoryUtilServiceImpl implements InventoryUtilService {

	@Autowired
	private InventoryService inventoryService;

	private boolean isL3Store() {
		return CommonUtil.getAuthUser().isAnL3StoreUser();
	}

	/**
	 * This method can be called for CMCAN or GRN for adding item back to inventory
	 * 
	 * @param cashMemoDetails
	 * @param salesTxn        to get weight unit & currency code
	 * @param docType         GRN or CMCAN so on
	 * @param cancelType      for eg in GRN to identify whether it needs to go to
	 *                        DEFECTIVE bin or not
	 * @param docNo
	 * @return
	 */
	@Override
	public List<InventoryDetailsDao> createInventoryEntityFromCashMemoDetails(List<CashMemoDetailsDao> cashMemoDetails,
			List<FocDetailsDao> focDetails, SalesTxnDaoExt salesTxn, SalesDocTypeEnum docType, String cancelType,
			Integer docNo, Short fiscalYear,Map<String, GrnDetailsDaoExt> grnItemDetails) {

		// to override total quantity, total weight, total value
		// PENDING issue for coins (PG 73) where bin group not there & CMCAN, GRN

		String binCode = null;
		String binGroupCode = null;

		if (docType == SalesDocTypeEnum.GRN) {
			binCode = getGRNBinAndBinGroupCode(cancelType);
			binGroupCode = binCode;
		}

		List<InventoryDetailsDao> inventoryDetails = new ArrayList<>();

		// create inventory objects from cash memo items
		mapCmItemToInventory(cashMemoDetails, salesTxn, binCode, binGroupCode, inventoryDetails, docType ,grnItemDetails);

		// create inventory objects from FOC items
		mapFocItemToInventory(focDetails, binCode, binGroupCode, inventoryDetails);
		

		return inventoryService.addInventoryDetails(inventoryDetails, docNo, docType, fiscalYear);

	}

	private void mapFocItemToInventory(List<FocDetailsDao> focDetails, String binCode, String binGroupCode,
			List<InventoryDetailsDao> inventoryDetails) {

		if (CollectionUtil.isEmpty(focDetails))
			return;

		for (FocDetailsDao fd : focDetails) {

			// when FOC recovering without customer submit, then we keep quantity zero
			// in this case no need to add item to inventory
			if (fd.getTotalQuantity() > 0) {
				JsonData jsonData = MapperUtil.mapObjToClass(fd.getInventoryDetails(), JsonData.class);
				Optional.ofNullable(jsonData).ifPresent(jsonDataInvItemDtos -> {
					List<InventoryItemDtoResExt> invItemDtos =  MapperUtil.jsonStrToList(MapperUtil.getJsonString(jsonDataInvItemDtos.getData()),InventoryItemDtoResExt.class);
					Optional.ofNullable(invItemDtos).ifPresent(inventoryItemsDtos -> {
						inventoryItemsDtos.stream().forEach(invItemDto -> {
							InventoryDetailsDao existingInv = (InventoryDetailsDao) MapperUtil.getObjectMapping(invItemDto,
									new InventoryDetailsDao(),"totalWeightDetails");
							existingInv.setTotalWeightDetails(MapperUtil.getJsonString(invItemDto.getTotalWeightDetails()));
							
							InventoryDetailsDao inventory = (InventoryDetailsDao) MapperUtil.getObjectMapping(fd, existingInv);

							// UUID generate from Java layer
							inventory.setId(UUID.randomUUID().toString());
							inventory.setPreviousBinCode(inventory.getBinCode());
							inventory.setCurrencyCode(fd.getSalesTxn().getCurrencyCode());
							inventory.setSerialNumber(String.valueOf(inventory.getStdWeight()));
							inventory.setWeightUnit(fd.getSalesTxn().getWeightUnit());
							inventory.setLocationCode(CommonUtil.getStoreCode());
							inventory.setOrgCode(CommonUtil.getOrgCode());
							inventory.setIssuedQuantity((short) 0);
							inventory.setWeightModifiedCount((short) 0);
//							inventory.setProductGroup(invItemDto.getProductGroupCode());
//							inventory.setProductCategory(invItemDto.getProductCategoryCode());
							inventory.setProductGroup(invItemDto.getProductGroup());
							inventory.setProductCategory(invItemDto.getProductCategory());

							if (binCode != null) {
								inventory.setBinCode(binCode);
								inventory.setBinModifiedDate(CalendarUtils.getCurrentDate());
							}
							if (binGroupCode != null) {
								inventory.setBinGroupCode(binGroupCode);
							}

							inventoryDetails.add(inventory);

						});
					});
				});
								
			}

		}
	}

	private void mapCmItemToInventory(List<CashMemoDetailsDao> cashMemoDetails, SalesTxnDaoExt salesTxn, String binCode,
			String binGroupCode, List<InventoryDetailsDao> inventoryDetails, SalesDocTypeEnum docType, Map<String, GrnDetailsDaoExt> grnItemDetails) {
                
		for (CashMemoDetailsDao cmd : cashMemoDetails) {
			InventoryDetailsDao inventory = (InventoryDetailsDao) MapperUtil.getDtoMapping(cmd,
					InventoryDetailsDao.class, "id");

			// UUID generate from Java layer
			inventory.setId(UUID.randomUUID().toString());

			inventory.setPreviousBinCode(cmd.getBinCode());

			inventory.setStdWeight(cmd.getTotalWeight());
			inventory.setStdValue(cmd.getInventoryStdValue());
			inventory.setSerialNumber(String.valueOf(inventory.getStdWeight()));
			inventory.setTotalWeightDetails(cmd.getInventoryWeightDetails());
			inventory.setIssuedQuantity((short) 0);

			inventory.setWeightModifiedCount((short) 0);

			inventory.setProductGroup(cmd.getProductGroupCode());
			inventory.setProductCategory(cmd.getProductCategoryCode());

			if (binCode != null) {
				inventory.setBinCode(binCode);
				inventory.setBinModifiedDate(CalendarUtils.getCurrentDate());
			}
			if (binGroupCode != null) {
				inventory.setBinGroupCode(binGroupCode);
			}

			// total weight (depends on actual weight in inventory and total CM quantity)
			inventory.setTotalWeight(cmd.getTotalWeight().multiply(new BigDecimal(inventory.getTotalQuantity())));
			// total value (depends on standard value and total CM quantity)
			inventory.setTotalValue(cmd.getInventoryStdValue().multiply(new BigDecimal(inventory.getTotalQuantity())));

			// set item details
			PriceDetailsDto priceDetails = MapperUtil.mapObjToClass(cmd.getPriceDetails(), PriceDetailsDto.class);
			// @formatter:off
			JsonData itemDetails = new JsonData("ITEM_DETAILS",
					Map.of("stoneValue",
							((priceDetails.getStonePriceDetails() != null
							&& priceDetails.getStonePriceDetails().getPreDiscountValue() != null)
									? priceDetails.getStonePriceDetails().getPreDiscountValue()
											: 0),"isHallMarking",(priceDetails.getItemHallmarkDetails() 
													!= null ? priceDetails.getItemHallmarkDetails().getIsHallmarked():Boolean.FALSE)));

			setHallmarkDetails(docType, inventory, priceDetails);

			// @formatter:on
			inventory.setItemDetails(MapperUtil.getStringFromJson(itemDetails));

			inventory.setCurrencyCode(salesTxn.getCurrencyCode());
			inventory.setWeightUnit(salesTxn.getWeightUnit());

			inventory.setLocationCode(CommonUtil.getStoreCode());
			inventory.setOrgCode(CommonUtil.getOrgCode());
			 GrnDetailsDaoExt grnDetails =null;
            if(grnItemDetails!=null && TransactionTypeEnum.GRN.name().equalsIgnoreCase(docType.toString())){
            	 grnDetails = grnItemDetails.get(cmd.getId());
            }
			  
			// set bin group code in case of bill cancellation & GRN
			List<InventoryDetailsDao> invListForCoin = setBinCodeAndbinGroupAndHallmark(docType, cmd, inventory, grnDetails);

			if (CollectionUtil.isEmpty(invListForCoin)) {
				inventoryDetails.add(inventory);
			} else {
				inventoryDetails.addAll(invListForCoin);
			}

		}
	}

	private void setHallmarkDetails(SalesDocTypeEnum docType, InventoryDetailsDao inventory,
			PriceDetailsDto priceDetails) {
		if (priceDetails.getItemHallmarkDetails() != null) {
			inventory.setIsHallmarked(priceDetails.getItemHallmarkDetails().getIsHallmarked());
		}

		// NAP-8860
		if (SalesDocTypeEnum.GRN.equals(docType) && !BooleanUtils.isTrue(inventory.getIsHallmarked())) {
			inventory.setBinCode(CommonConstants.HALLMARK_DISPUTE_BIN);
			inventory.setBinGroupCode(CommonConstants.HALLMARK_DISPUTE_BIN);
		}
	}

	@SuppressWarnings("unchecked")
	private List<InventoryDetailsDao> setBinCodeAndbinGroupAndHallmark(SalesDocTypeEnum docType, CashMemoDetailsDao cmd,
			InventoryDetailsDao inventory, GrnDetailsDaoExt grnDetails) {
		List<InventoryDetailsDao> invListForCoins = new ArrayList<>();
		Map<String, Object> itemData = new HashMap();

		JsonData itemJsonData = MapperUtil.mapObjToClass(cmd.getItemDetails(), JsonData.class);
		if(itemJsonData != null)
		 itemData = MapperUtil.mapObjToClass(itemJsonData.getData(), Map.class);

		if (SalesDocTypeEnum.CMCAN.equals(docType)) {
			
			// if not coin, then directly set bin group code from item details of CM details
			if (!SalesConstants.COIN_PRODUCT_GROUP_CODES.contains(cmd.getProductGroupCode())) {
				
				ItemInvDetailsDto itemInvDetailsDto = itemData != null ? MapperUtil.mapObjToClass(itemData.get(cmd.getInventoryId()),
						ItemInvDetailsDto.class) : null;
				if(itemInvDetailsDto != null) {
				String previousBinGroup = itemInvDetailsDto.getBinGroupCode();
				
				// if cmd contains order_id then use item_details from order item  
				if (cmd.getOrderItem() != null && cmd.getOrderItem().getItemDetails() != null) {
					JsonData itemOrderJsonData = MapperUtil.mapObjToClass(cmd.getOrderItem().getItemDetails(), JsonData.class);
					@SuppressWarnings("unchecked")
					Map<String, Object> itemOrderData = itemOrderJsonData.getData() != null ? MapperUtil.mapObjToClass(itemOrderJsonData.getData(), Map.class) : new HashMap();
					
					// since itemOrderData will contain only one key value pair, get the first value 
					Map.Entry<String,Object> entry = itemOrderData != null ? itemOrderData.entrySet().iterator().next() : null;
					itemInvDetailsDto = entry != null ? MapperUtil.mapObjToClass(entry.getValue(),
							ItemInvDetailsDto.class) : null;
				}
				
				if(itemInvDetailsDto != null) {
				inventory.setBinCode(itemInvDetailsDto.getBinCode());
				inventory.setBinGroupCode(itemInvDetailsDto.getBinGroupCode());
				inventory.setPreviousBinGroupCode(previousBinGroup);
				inventory.setMfgDate(itemInvDetailsDto.getMfgDate());
				inventory.setStockInwardDate(itemInvDetailsDto.getStockInwardDate());
				}
			}
			} else {
				// for coins have to set bin group and bin code.
				for (Map.Entry<String, Object> itemDetails : itemData.entrySet()) {
					ItemInvDetailsDto itemInvDetailsDto = MapperUtil.mapObjToClass(itemDetails.getValue(),
							ItemInvDetailsDto.class);
					InventoryDetailsDao invDao = (InventoryDetailsDao) MapperUtil.getObjectMapping(inventory,
							new InventoryDetailsDao());
					// UUID generate from Java layer
					invDao.setId(UUID.randomUUID().toString());// new id for each coin
					invDao.setLotNumber(itemInvDetailsDto.getLotNumber());
					invDao.setIsHallmarked(itemInvDetailsDto.getIsHallmarked());
					invDao.setBinCode(itemInvDetailsDto.getBinCode());
					invDao.setBinGroupCode(itemInvDetailsDto.getBinGroupCode());
					invDao.setTotalQuantity(itemInvDetailsDto.getQuantity());
					invDao.setTotalWeight(
							cmd.getInventoryWeight().multiply(new BigDecimal(itemInvDetailsDto.getQuantity())));
					invDao.setTotalValue(
							cmd.getInventoryStdValue().multiply(new BigDecimal(itemInvDetailsDto.getQuantity())));
					invDao.setMfgDate(itemInvDetailsDto.getMfgDate());
					invDao.setStockInwardDate(itemInvDetailsDto.getStockInwardDate());

					invListForCoins.add(invDao);
				}
			}

		}

		if (SalesDocTypeEnum.GRN.equals(docType)
				&& SalesConstants.COIN_PRODUCT_GROUP_CODES.contains(cmd.getProductGroupCode())) {
			
		    List<InventoryDetailsDao> invExistDetails = inventoryService.getItemsByItemCodeAndBinGroupCodeAndLocationCode(cmd.getItemCode(),
		            		  BinGroupEnum.GRN.name(), CommonUtil.getLocationCode());
		    if(!CollectionUtil.isEmpty(invExistDetails)) {
		    	InventoryDetailsDao invExistDetail = invExistDetails.get(0);		    	
		    	invExistDetail.setTotalQuantity((short) (invExistDetail.getTotalQuantity()+grnDetails.getTotalQuantity()));	
		    	 BigDecimal totalGrnWt= invExistDetail.getStdWeight().multiply(BigDecimal.valueOf(grnDetails.getTotalQuantity()));
		    	 BigDecimal totalGrnValue= invExistDetail.getStdValue().multiply(BigDecimal.valueOf(grnDetails.getTotalQuantity()));
		    	invExistDetail.setTotalWeight(invExistDetail.getTotalWeight().add(totalGrnWt));	
		    	invExistDetail.setTotalValue(invExistDetail.getTotalValue().add(totalGrnValue));	
		    	invListForCoins.add(invExistDetail);
		    } else {
		    	Object itemDetails = itemData.values().stream().findFirst().get();
		    	ItemInvDetailsDto itemInvDetailsDto = MapperUtil.mapObjToClass(itemDetails,
						ItemInvDetailsDto.class);
		    	InventoryDetailsDao invDetail = (InventoryDetailsDao) MapperUtil.getObjectMapping(inventory,
						new InventoryDetailsDao());
		    	invDetail.setId(UUID.randomUUID().toString());
		    	invDetail.setItemCode(grnDetails.getItemCode());
		    	invDetail.setLotNumber(itemInvDetailsDto.getLotNumber());
		    	invDetail.setBinGroupCode(BinGroupEnum.GRN.name());
		    	invDetail.setBinCode(BinGroupEnum.GRN.name());
		    	invDetail.setIsHallmarked(itemInvDetailsDto.getIsHallmarked());
		    	invDetail.setTotalQuantity(grnDetails.getTotalQuantity());
		    	invDetail.setTotalValue(cmd.getInventoryStdValue().multiply(new BigDecimal(grnDetails.getTotalQuantity())));
		    	invDetail.setTotalWeight(cmd.getInventoryWeight().multiply(new BigDecimal(grnDetails.getTotalQuantity())));
		    	invDetail.setStdValue(cmd.getInventoryStdValue());
		    	invDetail.setStdWeight(cmd.getInventoryWeight());
		    	invDetail.setSerialNumber(String.valueOf(cmd.getInventoryWeight()));
		    	invDetail.setTotalWeightDetails(cmd.getMeasuredWeightDetails());;
		    	invListForCoins.add(invDetail);
		    }
			

		}

		return invListForCoins;
	}

	public String getGRNBinAndBinGroupCode(String cancelTypeStr) {

		// @formatter:off
		GRNCancellationTypeEnum cancelType = GRNCancellationTypeEnum.valueOf(cancelTypeStr);
		return (cancelType == GRNCancellationTypeEnum.REGULAR_GRN) ? BinGroupEnum.GRN.name()
				: BinGroupEnum.DEFECTIVE.name();
		// @formatter:on
	}

	public String getDefaultBinGroupCode() {
		return (isL3Store()) ? BinGroupEnum.PURCFA.name() : BinGroupEnum.STN.name();
	}
}
