/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.core.dto.GepPriceResponseDto;
import com.titan.poss.core.dto.MetalPriceDto;
import com.titan.poss.core.dto.TepPriceResponseDto;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.TepTransactionDto;
import com.titan.poss.sales.dto.MetalRateListDto;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Component
public class TepTransactionDetRowMapper implements RowMapper<TepTransactionDto> {

	@Override
	public TepTransactionDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		TepTransactionDto tepTransaction = new TepTransactionDto();
		String txnType = rs.getString("txn_type");
		tepTransaction.setRecType("PROD");
		tepTransaction.setLineNum(rs.getInt("row_id"));
		String itemCode = rs.getString("item_code");
		tepTransaction.setItem(itemCode);
		if(txnType.equalsIgnoreCase("TEP") && !(itemCode.startsWith("1") || itemCode.startsWith("2")))
		{
			tepTransaction.setQty((new BigDecimal(rs.getString("qty")).setScale(0, RoundingMode.HALF_UP).toString()));
	        BigDecimal unitPrice =  rs.getBigDecimal("final_value").divide(BigDecimal.valueOf(rs.getInt("quantity")), 0,RoundingMode.HALF_UP);
	        tepTransaction.setUnitPrice(unitPrice);
		}
		else
		{
		tepTransaction.setQty(rs.getString("qty"));
		
		BigDecimal gepUnitPrice = rs.getBigDecimal("final_value").divide(new BigDecimal(rs.getString("qty")),0,RoundingMode.HALF_UP);
		tepTransaction.setUnitPrice(gepUnitPrice);
		}
		tepTransaction.setItemAttribute("Exchange");
		tepTransaction.setItemAttribute1(rs.getString("lot_number"));
		tepTransaction.setItemAttribute2(rs.getString("item_attribute2"));
		tepTransaction.setItemAttribute3("1");
		String metalType = rs.getString("metal_type");
		String metalRateTep = rs.getString("metal_rate_details");
		
		String priceDetails = rs.getString("price_details");
		if (!StringUtils.isEmpty(priceDetails)) {
			if (txnType.equalsIgnoreCase("TEP")) {
				tepTransaction.setSecQty(rs.getString("sec_qty"));
				TepPriceResponseDto tepPriceDetails = MapperUtil.getObjectMapperInstance()
						.convertValue(MapperUtil.getJsonFromString(priceDetails), TepPriceResponseDto.class);
				tepTransaction.setItemAttribute6(getTepStoneValue(tepPriceDetails, itemCode).setScale(0,RoundingMode.DOWN));
				tepTransaction
						.setItemAttribute5(getTepGoldValue(tepPriceDetails, rs.getBigDecimal("total_value"), itemCode));
				if(!StringUtils.isEmpty(metalRateTep))
				{
					MetalRateListDto metalRateDetails = MapperUtil.getObjectMapperInstance()
							.convertValue(MapperUtil.getJsonFromString(metalRateTep), MetalRateListDto.class);
					tepTransaction.setItemAttribute4(getTepMetalPrice(metalRateDetails, metalType).setScale(0,RoundingMode.DOWN));
					tepTransaction.setItemAttribute10(getTepMetalPrice(metalRateDetails, metalType).setScale(0,RoundingMode.DOWN));
				}
				if(tepPriceDetails.getRefundDeductionPercent() == null || rs.getString("payment_type").equalsIgnoreCase("CN"))
					tepTransaction.setItemAttribute11(BigDecimal.ZERO);
				else
				tepTransaction.setItemAttribute11(tepPriceDetails.getRefundDeductionPercent().setScale(3, RoundingMode.DOWN));
				if (tepPriceDetails.getStonePriceDetails() != null
						&& tepPriceDetails.getStonePriceDetails().getStoneWeight() != null) {
					tepTransaction.setItemAttribute12(tepPriceDetails.getStonePriceDetails().getStoneWeight());
				} else {
					tepTransaction.setItemAttribute12(BigDecimal.ZERO.setScale(0,RoundingMode.DOWN));
				}
				if(tepPriceDetails.getCmUnavailableDeductionPercent()!=null  && !tepPriceDetails.getIscashMemoAvailable() )
				tepTransaction.setItemAttribute13(tepPriceDetails.getCmUnavailableDeductionPercent().setScale(0, RoundingMode.DOWN));
				else
					tepTransaction.setItemAttribute13(BigDecimal.ZERO);
			} else {
				tepTransaction.setSecQty("");
				GepPriceResponseDto tepPriceDetails = MapperUtil.getObjectMapperInstance()
						.convertValue(MapperUtil.getJsonFromString(priceDetails), GepPriceResponseDto.class);
				if(!StringUtils.isEmpty(metalRateTep))
				{
					MetalRateListDto metalRateDetails = MapperUtil.getObjectMapperInstance()
							.convertValue(MapperUtil.getJsonFromString(metalRateTep), MetalRateListDto.class);
					tepTransaction.setItemAttribute4(getTepMetalPrice(metalRateDetails, metalType).setScale(0,RoundingMode.DOWN));
					tepTransaction.setItemAttribute10(getTepMetalPrice(metalRateDetails, metalType).setScale(0,RoundingMode.DOWN));
				}
				tepTransaction.setItemAttribute6(BigDecimal.ZERO);
				tepTransaction.setItemAttribute5(rs.getBigDecimal("final_value").setScale(0, RoundingMode.HALF_UP));
				tepTransaction.setItemAttribute11(BigDecimal.ZERO);
				tepTransaction.setItemAttribute12(BigDecimal.ZERO);
				tepTransaction.setItemAttribute13(BigDecimal.ZERO);
			}
		}

		tepTransaction.setItemAttribute7(rs.getBigDecimal("final_value").setScale(0, RoundingMode.HALF_UP));
		tepTransaction.setItemAttribute8(rs.getString("item_attribute8"));
		tepTransaction.setItemAttribute9(rs.getBigDecimal("item_attribute9"));

		String locationCode = rs.getString("location_code");
		tepTransaction.setBtqId(locationCode);
		tepTransaction.setBusinessDate(CalendarUtils.formatDateToString(rs.getDate("doc_date"), "dd-MM-yy"));
		tepTransaction.setIgstPercentage(rs.getBigDecimal("igst_percentage")!=null?rs.getBigDecimal("igst_percentage").setScale(1,RoundingMode.DOWN):BigDecimal.ZERO);
		tepTransaction.setIgstValue(rs.getBigDecimal("igst_value")!=null?rs.getBigDecimal("igst_value"):BigDecimal.ZERO);
		tepTransaction.setSgstPercentage(rs.getBigDecimal("sgst_percentage")!=null?rs.getBigDecimal("sgst_percentage").setScale(1,RoundingMode.DOWN):BigDecimal.ZERO);
		tepTransaction.setSgstValue(rs.getBigDecimal("sgst_value")!=null?rs.getBigDecimal("sgst_value"):BigDecimal.ZERO);
		tepTransaction.setCgstPercentage(rs.getBigDecimal("cgst_percentage")!=null?rs.getBigDecimal("cgst_percentage").setScale(1,RoundingMode.DOWN):BigDecimal.ZERO);
		tepTransaction.setCgstValue(rs.getBigDecimal("cgst_value")!=null?rs.getBigDecimal("cgst_value"):BigDecimal.ZERO);
		tepTransaction.setUtgstPercentage(rs.getBigDecimal("utgst_percentage")!=null?rs.getBigDecimal("utgst_percentage").setScale(1,RoundingMode.DOWN):BigDecimal.ZERO);
		tepTransaction.setUtgstValue(rs.getBigDecimal("utgst_value")!=null?rs.getBigDecimal("utgst_value"):BigDecimal.ZERO);
		tepTransaction.setGoodsExchangeId(rs.getString("id"));
		tepTransaction.setDocDate(rs.getDate("doc_date"));

		return tepTransaction;
	}

	private BigDecimal getTepItemAttribute4(TepPriceResponseDto tepPriceDetails) {
		BigDecimal silverRate = BigDecimal.ZERO;
		BigDecimal platinumRate = BigDecimal.ZERO;
		BigDecimal goldRate = BigDecimal.ZERO;
		if (tepPriceDetails.getMetalPriceDetails() != null
				&& !CollectionUtil.isEmpty(tepPriceDetails.getMetalPriceDetails().getMetalPrices())) {
			List<MetalPriceDto> metalPrices = tepPriceDetails.getMetalPriceDetails().getMetalPrices();

			for (MetalPriceDto metalPrice : metalPrices) {
				if (metalPrice.getType()!=null && metalPrice.getType().equalsIgnoreCase("SILVER")  && metalPrice.getRatePerUnit()!=null) {
					silverRate = metalPrice.getRatePerUnit();
				} else if (metalPrice.getType()!=null && metalPrice.getType().equalsIgnoreCase("PLATINUM") && metalPrice.getRatePerUnit()!=null ) {
					platinumRate =metalPrice.getRatePerUnit();
				} else if( metalPrice.getRatePerUnit()!=null){
					goldRate =metalPrice.getRatePerUnit();
				}
				else if(metalPrice.getRatePerUnit()==null) {
										goldRate =BigDecimal.ZERO;
									}
			}
		}
		if (silverRate != BigDecimal.ZERO) {
			return silverRate;
		} else if (platinumRate != BigDecimal.ZERO) {
			return platinumRate;
		} else {
			return goldRate;
		}
	}

	
	private BigDecimal getTepMetalPrice(MetalRateListDto metalRateListDto, String metalType) {
		BigDecimal silverRate = BigDecimal.ZERO;
		BigDecimal platinumRate = BigDecimal.ZERO;
		BigDecimal goldRate = BigDecimal.ZERO;
		if(metalRateListDto.getMetalRates()!=null)
		{
			if(metalRateListDto.getMetalRates().get(MetalTypeCodeEnum.P.getCode())!=null && metalType.equalsIgnoreCase("P"))
				silverRate = metalRateListDto.getMetalRates().get(MetalTypeCodeEnum.P.getCode()).getRatePerUnit();
			else if(metalRateListDto.getMetalRates().get(MetalTypeCodeEnum.L.getCode())!=null && metalType.equalsIgnoreCase("L"))
				platinumRate = metalRateListDto.getMetalRates().get(MetalTypeCodeEnum.L.getCode()).getRatePerUnit();
			else
				goldRate = metalRateListDto.getMetalRates().get(MetalTypeCodeEnum.J.getCode()).getRatePerUnit();
		}
		
		if (silverRate != BigDecimal.ZERO) {
			return silverRate;
		} else if (platinumRate != BigDecimal.ZERO) {
			return platinumRate;
		} else {
			return goldRate;
		}
	}
	
	private BigDecimal getTepStoneValue(TepPriceResponseDto tepPriceDetails, String itemCode) {
		if (!StringUtils.isEmpty(itemCode) && itemCode.startsWith("1")) {
			return BigDecimal.ZERO;
		} else if (!StringUtils.isEmpty(tepPriceDetails.getProductGroupCode())
				&& (tepPriceDetails.getProductGroupCode().equalsIgnoreCase("76")
						|| tepPriceDetails.getProductGroupCode().equalsIgnoreCase("83"))) {
			return BigDecimal.ZERO;
		} else if (tepPriceDetails.getStonePriceDetails().getPreDiscountValue() != null ) {
			return tepPriceDetails.getStonePriceDetails().getPreDiscountValue();
		} else {
			return BigDecimal.ZERO;
		}
	}

	private BigDecimal getTepGoldValue(TepPriceResponseDto tepPriceDetails, BigDecimal totalValue, String itemCode) {
		if (itemCode.startsWith("1") || (!StringUtils.isEmpty(tepPriceDetails.getProductGroupCode())
				&& tepPriceDetails.getProductGroupCode().equalsIgnoreCase("76"))) {
			return totalValue;
		} else if (!StringUtils.isEmpty(tepPriceDetails.getProductGroupCode())
				&& tepPriceDetails.getProductGroupCode().equalsIgnoreCase("83")) {
			return BigDecimal.ZERO;
		} else {
			Short itemQuantity = tepPriceDetails.getItemQuantity() == null ? 1 : tepPriceDetails.getItemQuantity();
			return getGoldValue(tepPriceDetails).multiply(BigDecimal.valueOf(itemQuantity)).setScale(0,
					RoundingMode.HALF_UP);
		}
	}

	private BigDecimal getGoldValue(TepPriceResponseDto tepPriceDetails) {
		BigDecimal goldValue = BigDecimal.ZERO;
		if (tepPriceDetails.getMetalPriceDetails() != null) {
			List<MetalPriceDto> metalPrices = tepPriceDetails.getMetalPriceDetails().getMetalPrices();
			if (!CollectionUtil.isEmpty(metalPrices)) {
				for (MetalPriceDto metalPrice : metalPrices) {
					if (metalPrice.getType()!=null && metalPrice.getType().equalsIgnoreCase("GOLD") && metalPrice.getMetalValue() != null) {
						log.info("goldValue: {}",metalPrice.getMetalValue());
						goldValue = metalPrice.getMetalValue();
						break;
					}
				}
			}
		}
		return goldValue;
	}

	private BigDecimal getGepItemAttribute4(GepPriceResponseDto gepPriceDetails) {
		return gepPriceDetails.getRatePerUnit();
	}
}
