/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.CNRegisterCustomRequestDto;
import com.titan.poss.report.dto.request.json.CNRegisterRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;
import com.titan.poss.report.service.ReportDecryptService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component("CNRegisterReport")
public class CNRegisterReport extends IReport {

	@Autowired
	private ReportDecryptService reportDecryptService;

	public CNRegisterReport(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("CN_REGISTER_REPORT", this);
	}

	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		CNRegisterRequestDto cnRegisterRequestDto = (CNRegisterRequestDto) setCustomInput(reportRequestDto);
		StringBuilder appendWhereClause = appendQuery(cnRegisterRequestDto);

		String reportId = reportRequestDto.getReportId();
		// @formatter:off
        String select =  "SELECT        " +
                " cn.location_code as \"Location Code\",       " +
                " bmv.owner_type as \"Btq Level\",       " +
                " bmv.brand_code as \"Brand\",       " +
                " bmv.sub_region_code as \"Region\",       " +
                " bmv.state_name as \"State\",       " +
                " bmv.town_name as \"City\",    " +
                " cn.doc_no as \"CN No\",    " +
                " format(cast(cn.doc_date as \"date\"),'dd/MM/yyyy') as \"CN Date\",    " +
                " cn.amount as \"CN Amount\",    " +
                " cn.utilised_amount as \"Adjusted/Redeemed Amount\",   " +
                " (cn.amount-cn.utilised_amount) as \"DFRNS Value\",    " +
                " cn_child.doc_no as \"Partial CN No\",   " +
                " cn_child.amount as \"Amount\",  " +
                " cn_original.doc_no as \"Source CN No\",  " +
                " st.doc_no as \"Ref Doc No\",    " +
                " format(cast(st.doc_date as \"date\"),'dd/MM/yyyy') as \"Ref Doc Date\",    " +
                " st.txn_type as \"Ref Doc Type\",   " +
                " cn.credit_note_type as \"CN Type\",    " +
                " convert(varchar, DATEADD(DAY , CAST(JSON_VALUE(bmv.cn_details , '$.data.suspendingCNs') as int), cn.doc_date),103) as \"Expiry Date\",   " +
                " cn.status as \"CN Status\",    " +
                " cn.customer_id as \"CN Customer No\",   " +
                " cm1.customer_name as \"CN Customer Name\",    " +
                " cm1.mobile_number  as \"Mobile No\",    " +
                " cm1.ulp_id as \"ULP No\",    " +
                " cm1.cust_tax_no as \"PAN/Form 60\",    " +
                " pt.doc_no as \"Payment Doc No\",   " +
                " pt.txn_type  as \"Payemnt Doc type\",   " +
                " format(cast(pd.payment_date as \"date\"),'dd/MM/yyyy')  as \"Payment Date\",   " +
                " pt.customer_id as \"CM Customer No\",   " +
                " cm2.customer_name as \"CM Customer Name\",   " +
                " cm2.mobile_number  as \"CM Mobile No\",    " +
                " cm2.ulp_id as \"CM ULP No\",    " +
                " cm2.cust_tax_no as \"PAN/Form 60\",    " +
                " CASE   " +
                "WHEN cm1.ulp_id = cm2.ulp_id then 'YES'  " +
                "ELSE 'NO'  " +
                "END as '3rd Party Redemption',  " +
                " DATEDIFF(DAY, cn.doc_date,GETDATE()) as \"CN Age In Days\" ,   " +
                " JSON_VALUE(cnt.cn_details , '$.data.docDate') as \"CN Actual Age\",      " +
                " JSON_VALUE(cnt.cn_details , '$.data.locationCode') as \"Source Btq Code\",   " +
                " bmv1.owner_type as \"Source Btq Type\",  " +
                " cn.remarks as \"Remarks\"    " +
                "from    " +
                "credit_note cn    " +
                "left outer join  credit_note cn_original    " +
                "on cn.original_cn_id  = cn_original.id    " +
                "left outer join sales_transaction st    " +
                "on st.id =cn_original.sales_txn_id   " +
                "left outer join credit_note cn_child    " +
                "on cn.id = cn_child.parent_cn_id   and  cn_child.id != cn_child.parent_cn_id   " +
                "left outer join payment_details pd   " +
                "on convert(varchar,cn.doc_no) = pd.instrument_no and convert(varchar,cn.fiscal_year) = pd.reference_2 and pd.payment_code='CREDIT NOTE' and pd.status ='COMPLETED'  " +
                "left outer join sales_transaction pt    " +
                "on cn.location_code = pt.location_code and pd.sales_txn_id = pt.id   " +
                "inner join boutique_master_view bmv    " +
                "on cn.location_code = bmv.location_code   " +
                "left outer join boutique_master_view bmv1    " +
                "on cn_original.location_code = bmv1.location_code  " +
                "inner join customer_location_mapping clm1   " +
                "on cn.customer_id = clm1.customer_id  and clm1.location_code = cn.location_code  " +
                "inner join customer_master_temp cm1   " +
                "on cm1.id = clm1.customer_master_id  and cm1.report_id ='" +reportId + "' " +
                "left outer join customer_location_mapping clm2   " +
                "on pt.customer_id = clm2.customer_id  and pt.location_code = clm2.location_code  " +
                "left outer join customer_master_temp cm2   " +
                "on cm2.id=clm2.customer_master_id and cm2.report_id ='" +reportId + "' " +
                "left outer join credit_note_transfer cnt   " +
                "on cn.cn_transfer_id = cnt.id ";
        
        String decryptQuery1 =  "SELECT " +
                "distinct cm1.id as customer_id " ;
        
        String decryptCommonQuery = " from    " +
                "reports.dbo.credit_note cn    " +
                "left outer join  reports.dbo.credit_note cn_original    " +
                "on cn.original_cn_id  = cn_original.id    " +
                "left outer join reports.dbo.sales_transaction st    " +
                "on st.id =cn_original.sales_txn_id   " +
                "left outer join reports.dbo.credit_note cn_child    " +
                "on cn.id = cn_child.parent_cn_id   and  cn_child.id != cn_child.parent_cn_id   " +
                "left outer join reports.dbo.payment_details pd   " +
                "on convert(varchar,cn.doc_no) = pd.instrument_no and convert(varchar,cn.fiscal_year) = pd.reference_2 and pd.payment_code='CREDIT NOTE' and pd.status ='COMPLETED'  " +
                "left outer join reports.dbo.sales_transaction pt    " +
                "on cn.location_code = pt.location_code and pd.sales_txn_id = pt.id   " +
                "inner join reports.dbo.boutique_master_view bmv    " +
                "on cn.location_code = bmv.location_code   " +
                "left outer join reports.dbo.boutique_master_view bmv1    " +
                "on cn_original.location_code = bmv1.location_code  " +
                "inner join reports.dbo.customer_location_mapping clm1   " +
                "on cn.customer_id = clm1.customer_id  and clm1.location_code = cn.location_code  " +
                "inner join reports.dbo.customer_master cm1   " +
                "on cm1.id = clm1.customer_master_id    " +
                "left outer join reports.dbo.customer_location_mapping clm2   " +
                "on pt.customer_id = clm2.customer_id  and pt.location_code = clm2.location_code  " +
                "left outer join reports.dbo.customer_master cm2   " +
                "on cm2.id=clm2.customer_master_id   " +
                "left outer join reports.dbo.credit_note_transfer cnt   " +
                "on cn.cn_transfer_id = cnt.id ";
        
        String decryptQuery2 =  "SELECT " +
                "distinct cm2.id as customer_id ";

    	// @formatter:on
		// decrypting encrypted columns

		StringBuilder finalDecryptQuery = new StringBuilder(decryptQuery1);
		finalDecryptQuery.append(decryptCommonQuery);
		finalDecryptQuery.append(appendWhereClause);
		finalDecryptQuery.append(" UNION ");
		finalDecryptQuery.append(decryptQuery2);
		finalDecryptQuery.append(decryptCommonQuery);
		finalDecryptQuery.append(appendWhereClause);
		reportDecryptService.decryptReport(finalDecryptQuery.toString(), reportRequestDto.getReportId(),
				reportRequestDto.getAuthorizationHeader(), reportRequestDto.getAuthorizationCookie());

		return String.format("%s%s", select, appendWhereClause);
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		CNRegisterRequestDto cnRegisterRequestDto = (CNRegisterRequestDto) reportRequestDto;
		StringBuilder query = new StringBuilder();
		if (!(StringUtils.isEmpty(cnRegisterRequestDto.getFromDate())
				&& StringUtils.isEmpty(cnRegisterRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(cnRegisterRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(cnRegisterRequestDto.getToDate());
			query.append(" WHERE cn.doc_date BETWEEN '" + fromDate + "' AND '" + toDate + "'");
		} else {
			throw new ServiceException("Required field(s) missing", "ERR-REPORT-011");
		}
		if (cnRegisterRequestDto.getOwnerType() != null && !cnRegisterRequestDto.getOwnerType().isEmpty()) {
			query.append(" AND bmv.owner_type in  (" + formatListToInClause(cnRegisterRequestDto.getOwnerType()))
					.append(")");
		}
		if (cnRegisterRequestDto.getBrandCode() != null && !cnRegisterRequestDto.getBrandCode().isEmpty()) {
			query.append(" AND bmv.brand_code in (" + formatListToInClause(cnRegisterRequestDto.getBrandCode()))
					.append(")");
		}

		if (cnRegisterRequestDto.getCnRegisterCustomRequestDto() != null) {
			if (cnRegisterRequestDto.getCnRegisterCustomRequestDto().getAmountFrom() != null
					&& cnRegisterRequestDto.getCnRegisterCustomRequestDto().getAmountTo() != null) {
				query.append(
						" AND cn.amount BETWEEN " + cnRegisterRequestDto.getCnRegisterCustomRequestDto().getAmountFrom()
								+ " AND " + cnRegisterRequestDto.getCnRegisterCustomRequestDto().getAmountTo());
			}
			if (!CollectionUtils.isEmpty(cnRegisterRequestDto.getCnRegisterCustomRequestDto().getCnType())) {
				query.append(" AND cn.credit_note_type in ("
						+ formatListToInClause(cnRegisterRequestDto.getCnRegisterCustomRequestDto().getCnType()))
						.append(")");
			}
			if (!CollectionUtils.isEmpty(cnRegisterRequestDto.getCnRegisterCustomRequestDto().getCnStatus())) {
				query.append(" AND cn.status in ("
						+ formatListToInClause(cnRegisterRequestDto.getCnRegisterCustomRequestDto().getCnStatus()))
						.append(")");
			}
		}
		validateLocationFields(cnRegisterRequestDto, query);
		return query;
	}

	private StringBuilder validateLocationFields(CNRegisterRequestDto cnRegisterRequestDto, StringBuilder query) {
		if (!StringUtils.isEmpty(cnRegisterRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + cnRegisterRequestDto.getStateId()).append("'");
		}
		if (cnRegisterRequestDto.getTownId() != null && !cnRegisterRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(cnRegisterRequestDto.getTownId())).append(")");
		}
		if (cnRegisterRequestDto.getLocationCode() != null && !cnRegisterRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in(" + formatListToInClause(cnRegisterRequestDto.getLocationCode()))
					.append(")");
		}
		if (cnRegisterRequestDto.getSubRegionCode() != null && !cnRegisterRequestDto.getSubRegionCode().isEmpty()) {
			query.append(
					" AND bmv.region_code in (" + formatListToInClause(cnRegisterRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(cnRegisterRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + cnRegisterRequestDto.getCountryId()).append("'");
		}
		return query;
	}

	@Override
	protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {
		CNRegisterRequestDto cnRegisterRequestDto = (CNRegisterRequestDto) MapperUtil.getDtoMapping(reportRequestDto,
				CNRegisterRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			CNRegisterCustomRequestDto cnRegisterCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), CNRegisterCustomRequestDto.class);
			cnRegisterRequestDto.setCnRegisterCustomRequestDto(cnRegisterCustomRequestDto);
		}
		return cnRegisterRequestDto;
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
}
