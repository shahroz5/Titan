/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import org.apache.commons.lang3.StringUtils;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.dto.NcCustomerTransactionStageDto;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Component
public class NcCustomerTransactionRowMapper implements RowMapper<NcCustomerTransactionStageDto> {

	private static final String CHANNEL = "Tanishq";

	@Override
	public NcCustomerTransactionStageDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		
		log.info("InSide NcCustomerTransactionRowMapper..............................................................................");
		String txnType = rs.getString("txn_type");
		NcCustomerTransactionStageDto ncCustomerTransactionStageDto = new NcCustomerTransactionStageDto();
		ncCustomerTransactionStageDto.setChannel(CHANNEL);
		ncCustomerTransactionStageDto.setStoreCode(rs.getString("location_code"));
		ncCustomerTransactionStageDto.setUnifiedLoyaltyNo(rs.getString("ulp_id"));
		String txnTimeString = rs.getString("transaction_time");
		log.info("Transaction date is .....(txnTimeString)..........................{}",txnTimeString);
//		Date txnTime = CalendarUtils.convertStringToDate(txnTimeString, "yyyy-MM-dd HH:mm");
//		ncCustomerTransactionStageDto.setTransactionDate(CalendarUtils.formatDateToString(txnTime, "dd-MMM-yyyy HH:mm"));
		String docDateString = rs.getString("transac_doc_date");
		log.info("Transaction date is .....(docDateString)..........................{}",docDateString);
		Date txnTime = CalendarUtils.convertStringToDate(docDateString, "yyyy-MM-dd");
		ncCustomerTransactionStageDto.setTransactionDate(CalendarUtils.formatDateToString(txnTime, "dd-MMM-yyyy"));
		ncCustomerTransactionStageDto.setGvCode("0");
		ncCustomerTransactionStageDto.setInvoiceNumber(rs.getString("doc_no"));
		ncCustomerTransactionStageDto.setLineItemNo(rs.getString("row_id"));
		ncCustomerTransactionStageDto.setItemCode(rs.getString("item_code"));
		ncCustomerTransactionStageDto.setCategoryCode(rs.getString("product_group_code"));
		ncCustomerTransactionStageDto.setQuantity(rs.getInt("total_quantity"));
		ncCustomerTransactionStageDto.setGrossAmount(rs.getBigDecimal("gross_amount").setScale(2, RoundingMode.HALF_UP));
		ncCustomerTransactionStageDto.setDiscount(rs.getBigDecimal("total_discount").setScale(2, RoundingMode.HALF_UP));
		ncCustomerTransactionStageDto
				.setEligibleAmount(getEligibleAmount(ncCustomerTransactionStageDto.getCategoryCode(),
						rs.getBigDecimal("gross_amount"), rs.getBigDecimal("tep_line_amount_value"),
						rs.getBigDecimal("ghs_discount"), rs.getBigDecimal("encircle_points")));
		ncCustomerTransactionStageDto.setRrNumber(rs.getString("rr_number"));
		ncCustomerTransactionStageDto.setTransactionType(txnType);

		ncCustomerTransactionStageDto.setReference("");
		String accuralEncirclePoints = rs.getString("accural_encircle_points");
		String isAccrualFOC = rs.getString("is_accrual_ulp");
		log.info("Is accrual ULP from FOC...........................{}",isAccrualFOC);
		log.info("Is accrual ULP from Discount...........................{}",accuralEncirclePoints);
		String discountCode = "";
//		if (rs.getBoolean("is_foc_item")) {
//			discountCode = "FOC";
//		} else if (StringUtils.isEmpty(accuralEncirclePoints) || accuralEncirclePoints.equalsIgnoreCase("true")) {
//			discountCode = "Y";
//		} else {
//			discountCode = "N";
//		}

		log.info("is foc item.............? is _foc_item..............{}",rs.getBoolean("is_foc_item"));
		
		if(rs.getBoolean("is_foc_item"))
		{
			log.info("Item is an FOC item..............................");
			discountCode = "FOC";
		}else if(!rs.getBoolean("is_foc_item"))
		{
			try
			{
				if((StringUtils.isEmpty(accuralEncirclePoints)||Objects.isNull(accuralEncirclePoints))&&(StringUtils.isEmpty(isAccrualFOC)||Objects.isNull(isAccrualFOC)))
				{
					log.info("Accrual encircle points from both FOC & discount is null........");
					discountCode = "Y";
				}
				else if(StringUtils.isEmpty(accuralEncirclePoints)||Objects.isNull(accuralEncirclePoints)) {
					log.info("Accrual encircle points from discount is null........");
					if(StringUtils.isEmpty(isAccrualFOC)||Objects.isNull(isAccrualFOC)) {
						log.info("Accrual encircle points from FOC is null........");
						discountCode = "Y";
					}
					else if(isAccrualFOC.equalsIgnoreCase("1")||isAccrualFOC.equalsIgnoreCase("true"))
					{
						log.info("Accrual encircle points from FOC is true........");
						discountCode = "Y";
						
					}else if(isAccrualFOC.equalsIgnoreCase("0")||isAccrualFOC.equalsIgnoreCase("false"))
					{
						log.info("Accrual encircle points from FOC is false........");
						discountCode = "N";
					}
				}else if (accuralEncirclePoints.equalsIgnoreCase("1")||accuralEncirclePoints.equalsIgnoreCase("true")) {
					log.info("Accrual encircle points from discount is true........");
					discountCode = "Y";
				} else if(accuralEncirclePoints.equalsIgnoreCase("0")||accuralEncirclePoints.equalsIgnoreCase("false")){
					log.info("Accrual encircle points from discount is false........");
					discountCode = "N";
				} 
			}catch (Exception e) {
				//log.info("Error while setting discount code ...........{}",e.getStackTrace());
				
			}
		}
		
		ncCustomerTransactionStageDto.setDiscountCode(discountCode);
		String confirmedTimeString = rs.getString("cm_date");
		if (!StringUtils.isEmpty(confirmedTimeString)) {
			Date confirmedTime = CalendarUtils.convertStringToDate(confirmedTimeString, "yyyy-MM-dd HH:mm");
			ncCustomerTransactionStageDto
					.setCmDate(CalendarUtils.formatDateToString(confirmedTime, "dd-MMM-yyyy HH:mm"));
		} else {
			ncCustomerTransactionStageDto.setCmDate("");
		}
		ncCustomerTransactionStageDto.setCmNo(rs.getString("cm_doc_no"));
		ncCustomerTransactionStageDto.setBrandName(rs.getString("brand_name"));
		ncCustomerTransactionStageDto.setCmLocationCode(rs.getString("cm_location_code"));
		ncCustomerTransactionStageDto.setCmLineItemNo(rs.getString("cm_row_id"));

		log.info("Returning..............ncCustomerTransactionStageDto object from NcCustomerTransactionRowMapper..............{}",ncCustomerTransactionStageDto);
		return ncCustomerTransactionStageDto;
	}

	/**
	 * @return
	 */
	private BigDecimal getEligibleAmount(String categoryCode, BigDecimal lineAmountValue, BigDecimal tepLineItemAmount,
			BigDecimal ghsDiscount, BigDecimal encirclePoints) {

		List<String> zeroEligibleAmountCategoryList = Arrays.asList("71", "81", "82", "99", "A2", "GV");
		if (zeroEligibleAmountCategoryList.contains(categoryCode)) {
			return new BigDecimal("0");
		} else {
			BigDecimal eligibleAmount = null;
			eligibleAmount = lineAmountValue.subtract(tepLineItemAmount).add(ghsDiscount).subtract(encirclePoints);
			if (eligibleAmount.compareTo(new BigDecimal("0")) <= 0) {
				return new BigDecimal("0");
			} else {
				return eligibleAmount.setScale(2, RoundingMode.HALF_UP);
			}
		}
	}

}
