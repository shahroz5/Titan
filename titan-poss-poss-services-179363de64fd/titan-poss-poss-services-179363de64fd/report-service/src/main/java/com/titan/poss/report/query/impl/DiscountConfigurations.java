package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.DiscountConfigurationsCustomRequestDto;
import com.titan.poss.report.dto.request.json.DiscountConfigurationsRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("DiscountConfigurations")
public class DiscountConfigurations extends IReport {

	
	@Autowired
	ReportFactory reportFactory;
	public DiscountConfigurations(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("DISCOUNT_CONFIGURATIONS", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
		DiscountConfigurationsRequestDto discountConfigurationsRequestDto=(DiscountConfigurationsRequestDto) setCustomInput(reportRequestDto);
		// @formatter:off
		StringBuilder appendWhereClause = appendQuery(discountConfigurationsRequestDto);
		

		String select="select dm.sub_brand_code as [Sub Brand Code],\r\n"
				+ "dlm.location_code as [Location Code],\r\n"
				+ "dlm.is_active as [Is Location Active?],\r\n"
				+ "dm.discount_code as [DISCOUNT CODE],\r\n"
				+ "dm.occasion as [Occasion],\r\n"
				+ "dm.discount_type as [Type of Discount],\r\n"
				+ "CASE WHEN dm.is_publish_pending=0 THEN 'PUBLISHED' ELSE 'NOT PUBLISHED' END as [Published/Not Published],\r\n"
				+ "CASE WHEN dm.is_active=1 and dm.is_publish_pending=0 THEN 'Running'\r\n"
				+ "WHEN dm.is_active=1 and dm.is_publish_pending=1 THEN 'Active and Not Running'\r\n"
				+ "WHEN dm.is_active=0  THEN 'Inactive'\r\n"
				+ "END as [Discount Status],\r\n"
				+ "FORMAT(CAST(dlm.offer_start_date as DATE),'dd-MM-yyyy') as [OFFER START DATE],\r\n"
				+ "FORMAT(CAST(dlm.offer_end_date as DATE),'dd-MM-yyyy') as [OFFER END DATE],\r\n"
				+ "FORMAT(CAST(dlm.preview_start_date as DATE),'dd-MM-yyyy') as [PREVIEW START DATE],\r\n"
				+ "FORMAT(CAST(dlm.preview_end_date as DATE),'dd-MM-yyyy') as [PREVIEW END DATE],\r\n"
				+ "JSON_VALUE(dm.basic_criteria,'$.data.isTepRecovery') as [IS TEP DISCOUNT RECOVERY],\r\n"
				+ "JSON_VALUE(dm.basic_criteria,'$.data.isFullValueTEPDiscountRecovery') as [FV TEP DISCOUNT RECOVERY],\r\n"
				+ "JSON_VALUE(dm.club_discount_type,'$.data.isClubbedOtherDiscounts') as [IS CLUBBED WITH OTHER DISCOUNTS],\r\n"
				+ "\r\n"
				+ "slab.SlabName as [Slabs],\r\n"
				+ "slab.MinVal as [Min Value],\r\n"
				+ "slab.MaxVal as [Max Value],\r\n"
				+ "slab.DiscCat as [Discount Based On],\r\n"
				+ "\r\n"
				+ "CAST(JSON_VALUE(slab.regconfig,'$.data.goldCharges.value') as float) as [V Discount],\r\n"
				+ "JSON_VALUE(slab.regconfig,'$.data.goldCharges.isPercent') as [Is V Discount %],\r\n"
				+ "CAST(JSON_VALUE(slab.regconfig,'$.data.stoneCharges.value') as float) as [F1 Discount],\r\n"
				+ "JSON_VALUE(slab.regconfig,'$.data.stoneCharges.isPercent') as [Is F1 Discount %],\r\n"
				+ "CAST(JSON_VALUE(slab.regconfig,'$.data.mcCharges.value') as float) as [UCP Discount],\r\n"
				+ "JSON_VALUE(slab.regconfig,'$.data.mcCharges.isPercent') as [Is UCP Discount %],\r\n"
				+ "CAST(JSON_VALUE(slab.regconfig,'$.data.isUCP.value') as float) as [MC Discount],\r\n"
				+ "JSON_VALUE(slab.regconfig,'$.data.isUCP.isPercent') as [Is MC Discount %],\r\n"
				+ "CAST(JSON_VALUE(slab.regconfig,'$.data.isPerGram.weight') as float) as [Value Per Gram Discount],\r\n"
				+ "JSON_VALUE(slab.regconfig,'$.data.isPerGram.isGrossWeight') as [Is Per Gram], \r\n"
				+ "																		  \r\n"
				+ "slab.CFA as [Active CFA CODES],\r\n"
				+ "slab.active	 as [Is Slab Active],\r\n"
				+ "dm.approved_by as [Approved By],\r\n"
				+ "JSON_VALUE(dm.club_discount_type,'$.data.isClubbedOtherDiscounts') as [Is Clubbed with Other Discounts allowed],\r\n"
				+ "dm.created_date as [Created Date],\r\n"
				+ "dm.created_by as [Login ID],\r\n"
				+ "dm.last_modified_by as [Last Modified by],\r\n"
				+ "CASE WHEN JSON_VALUE(dm.ab_co_data,'$.data.abDiscount.postAB')='true' THEN 	'AB' \r\n"
				+ "WHEN JSON_VALUE(dm.ab_co_data,'$.data.abDiscount.postRegular')='true' THEN 'Regular'\r\n"
				+ "END as [AB Discount],\r\n"
				+ "CASE WHEN JSON_VALUE(dm.ab_co_data,'$.data.coDiscount.postAB')='true' THEN 	'AB' \r\n"
				+ "WHEN JSON_VALUE(dm.ab_co_data,'$.data.coDiscount.postRegular')='true' THEN 'Regular'\r\n"
				+ "END as [CO Discount],\r\n"
				+ "CASE WHEN dm.is_created_by_workflow=1 THEN 'Yes' ELSE 'No' END as [Is Request Based],\r\n"
				+ "dm.is_active as [Is Active],\r\n"
				+ "JSON_VALUE(dm.basic_criteria, '$.data.isEditable') as [Is Editable at Store ?],\r\n"
				+ "JSON_VALUE(dm.grn_details,'$.data.noOfDaysAfterOfferPeriod') as [GRN No. of day After offer period],\r\n"
				+ "JSON_VALUE(dm.basic_criteria, '$.data.ucpValue') as [Bill Level Discount:UCP Value],\r\n"
				+ "CASE WHEN JSON_VALUE(dm.basic_criteria, '$.data.isBillValue')='true' THEN 'Rs'\r\n"
				+ "WHEN JSON_VALUE(dm.basic_criteria, '$.data.isBillValue')='false' THEN '%'\r\n"
				+ "END as [Bill Level Discount:Rs / %],\r\n"
				+ "FORMAT(CAST(LEFT(JSON_VALUE(dm.basic_criteria, '$.data.coinPurchaseStartDate'),10)as DATE),'dd-MM-yyyy') as [COD:Coin Purchasing start period],\r\n"
				+ "FORMAT(CAST(LEFT(JSON_VALUE(dm.basic_criteria, '$.data.coinPurchaseEndDate'),10)as DATE),'dd-MM-yyyy') as [COD:Coin Purchasing end period],\r\n"
				+ "FORMAT(CAST(LEFT(JSON_VALUE(dm.basic_criteria, '$.data.tepPeriodStartDate'),10)as DATE),'dd-MM-yyyy') as [COD:TEP Period Start Date],\r\n"
				+ "FORMAT(CAST(LEFT(JSON_VALUE(dm.basic_criteria, '$.data.tepPeriodEndDate'),10)as DATE),'dd-MM-yyyy') as [COD:TEP Period End Date],\r\n"
				+ "JSON_VALUE(dm.basic_criteria, '$.data.tepCNUtilizationPercent') as [COD:TEP CN%],\r\n"
				+ "JSON_VALUE(dm.basic_criteria, '$.data.mCPercent') as [COD:Making Charges %],\r\n"
				+ "JSON_VALUE(dm.order_details, '$.data.offerPeriodForCO') as [No. of Days After Offer Period for CO],\r\n"
				+ "JSON_VALUE(dm.order_details, '$.data.offerPeriodForAB') as [No. of Days After Offer Period for AB],\r\n"
				+ "dm.last_modified_date as [Last modified date],\r\n"
				+ "JSON_VALUE(dm.tep_details,'$.data.tepDetails[0].durationInDays') as [TEP Duration In Days],\r\n"
				+ "JSON_VALUE(dm.tep_details,'$.data.tepDetails[0].recoveryPercent') as [TEP Utilization %]\r\n"
				+ "from reports.dbo.discount_master dm\r\n"
				+ "inner join 	discount_location_mapping dlm on dlm.discount_id=dm.id\r\n"
				+ "left outer join \r\n"
				+ "(\r\n"
				+ "				select d2.discount_id as did, MAX(dd.slab_name) SlabName,  MAX(CAST((dd.is_active) as varchar)) active,\r\n"
				+ "				dd.min_value MinVal, dd.max_value MaxVal,  MAX(dd.discount_category) disccat, MAX(dd.regular_config_details) regconfig,\r\n"
				+ "				STUFF(\r\n"
				+ "				(SELECT ',' + product_group_code from reports.dbo.discount_product_group_mapping d1 where d1.is_active=1 and d2.discount_id=d1.discount_id\r\n"
				+ "				FOR XML PATH('')),1,1,'') as [CFA]\r\n"
				+ "				from reports.dbo.discount_product_group_mapping  d2		 \r\n"
				+ "				inner join discount_details dd on dd.discount_id=d2.discount_id\r\n"
				+ "				inner join discount_master dm on dm.id=d2.discount_id\r\n"
				+ "				GROUP BY d2.discount_id, dd.min_value, dd.max_value,dd.regular_config_details\r\n"
				+ ")slab on slab.did=dlm.discount_id, boutique_master_view	 bmv\r\n"
				+ "where bmv.location_code=dlm.location_code\r\n";				
		
		String s= select+""+ appendWhereClause;
		System.out.println(s);
		
		return  String.format("%s%s", select, appendWhereClause);
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		DiscountConfigurationsRequestDto discountConfigurationsRequestDto= (DiscountConfigurationsRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		if (!(StringUtils.isEmpty(discountConfigurationsRequestDto.getFromDate())
				&& StringUtils.isEmpty(discountConfigurationsRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(discountConfigurationsRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(discountConfigurationsRequestDto.getToDate());
			query.append(" AND (dlm.offer_start_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}
		
		validateLocationFields(discountConfigurationsRequestDto, query);
		if (discountConfigurationsRequestDto.getDiscountConfigurationsCustomRequestDto() != null) {
			validateCustomInputAndAppend(discountConfigurationsRequestDto, query);
		}
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(DiscountConfigurationsRequestDto discountConfigurationsRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(DiscountConfigurationsRequestDto discountConfigurationsRequestDto, StringBuilder query) {
		
		
		if (discountConfigurationsRequestDto.getSubRegionCode() != null && !discountConfigurationsRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(discountConfigurationsRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(discountConfigurationsRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + discountConfigurationsRequestDto.getStateId()).append("'");
		}
		if (discountConfigurationsRequestDto.getTownId() != null && !discountConfigurationsRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(discountConfigurationsRequestDto.getTownId())).append(")");
		}
		if (discountConfigurationsRequestDto.getLocationCode() != null && !discountConfigurationsRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(discountConfigurationsRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(discountConfigurationsRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + discountConfigurationsRequestDto.getCountryId()).append("'");
		}

		return query;
	}

	private StringBuilder formatListToInClause(List<String> values) {
		
		
		StringBuilder sb = new StringBuilder();
		int count = 0;
		for (String value : values) {

			sb.append("'" + value + "'");
			if (count != values.size() - 1) {
				sb.append(",");
			}
			count++;
		}
		return sb;
	}

	@Override
	protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {
		
		DiscountConfigurationsRequestDto discountConfigurationsRequestDto = (DiscountConfigurationsRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, DiscountConfigurationsRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			DiscountConfigurationsCustomRequestDto discountConfigurationsCustomRequestDto = new DiscountConfigurationsCustomRequestDto();
			discountConfigurationsCustomRequestDto.validate(reportRequestDto.getCustomFields());
			discountConfigurationsCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), DiscountConfigurationsCustomRequestDto.class);
			discountConfigurationsRequestDto.setDiscountConfigurationsCustomRequestDto(discountConfigurationsCustomRequestDto);
		}
		
		return discountConfigurationsRequestDto;
	}
	
	

}
