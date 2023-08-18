/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.dto.MetalPriceDto;
import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.BoutiqueSalesDto;
import com.titan.poss.sales.dto.MetalRateListDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class BoutiqueSalesRowMapper implements RowMapper<BoutiqueSalesDto> {

	private static final String UNIT_VALUE = "unit_value";

	private static final String TXN_TYPE = "txn_type";

	@Override
	public BoutiqueSalesDto mapRow(ResultSet rs, int rowNum) throws SQLException {

		BoutiqueSalesDto boutiqueSalesDto = new BoutiqueSalesDto();

		boutiqueSalesDto.setHdrCustomerNo(rs.getString("sap_code"));
		String locationCode = rs.getString("location_code");
		String txnType = rs.getString(TXN_TYPE).equalsIgnoreCase("CMCAN") ? "BC" : rs.getString(TXN_TYPE);
		boutiqueSalesDto.setHdrCustomerName(locationCode);
		boutiqueSalesDto.setHdrOrderSource("Eposs");
		Date docDate = rs.getDate("doc_date");
		String HdrSysDocRef = locationCode + txnType
				+ CalendarUtils.formatDateToString(docDate, FileIntegrationConstants.DD_MMM_YY_DATE_FORMAT);
		boutiqueSalesDto.setHdrSysDocumentRef(HdrSysDocRef.toUpperCase());
		boutiqueSalesDto.setHdrOrderType("BTQ ORDER");
		boutiqueSalesDto.setHdrShipOrg("B" + locationCode);
		boutiqueSalesDto.setHdrPriceList("TANISHQ GENERAL");
		boutiqueSalesDto.setHdrSalesRep(locationCode);
		boutiqueSalesDto.setHdrItemAttribute1("Specifications");
		boutiqueSalesDto.setHdrItemAttribute2("Remarks");
		boutiqueSalesDto.setHdrItemAttribute3("Misc");
		// doubt
		boutiqueSalesDto.setHdrItemAttribute4(0);
		boutiqueSalesDto.setHdrItemAttribute5(locationCode);
		boutiqueSalesDto.setHdrItemAttribute6(docDate.toString());
		// doubt
		boutiqueSalesDto.setHdrItemAttribute7("");
		String DetSysDocRef = locationCode + txnType
				+ CalendarUtils.formatDateToString(docDate, FileIntegrationConstants.DD_MMM_YY_DATE_FORMAT);
		boutiqueSalesDto.setDetSysDocumetRef(DetSysDocRef.toUpperCase());
		boutiqueSalesDto.setDetDocNo(rs.getInt("doc_no"));
		// doubt
		boutiqueSalesDto.setDetSysLineRef(rs.getInt("ref_line_no"));
		// doubt
		boutiqueSalesDto.setDetShipmentRef(0);
		String itemCode = rs.getString("item_code");
		boutiqueSalesDto.setDetInventoryItemRef(itemCode);
		boutiqueSalesDto.setDetCustLineNo(rs.getString("lotNumber"));

		boutiqueSalesDto.setDetScheduleDate(docDate.toString());
		boutiqueSalesDto.setDetPriceList("TANISHQ GENERAL");
		boutiqueSalesDto.setDetShipFromOrg("B" + locationCode);
		boutiqueSalesDto.setDetCalculatePrice("N");
		String metalRateDetails = rs.getString("metal_rate_details");
		boutiqueSalesDto.setDetItemAttribute1(getMetalRate(metalRateDetails, "J"));
		String priceDetails = rs.getString("price_details");
		
		BigDecimal totalQty = rs.getBigDecimal("total_quantity") ;
		BigDecimal originalQuantity = rs.getBigDecimal("original_qty");
		boutiqueSalesDto.setDetOriginalQty(originalQuantity);
		boutiqueSalesDto.setDetTxnType(rs.getString(TXN_TYPE));
		boutiqueSalesDto.setDetTotalQty(totalQty);
		
		BigDecimal totalWeight = rs.getBigDecimal("total_weight");
		BigDecimal totalDiscount = rs.getBigDecimal("total_discount");
		BigDecimal encircleDiscount = rs.getBigDecimal("encircle_discount");
		BigDecimal encircleDiscount2 = rs.getBigDecimal("encircle_discount2");
		BigDecimal encircleDiscount3 = rs.getBigDecimal("encircle_discount3");
		BigDecimal digiGoldDiscount = rs.getBigDecimal("digi_gold_discount");
		BigDecimal ghsDiscount = rs.getBigDecimal("ghs_discount");
		
		if(rs.getString("is_coin").equalsIgnoreCase("YES") &&  !rs.getString(TXN_TYPE).equalsIgnoreCase("GRN"))
		{
			BigDecimal metalValue = (getMetalValue(priceDetails, "J").divide(originalQuantity ,3, RoundingMode.HALF_UP)).multiply(totalQty);
			boutiqueSalesDto.setDetItemAttribute2(metalValue.setScale(4, RoundingMode.HALF_UP).toString());
			BigDecimal makingCharge =  (rs.getBigDecimal("making_charge").divide(originalQuantity ,3, RoundingMode.HALF_UP)).multiply(totalQty);
			boutiqueSalesDto.setDetItemAttribute3(makingCharge.setScale(4, RoundingMode.HALF_UP).toString());
			totalWeight = (totalWeight.divide(originalQuantity ,3, RoundingMode.HALF_UP)).multiply(totalQty);
			totalDiscount = totalDiscount != null ? (totalDiscount.divide(originalQuantity ,3, RoundingMode.HALF_UP)).multiply(totalQty): null;
			encircleDiscount = encircleDiscount != null ? (encircleDiscount.divide(originalQuantity ,3, RoundingMode.HALF_UP)).multiply(totalQty): null;
			encircleDiscount2 = encircleDiscount2 != null ? (encircleDiscount2.divide(originalQuantity ,3, RoundingMode.HALF_UP)).multiply(totalQty) : null;
			encircleDiscount3 = encircleDiscount3 != null ? (encircleDiscount3.divide(originalQuantity ,3, RoundingMode.HALF_UP)).multiply(totalQty) : null;
			digiGoldDiscount = digiGoldDiscount != null ?(digiGoldDiscount.divide(originalQuantity ,3, RoundingMode.HALF_UP)).multiply(totalQty) : null;
			ghsDiscount = ghsDiscount != null ?(ghsDiscount.divide(originalQuantity ,3, RoundingMode.HALF_UP)).multiply(totalQty) : null;
			
		}
		else
		{
		boutiqueSalesDto.setDetItemAttribute2(getMetalValue(priceDetails, "J").setScale(4, RoundingMode.HALF_UP).toString());
		boutiqueSalesDto.setDetItemAttribute3(rs.getBigDecimal("making_charge").setScale(4, RoundingMode.HALF_UP).toString());
		}
		boutiqueSalesDto.setDetItemAttribute4(rs.getBigDecimal("stone_value").setScale(4, RoundingMode.HALF_UP).toString());
		boutiqueSalesDto.setDetItemAttribute5("Misc");
		boutiqueSalesDto.setDetItemAttribute6("Misc");
		boutiqueSalesDto.setDetItemAttribute7("");
		boutiqueSalesDto.setDetItemAttribute8("");
		boutiqueSalesDto.setDetItemAttribute9(txnType + checkDocNo(rs.getString("doc_no")));
		boutiqueSalesDto.setDetIsCoin(rs.getString("is_coin"));
		boutiqueSalesDto.setDetIsLegacyCm(rs.getBoolean("is_migrated"));
		
		
		if(getMetalValue(priceDetails, "L").compareTo(BigDecimal.ZERO)!=0)
		{
			boutiqueSalesDto.setDetItemAttribute10(getMetalValue(priceDetails, "L"));
			boutiqueSalesDto.setDetItemAttribute11(getMetalRate(metalRateDetails, "L"));
		}
		else
		{
			boutiqueSalesDto.setDetItemAttribute10(null);
			boutiqueSalesDto.setDetItemAttribute11(null);
		}
		// doubt
		boutiqueSalesDto.setDetItemAttribute12(0);
		boutiqueSalesDto.setDetItemAttribute13(locationCode);
		boutiqueSalesDto.setDetItemAttribute14(docDate.toString());
		// doubt
		boutiqueSalesDto.setDetItemAttribute15("");
		String TaxSysDocRef = locationCode + txnType
				+ CalendarUtils.formatDateToString(docDate, FileIntegrationConstants.DD_MMM_YY_DATE_FORMAT);
		boutiqueSalesDto.setTaxSysDocumentRef(TaxSysDocRef.toUpperCase());
		// doubt
		boutiqueSalesDto.setTaxLineNo(0);
		// tax amount is extracted in the staging writer
		boutiqueSalesDto.setTaxName(rs.getString("tax_details"));
		// Total Discount // @TotalDiscount = @Discount  - @GHSDiscount - @AnuttaraDiscount - @DigiGoldDiscount (anuttara Disc = encircle Disc)
		boutiqueSalesDto.setTaxDiscountDetails(totalDiscount);
		//ghs discount
		if(ghsDiscount!=null)
			boutiqueSalesDto.setTaxGhsDiscount(ghsDiscount);
		else
			boutiqueSalesDto.setTaxGhsDiscount(BigDecimal.ZERO);
		
		//encircle Discount
		BigDecimal encircleDisc=BigDecimal.ZERO;
		if(encircleDiscount!=null)
		encircleDisc =encircleDisc.add(encircleDiscount);
		
		if(encircleDiscount2!=null)
			encircleDisc =encircleDisc.add(encircleDiscount2);
		
		if(encircleDiscount3!=null)
			encircleDisc =encircleDisc.add(encircleDiscount3);
		boutiqueSalesDto.setTaxEncircleDiscount(encircleDisc);

		//Digi Gold Discount
		if(digiGoldDiscount!=null)
			boutiqueSalesDto.setTaxDigiGoldDiscount(digiGoldDiscount);
		else
			boutiqueSalesDto.setTaxDigiGoldDiscount(BigDecimal.ZERO);
		
		boutiqueSalesDto.setTaxInventoryItem(itemCode);
		boutiqueSalesDto.setTaxLotNumber(rs.getString("lotNumber"));
		boutiqueSalesDto.setTaxOtherCharges(rs.getBigDecimal("other_charges"));
		// doubt
		boutiqueSalesDto.setLineNo(rs.getInt("ref_line_no"));
		//boutiqueSalesDto.setLineNo(0);
		// doubt
		boutiqueSalesDto.setTaxRecordId(0);
		boutiqueSalesDto.setTaxLocationId(locationCode);
		boutiqueSalesDto.setTaxBusinessDate(docDate.toString());
		// file name is set in the writer
		boutiqueSalesDto.setTaxFileName("");
		
		if (rs.getString(TXN_TYPE).equalsIgnoreCase("CM")) {
			boutiqueSalesDto.setDetOrdQty1(totalQty.setScale(3, RoundingMode.HALF_UP).toString());
			boutiqueSalesDto.setDetOrdQty2(totalWeight.setScale(3, RoundingMode.HALF_UP).toString());
			boutiqueSalesDto.setDetUnitSellingPrice(rs.getBigDecimal(UNIT_VALUE).setScale(4, RoundingMode.HALF_UP).toString());
			boutiqueSalesDto.setDetUnitListPrice(rs.getBigDecimal(UNIT_VALUE).setScale(4, RoundingMode.HALF_UP).toString());
		} else {
			boutiqueSalesDto.setDetOrdQty1((new BigDecimal(-1).multiply(totalQty.setScale(3, RoundingMode.HALF_UP))).toString());
			boutiqueSalesDto.setDetOrdQty2((totalWeight.negate().setScale(3, RoundingMode.HALF_UP)).toString());
			boutiqueSalesDto.setDetUnitSellingPrice((rs.getBigDecimal(UNIT_VALUE).negate().setScale(4, RoundingMode.HALF_UP)).toString());
			boutiqueSalesDto.setDetUnitListPrice((rs.getBigDecimal(UNIT_VALUE).negate().setScale(4, RoundingMode.HALF_UP)).toString());
		}

		return boutiqueSalesDto;
	}

	/**
	 * @param jsonString
	 * @return
	 */
	private BigDecimal getMetalRate(String jsonString, String key) {

		MetalRateListDto metalRateList = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(jsonString), MetalRateListDto.class);

		StandardPriceResponseDto standardPriceResponseDto = metalRateList.getMetalRates().get(key);
		if (standardPriceResponseDto != null && standardPriceResponseDto.getRatePerUnit()!= null ) {
			return standardPriceResponseDto.getRatePerUnit();
		}

		return new BigDecimal(0);
	}

	/**
	 * @param jsonString
	 * @return
	 */
	private BigDecimal getMetalValue(String jsonString, String key) {
		PriceDetailsDto priceDetail = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(jsonString), PriceDetailsDto.class);
		if (priceDetail != null && priceDetail.getMetalPriceDetails() != null) {
			List<MetalPriceDto> metalPrices = priceDetail.getMetalPriceDetails().getMetalPrices();
			for (MetalPriceDto metalPrice : metalPrices) {
				if (metalPrice.getMetalTypeCode() != null && metalPrice.getMetalTypeCode().equalsIgnoreCase(key)) {
					return metalPrice.getMetalValue();
				}
			}
		}
		return new BigDecimal(0);
	}

	/**
	 * doc no length should be 5 other wise appending 0 in the beginning.
	 *
	 * @param docNo the doc no
	 * @return the string
	 */
	private String checkDocNo(String docNo) {
		return StringUtils.leftPad(docNo, 5, "0");
	}
}
