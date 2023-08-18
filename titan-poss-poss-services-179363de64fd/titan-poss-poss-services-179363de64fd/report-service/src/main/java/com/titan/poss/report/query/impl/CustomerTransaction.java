package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.CustomerTransactionCustomRequestDto;
import com.titan.poss.report.dto.request.json.CustomerTransactionRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("CustomerTransaction")
public class CustomerTransaction extends IReport {

	
	@Autowired
	ReportFactory reportFactory;
	public CustomerTransaction(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("CUSTOMER_TRANSACTION", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
		CustomerTransactionRequestDto customerTransactionRequestDto=(CustomerTransactionRequestDto) setCustomInput(reportRequestDto);
		// @formatter:off
		StringBuilder appendWhereClause = appendQuery(customerTransactionRequestDto);
		

		String select="select  st.location_code as [smis_locationcode], bmv.sub_region_code as [smis_region], ct.customer_id as [customerno],\r\n"
				+ "ct.ulp_id as [ulpmembershipid], st.doc_no as [smis_cmno], FORMAT(CAST(st.doc_date as DATE),'dd/MM/yyyy') as [smis_date],\r\n"
				+ "pgm.description as [smis_cfaproductdes], pcm.description as [smis_category], cmd.item_code as [smis_Itemcode],\r\n"
				+ "cmd.lot_number as [Lotnumber], cmd.total_weight as [smis_totalwt], grn.doc_no as [GRNNO],\r\n"
				+ "(cmd.total_value+cmd.total_tax) as [monthendprediscountvalue], FORMAT(CAST(customercm.doc_date as DATE),'dd/MM/yyyy') as [lasttrandocdate],\r\n"
				+ "customercm.location_code as [lastlocationcode],\r\n"
				+ "customercm.final_value as [TotalValuePurchased], customercm.occasion_name as [Ocassion],\r\n"
				+ "FORMAT(CAST(customergep.doc_date as DATE),'dd/MM/yyyy') as [lastgepdocdate],customergep.total_weight as [totalgepwt],\r\n"
				+ "enrolledStore.location_code as [EnrolledStore]\r\n"
				+ "from reports.dbo.sales_transaction st\r\n"
				+ "inner join reports.dbo.cash_memo cm on st.id=cm.id\r\n"
				+ "inner join reports.dbo.cash_memo_details cmd on cmd.cash_memo_id=cm.id\r\n"
				+ "inner join reports.dbo.boutique_master_view bmv on bmv.location_code=st.location_code\r\n"
				+ "left outer join reports.dbo.customer_transaction ct on ct.id=st.id\r\n"
				+ "left outer join reports.dbo.product_group_master pgm on pgm.product_group_code=cmd.product_group_code\r\n"
				+ "left outer join reports.dbo.product_category_master pcm on pcm.product_category_code=cmd.product_category_code\r\n"
				+ "left outer join (\r\n"
				+ "	select rt.doc_no,ged.cash_memo_details_id from reports.dbo.refund_transaction rt\r\n"
				+ "	inner join reports.dbo.goods_return_details ged on rt.id=ged.goods_return_id\r\n"
				+ "	where rt.status='CONFIRMED'\r\n"
				+ "	) grn on grn.cash_memo_details_id=cmd.id\r\n"
				+ "outer apply(\r\n"
				+ "		select top 1 st1.location_code,st1.doc_date,cm1.final_value, cm1.occasion_name, ct1.ulp_id from reports.dbo.sales_transaction st1\r\n"
				+ "		inner join reports.dbo.cash_memo cm1 on cm1.id=st1.id\r\n"
				+ "		inner join reports.dbo.customer_transaction ct1 on ct1.id=st1.id\r\n"
				+ "		where st1.status='CONFIRMED' and st1.txn_type='CM' and ct1.ulp_id=ct.ulp_id\r\n"
				+ "		order by st1.location_code desc\r\n"
				+ "		) customercm\r\n"
				+ "outer apply(\r\n"
				+ "	select  top 1 clm.location_code\r\n"
				+ "	from reports.dbo.customer_master cm\r\n"
				+ "	inner join reports.dbo.customer_location_mapping clm on clm.customer_master_id=cm.id\r\n"
				+ "	where ct.ulp_id=cm.ulp_id and cm.is_active=1\r\n"
				+ "	order by clm.created_date asc\r\n"
				+ "	 ) enrolledStore\r\n"
				+ "outer apply(\r\n"
				+ "		select top 1 st1.doc_date,ge.total_weight, ct1.ulp_id from reports.dbo.sales_transaction st1\r\n"
				+ "		inner join reports.dbo.goods_exchange ge on ge.id=st1.id\r\n"
				+ "		inner join reports.dbo.customer_transaction ct1 on ct1.id=st1.id\r\n"
				+ "		where st1.status='CONFIRMED' and st1.txn_type='GEP' and ct1.ulp_id=ct.ulp_id\r\n"
				+ "		order by st1.location_code desc\r\n"
				+ "		) customergep\r\n"
				+ "where st.location_code=bmv.location_code\r\n";
		
		String s= select+""+ appendWhereClause;
		System.out.println(s);
		
		return  String.format("%s%s", select, appendWhereClause);
		
		
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		CustomerTransactionRequestDto customerTransactionRequestDto= (CustomerTransactionRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		if (!(StringUtils.isEmpty(customerTransactionRequestDto.getFromDate())
				&& StringUtils.isEmpty(customerTransactionRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(customerTransactionRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(customerTransactionRequestDto.getToDate());
			query.append(" AND (st.doc_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}
		
		validateLocationFields(customerTransactionRequestDto, query);
		if (customerTransactionRequestDto.getCustomerTransactionCustomRequestDto() != null) {
			validateCustomInputAndAppend(customerTransactionRequestDto, query);
		}
		query.append(" order by st.location_code, st.doc_date");
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(CustomerTransactionRequestDto customerTransactionRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(CustomerTransactionRequestDto customerTransactionRequestDto, StringBuilder query) {
		
		
		if (customerTransactionRequestDto.getSubRegionCode() != null && !customerTransactionRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(customerTransactionRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(customerTransactionRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + customerTransactionRequestDto.getStateId()).append("'");
		}
		if (customerTransactionRequestDto.getTownId() != null && !customerTransactionRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(customerTransactionRequestDto.getTownId())).append(")");
		}
		if (customerTransactionRequestDto.getLocationCode() != null && !customerTransactionRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(customerTransactionRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(customerTransactionRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + customerTransactionRequestDto.getCountryId()).append("'");
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
		
		CustomerTransactionRequestDto customerTransactionRequestDto = (CustomerTransactionRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, CustomerTransactionRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			CustomerTransactionCustomRequestDto customerTransactionCustomRequestDto = new CustomerTransactionCustomRequestDto();
			customerTransactionCustomRequestDto.validate(reportRequestDto.getCustomFields());
			customerTransactionCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), CustomerTransactionCustomRequestDto.class);
			customerTransactionRequestDto.setCustomerTransactionCustomRequestDto(customerTransactionCustomRequestDto);
		}
		
		return customerTransactionRequestDto;
	}
	
	

}
