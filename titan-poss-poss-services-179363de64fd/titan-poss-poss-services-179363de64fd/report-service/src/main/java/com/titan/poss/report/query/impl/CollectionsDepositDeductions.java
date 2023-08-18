package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.CollectionsDepositDeductionsCustomRequestDto;
import com.titan.poss.report.dto.request.json.CollectionsDepositDeductionsRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("CollectionsDepositDeductions")
public class CollectionsDepositDeductions extends IReport {

	
	@Autowired
	ReportFactory reportFactory;
	public CollectionsDepositDeductions(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("COLLECTIONS_DEPOSIT_DEDUCTIONS", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
		
		CollectionsDepositDeductionsRequestDto collectionsDepositDeductionsRequestDto=(CollectionsDepositDeductionsRequestDto) setCustomInput(reportRequestDto);
		// @formatter:off
		StringBuilder appendWhereClause = appendQuery(collectionsDepositDeductionsRequestDto);
		

		String select="select DISTINCT\r\n"
				+ "bmv.brand_code as [Brand], bmv.owner_type [Owner Type], bmv.sub_region_code as [Region], bd.location_code as [Location Code],\r\n"
				+ "bmv.town_name+'-'+bd.location_code as [Location], bdm.fiscal_year as [Fiscal Year],\r\n"
				+ " FORMAT(CAST(bd.business_date as DATE),'dd/MMM/yyyy') as [Business Date], DATENAME(WEEKDAY,bd.business_date) [Business Day],\r\n"
				+ " CASH.CollectedAmt as [Collected - CASH],\r\n"
				+ " CARD.CollectedAmt as [Collected - CARD], CHEQUE.CollectedAmt as [Collected - CHEQUE], \r\n"
				+ " DD.CollectedAmt as [Collected - DD],CASH.DepositedAmt as [Deposited - CASH],\r\n"
				+ " CARD.DepositedAmt as [Deposited - CARD], CHEQUE.DepositedAmt as [Deposited - CHEQUE], \r\n"
				+ " DD.DepositedAmt as [Deposited - DD], CASH.DepositedAmt-CASH.CollectedAmt as [CASH Deduction - DIFF],\r\n"
				+ " CARD.DepositedAmt-CARD.CollectedAmt as [CARD Deduction - DIFF],\r\n"
				+ " CHEQUE.DepositedAmt-CHEQUE.CollectedAmt as [CHEQUE Deduction - DIFF],\r\n"
				+ " DD.DepositedAmt-DD.CollectedAmt as [DD Deduction - DIFF]\r\n"
				+ "from bank_deposits bd\r\n"
				+ "inner join business_day_master bdm on bdm.id=bd.day_master_id\r\n"
				+ "inner join boutique_master_view bmv on bmv.location_code=bd.location_code\r\n"
				+ "left outer join(\r\n"
				+ "	select location_code,business_date, SUM(amount) as [CollectedAmt], SUM(deposit_amount) as [DepositedAmt] from bank_deposits\r\n"
				+ "	where payment_code='CASH'\r\n"
				+ "	group by location_code,business_date,payment_code\r\n"
				+ "	) CASH on bd.location_code=CASH.location_code and bd.business_date=CASH.business_date\r\n"
				+ "left outer join(\r\n"
				+ "	select location_code,business_date, SUM(amount) as [CollectedAmt], SUM(deposit_amount) as [DepositedAmt] from bank_deposits\r\n"
				+ "	where payment_code='CHEQUE'\r\n"
				+ "	group by location_code,business_date,payment_code\r\n"
				+ "	) CHEQUE on bd.location_code=CHEQUE.location_code and bd.business_date=CHEQUE.business_date\r\n"
				+ "left outer join(\r\n"
				+ "	select location_code,business_date, SUM(amount) as [CollectedAmt], SUM(deposit_amount) as [DepositedAmt] from bank_deposits\r\n"
				+ "	where payment_code='DD'\r\n"
				+ "	group by location_code,business_date,payment_code\r\n"
				+ "	) DD on bd.location_code=DD.location_code and bd.business_date=DD.business_date\r\n"
				+ "left outer join(\r\n"
				+ "	select location_code,business_date, SUM(amount) as [CollectedAmt], SUM(deposit_amount) as [DepositedAmt] from bank_deposits\r\n"
				+ "	where payment_code='CARD'\r\n"
				+ "	group by location_code,business_date,payment_code\r\n"
				+ "	) CARD on bd.location_code=CARD.location_code and bd.business_date=CARD.business_date";
		
		String s= select+""+ appendWhereClause;
		System.out.println(s);
		
		return  String.format("%s%s", select, appendWhereClause);
		
		
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		CollectionsDepositDeductionsRequestDto collectionsDepositDeductionsRequestDto= (CollectionsDepositDeductionsRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		if (!(StringUtils.isEmpty(collectionsDepositDeductionsRequestDto.getFromDate())
				&& StringUtils.isEmpty(collectionsDepositDeductionsRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(collectionsDepositDeductionsRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(collectionsDepositDeductionsRequestDto.getToDate());
			query.append(" AND (bd.business_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}
		
		validateLocationFields(collectionsDepositDeductionsRequestDto, query);
		if (collectionsDepositDeductionsRequestDto.getCollectionsDepositDeductionsCustomRequestDto() != null) {
			validateCustomInputAndAppend(collectionsDepositDeductionsRequestDto, query);
		}
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(CollectionsDepositDeductionsRequestDto collectionsDepositDeductionsRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(CollectionsDepositDeductionsRequestDto collectionsDepositDeductionsRequestDto, StringBuilder query) {
		
		
		if (collectionsDepositDeductionsRequestDto.getSubRegionCode() != null && !collectionsDepositDeductionsRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(collectionsDepositDeductionsRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(collectionsDepositDeductionsRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + collectionsDepositDeductionsRequestDto.getStateId()).append("'");
		}
		if (collectionsDepositDeductionsRequestDto.getTownId() != null && !collectionsDepositDeductionsRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(collectionsDepositDeductionsRequestDto.getTownId())).append(")");
		}
		if (collectionsDepositDeductionsRequestDto.getLocationCode() != null && !collectionsDepositDeductionsRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(collectionsDepositDeductionsRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(collectionsDepositDeductionsRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + collectionsDepositDeductionsRequestDto.getCountryId()).append("'");
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
		
		CollectionsDepositDeductionsRequestDto collectionsDepositDeductionsRequestDto = (CollectionsDepositDeductionsRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, CollectionsDepositDeductionsRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			CollectionsDepositDeductionsCustomRequestDto collectionsDepositDeductionsCustomRequestDto = new CollectionsDepositDeductionsCustomRequestDto();
			collectionsDepositDeductionsCustomRequestDto.validate(reportRequestDto.getCustomFields());
			collectionsDepositDeductionsCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), CollectionsDepositDeductionsCustomRequestDto.class);
			collectionsDepositDeductionsRequestDto.setCollectionsDepositDeductionsCustomRequestDto(collectionsDepositDeductionsCustomRequestDto);
		}
		
		return collectionsDepositDeductionsRequestDto;
	}
	
	

}
