/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.dto.CessDetailDto;
import com.titan.poss.core.dto.LocationCoordinateDto;
import com.titan.poss.core.dto.MetalPriceDto;
import com.titan.poss.core.dto.OrdersPriceRequest;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.TaxDetailDto;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dto.constants.BinGroupEnum;
import com.titan.poss.inventory.repository.InventoryDetailsRepository;
import com.titan.poss.sales.dto.COInBoundItemDetailsDto;
import com.titan.poss.sales.dto.response.TotalTaxAndTaxDetailsDto;
import com.titan.poss.sales.service.CustomerOrderInBoundService;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service
public class CustomerOrderInBoundServiceImpl  implements CustomerOrderInBoundService{
	
	@Value("${poss.com.item-count:5}")
	private int toIndex;
	
	public static final String CGST = "CGST";
	
	public static final String SGST = "SGST";

	public static final String UTGST = "UTGST";
	
	@Autowired
	private InventoryDetailsRepository inventoryDetailsRepository;
	
	@Autowired
	private EngineServiceClient engineServiceClient;
	
	@Autowired
	private CommonTransactionServiceImpl commonTransactionServiceImpl;
	
	/**
	 * This method will get the list of nearest locations wherein the item is 
	 * available along with its details and price calculated.
	 * @param itemCode
	 * @param baseLocationCode
	 * @return nearestLocList
	 */
	public List<COInBoundItemDetailsDto> searchAvailableItemList(String itemCode ,String baseLocationCode) 
	{
		LocationCoordinateDto baseLocation = new LocationCoordinateDto();
		
		List<String> binGroupList = new ArrayList<>(Arrays.asList(BinGroupEnum.STN.toString()));

		long startTime=System.nanoTime();
		log.info("Start time of inventory db call.................{}",startTime);
		//getting list of items with their details by passing ItemCode to check in which all locations it is available
		List<InventoryDetailsDao> itemList = inventoryDetailsRepository.getItemsByItemCode(itemCode ,binGroupList);
		log.info("End time of inventory db call............{}",System.nanoTime(),"........total time...........{}",(System.nanoTime()-startTime));
		
		//this is a of location where item is available ...repeated list of locations
		List<String> list=new ArrayList<>();
		for (InventoryDetailsDao item : itemList)
		{ 
			list.add(item.getLocationCode());
		}
		
		List<String> itemAvailableLocList = list.stream().distinct().collect(Collectors.toList());
		log.info(" Unique list of Locations.............{}",itemAvailableLocList);
		
		//get list of all locations from location master which is active-query(location code, latitude, longitude)
		List<LocationCoordinateDto> locListWithLatLon=engineServiceClient.getAllByLocationIfIsActive();
		
		List<LocationCoordinateDto> removeLocationList = new ArrayList<>();
		
		for(LocationCoordinateDto location: locListWithLatLon)
		{
			if(location.getLocationCode().equalsIgnoreCase(baseLocationCode))
			{
				baseLocation.setLocationCode(baseLocationCode);
				baseLocation.setLatitude(location.getLatitude());
				baseLocation.setLongitude(location.getLongitude());
				removeLocationList.add(location);
			}
			
			if(itemAvailableLocList.contains(location.getLocationCode())!=true)
			{
				removeLocationList.add(location);
			}
		}
		locListWithLatLon.removeAll(removeLocationList);
		
		JsonData storeData;
		StoreDetails value = new StoreDetails();
		Double distance;
		Map<String, Double> locationWithDistance=new HashMap<>();
		Map<String, StoreDetails> locationWithStoreDetails=new HashMap<>();
		Map<String, LocationCoordinateDto> locListwithAllDetails = new HashMap<>();
		for(LocationCoordinateDto destLocation: locListWithLatLon)
		{
			storeData = MapperUtil.mapObjToClass(destLocation.getStoreDetails(), JsonData.class);
			if (storeData != null)
			{
				value = MapperUtil.mapObjToClass(storeData.getData(), StoreDetails.class);
			}
			
			distance= calculateDistance(baseLocation.getLatitude(), baseLocation.getLongitude(),destLocation.getLatitude(),destLocation.getLongitude());
			destLocation.setStoreDetailsDao(value);
			locListwithAllDetails.put(destLocation.getLocationCode(), destLocation); 
			
			locationWithDistance.put(destLocation.getLocationCode(), distance);
			locationWithStoreDetails.put(destLocation.getLocationCode(), value);
		}
		log.info("location with distance BEFORE sublisting to 5 locations...........{}",locationWithDistance);
		
		//Sorting Map based on Distance 
		locationWithDistance = locationWithDistance.entrySet()
                .stream()
                .sorted(Map.Entry.comparingByValue())
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));
		
		log.info("location with distance after sorting...........{}",locationWithDistance);
		
		if(locationWithDistance.size()<toIndex)
		{
			toIndex=locationWithDistance.size();
			log.info("toIndex...........{}",toIndex);
		}
		
		//making subMap out of locationWithDistance map based on toIndex Value.
		locationWithDistance.keySet().removeAll(Arrays.asList(locationWithDistance.keySet().toArray()).subList(toIndex, locationWithDistance.size()));
		log.info("location with distance after sublisting to 5 locations...........{}",locationWithDistance);
		
		List<COInBoundItemDetailsDto> allAvailableLocList = new ArrayList<COInBoundItemDetailsDto>();
		for(InventoryDetailsDao item : itemList)
		{
			if(locationWithDistance.containsKey(item.getLocationCode()))
			{
				allAvailableLocList.add(setCOItemDetails(item, locationWithDistance.get(item.getLocationCode()),locListwithAllDetails.get(item.getLocationCode())));
			}		
		}
		
		Collections.sort(allAvailableLocList);
		
		List<COInBoundItemDetailsDto> nearestLocList= new ArrayList<COInBoundItemDetailsDto>();
		
		OrdersPriceRequest orderPriceRequest=new OrdersPriceRequest();
		
		//Setting standard metal rates based on locationCode
		orderPriceRequest.setStandardPrice(commonTransactionServiceImpl.getMetalRate().getMetalRates());
		log.info("standard pricd in getPriceDetails......{}", orderPriceRequest.getStandardPrice());
		
		PriceResponseDto price = new PriceResponseDto();
		
		TaxCalculationResponseDto taxDto = new TaxCalculationResponseDto();
		
		TotalTaxAndTaxDetailsDto taxincludedPrice=new TotalTaxAndTaxDetailsDto();
		
		// new type need to be created..
		TxnTaxTypeEnum taxType=TxnTaxTypeEnum.CUST_TRANSACTION_PRIORITY_ORDER;
	
		List<MetalPriceDto> listOfMetals = new ArrayList<>();
		//For price and tax calculation
		for(COInBoundItemDetailsDto coItem : allAvailableLocList)
		{
	
			orderPriceRequest.setItemCode(coItem.getItemCode());
			orderPriceRequest.setLotNumber(coItem.getLotNumber());
			orderPriceRequest.setInventoryId(coItem.getId());
			//orderPriceRequest.setIsComPrice(true);
			
			long startPriceTime=System.nanoTime();
			log.info("Start time of PRice Calculation...........{}",startPriceTime);
			price=engineServiceClient.getPriceDetails(orderPriceRequest, coItem.getLocationCode());
			log.info("End time of PRice Calculation............{}",System.nanoTime(),"........total time......{}",(System.nanoTime()-startPriceTime));
			
			coItem.setBasicPrice(price.getFinalValue());
			coItem.setBinCode(price.getBinCode());
			coItem.setProductGroupCode(price.getProductGroupCode());
			
			listOfMetals = price.getPriceDetails().getMetalPriceDetails().getMetalPrices();
			for(MetalPriceDto mp : listOfMetals)
			{
				if(mp.getMetalTypeCode().equals(MetalTypeCodeEnum.L.name()))
				{
					coItem.setPlatinumWtCharges(mp.getMetalValue());
					coItem.setPlatinumRate(mp.getRatePerUnit());
				}else if(mp.getMetalTypeCode().equals(MetalTypeCodeEnum.P.name()))
				{
					coItem.setSilverWtCharges(mp.getMetalValue());
					coItem.setSilverRate(mp.getRatePerUnit());
				}else if(mp.getMetalTypeCode().equals(MetalTypeCodeEnum.J.name()))
				{
					coItem.setGoldWtCharges(mp.getMetalValue());
					coItem.setGoldRate(mp.getRatePerUnit());
				}
					
			}
			
			coItem.setWastagePercentage(price.getPriceDetails().getMakingChargeDetails().getWastagePct());
			coItem.setTotalStoneCharges(price.getPriceDetails().getStonePriceDetails().getPreDiscountValue());
			coItem.setMakingCharges(price.getPriceDetails().getMakingChargeDetails().getPreDiscountValue());
			coItem.setWastageCharges(BigDecimal.ZERO);
			
			/*** Tax Calculation ***/
			
			long startTaxTime=System.nanoTime();
			log.info("Start time of Tax Calculation...................{}",startTaxTime);
			taxDto= engineServiceClient.getTaxDetails(null,null,coItem.getLocationCode(), taxType.toString(), itemCode,false,null);
			log.info("End time of Tax Calculation................{}",System.nanoTime() );
			log.info("........total time.................{}",(System.nanoTime()- startTaxTime));

			taxincludedPrice=getTotalTaxDetails(coItem.getItemCode(), price.getFinalValue(), null, taxType, taxDto);
				
			for (Map.Entry<String,TaxDetailDto> entry : taxDto.getData().entrySet())
			{
				if(entry.getKey().equals(CGST)) 
				{
					coItem.setCGST(entry.getValue().getTaxValue());
				}else if(entry.getKey().equals(SGST)) 
				{
					coItem.setSGST(entry.getValue().getTaxValue());
				}else if(entry.getKey().equals(UTGST)) 
				{
					coItem.setUtGST(entry.getValue().getTaxValue());
				}
			}
			coItem.setTotalPrice(taxincludedPrice.getFinalValue());
			coItem.setDiscount(BigDecimal.ZERO);
			coItem.setFinalPrice(coItem.getTotalPrice().add(coItem.getDiscount()));
			nearestLocList.add(coItem);
			
		}	
		log.info("************Nearest 5 locations*****************{}",nearestLocList);
	return nearestLocList;
}
	
	/**
	 * This method will get the total tax value
	 * @param itemCode
	 * @param totalValue
	 * @param totalDiscount
	 * @param taxTxnType
	 * @param taxDetails
	 * @return
	 */
	public TotalTaxAndTaxDetailsDto getTotalTaxDetails( String itemCode, BigDecimal totalValue,
			BigDecimal totalDiscount, TxnTaxTypeEnum taxTxnType, TaxCalculationResponseDto taxDetails) 
	{

		// NOTE: tax to be calculated on (totalValue - totalDiscount)
		BigDecimal amountToCalculateTax = (totalValue
				.subtract((totalDiscount == null ? BigDecimal.ZERO : totalDiscount)));

		BigDecimal totalTax = BigDecimal.ZERO;
		if (!taxDetails.getData().isEmpty()) {

			for (Entry<String, TaxDetailDto> taxDetailsDto : taxDetails.getData().entrySet()) {

				BigDecimal calculateTaxOn = amountToCalculateTax;
				taxDetailsDto.getValue()
						.setTaxValue((calculateTaxOn.multiply(
								(taxDetailsDto.getValue().getTaxPercentage()==null?BigDecimal.ZERO:taxDetailsDto.getValue().getTaxPercentage().divide(BigDecimal.valueOf(100)))))
										.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));

				totalTax = totalTax.add(taxDetailsDto.getValue().getTaxValue());
			}
		}

		BigDecimal totalCess = BigDecimal.ZERO;
		if (!taxDetails.getCess().isEmpty()) {
			for (Entry<String, CessDetailDto> cessDetailsDto : taxDetails.getCess().entrySet()) {
				calculateCessValue(cessDetailsDto.getValue(), totalTax, amountToCalculateTax);
				totalCess = totalCess.add(cessDetailsDto.getValue().getCessValue());
			}
		}

		return new TotalTaxAndTaxDetailsDto(totalTax.add(totalCess), taxDetails,totalValue.add(totalTax.add(totalCess)));
	}
	
	/**
	 * This method will calculate Cess Tax
	 * @param cessDetailsDto
	 * @param totalTax
	 * @param totalValue
	 */
	private void calculateCessValue(CessDetailDto cessDetailsDto, BigDecimal totalTax, BigDecimal totalValue) {
		if (BooleanUtils.isTrue(cessDetailsDto.getCessOnTax())) { // calculate cess on tax
			cessDetailsDto.setCessValue(
					totalTax.multiply((cessDetailsDto.getCessPercentage().divide(BigDecimal.valueOf(100))))
							.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));
		} else { // calculate cess on total value
			cessDetailsDto.setCessValue(
					totalValue.multiply((cessDetailsDto.getCessPercentage().divide(BigDecimal.valueOf(100))))
							.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));
		}
	}
	
	
	
	
	/**
	 * This method is setting attributes for Customer Order Item Details
	 * and returning the coItemDetails object.
	 * @param item
	 * @param location
	 * @param distance
	 * @return cOItemDetails
	 */
	public COInBoundItemDetailsDto setCOItemDetails(InventoryDetailsDao item,Double distance,LocationCoordinateDto locationDetails)
	{
		COInBoundItemDetailsDto cOItemDetails=new COInBoundItemDetailsDto();		
		cOItemDetails.setId(item.getId());
		cOItemDetails.setItemCode(item.getItemCode());
		cOItemDetails.setLocationCode(item.getLocationCode());
		cOItemDetails.setLotNumber(item.getLotNumber());
		cOItemDetails.setTotalWeight(item.getTotalWeight());
		cOItemDetails.setQuantity(item.getTotalQuantity()-item.getIssuedQuantity());
		cOItemDetails.setDistance(distance);
		cOItemDetails.setPincode(locationDetails.getStoreDetailsDao().getPincode());
//		if(locationDetails.getStoreDetailsDao().getContactNumber().isEmpty()||locationDetails.getStoreDetailsDao().getContactNumber().isBlank())
//		{
//			cOItemDetails.setContact(locationDetails.getStoreDetailsDao().getPhoneNumber1());
//		} else 
//		{
//			cOItemDetails.setContact(locationDetails.getStoreDetailsDao().getContactNumber());
//		}
		cOItemDetails.setContact(locationDetails.getStoreDetailsDao().getContactNumber());
		cOItemDetails.setState(locationDetails.getStateName());
		cOItemDetails.setTown(locationDetails.getTownName());
		cOItemDetails.setBTQName(locationDetails.getDescription());
		cOItemDetails.setAge(CalendarUtils.getDayDiff(item.getMfgDate(),CalendarUtils.getCurrentDate()));
		
		return cOItemDetails;
	}
	

	/**
	 * This method is calculating distance between source location and Destination Location
	 * @param curBtqLatitude
	 * @param curBtqLongitude
	 * @param destBtqLatitude
	 * @param destBtqLongitude
	 * @return distance
	 */
	public Double calculateDistance(BigDecimal curBtqLatitude, BigDecimal curBtqLongitude,BigDecimal destBtqLatitude, BigDecimal destBtqLongitude)
	{
		Double distance;
		
		//condition to check if inventory available in same source location
		if ((curBtqLatitude == destBtqLatitude) && (curBtqLongitude == destBtqLongitude)) 
		{
			return Double.valueOf(0);
		}
		else 
		{
			distance =Math.toDegrees(Math.acos(Math.sin(Math.toRadians(curBtqLatitude.doubleValue())) 
					* Math.sin(Math.toRadians(destBtqLatitude.doubleValue())) 
					+ Math.cos(Math.toRadians(curBtqLatitude.doubleValue())) * Math.cos(Math.toRadians(destBtqLatitude.doubleValue())) 
					* Math.cos(Math.toRadians(curBtqLongitude.doubleValue()-destBtqLongitude.doubleValue()))));
			distance= (double) Math.round((distance * 60 * 1.1515* 1.609344)*100/100);
		}		
		return distance;	
	}
	
}
