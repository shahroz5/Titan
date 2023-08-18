package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.commons.lang3.StringUtils;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.file.dto.CustomerDecryptDto;

@Component
public class CustomerDecryptRowMapper implements RowMapper<CustomerDecryptDto> {

	private static final String CUSTOMER_ID = "customer_id";

	private static final String CUSTOMER_NAME = "customer_name";

	private static final String CUSTOMER_MOBILE_NO = "customer_mobile_number";

	private static final String CUSTOMER_ULP_ID = "customer_ulp_id";

	private static final String CUSTOMER_TAX_NO = "customer_tax_no";

	@Override
	public CustomerDecryptDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		CustomerDecryptDto customer = new CustomerDecryptDto();
		customer.setCustomerId(rs.getString(CUSTOMER_ID));
		customer.setCustomerName(StringUtils.isEmpty(rs.getString(CUSTOMER_NAME)) ? rs.getString(CUSTOMER_NAME)
				: CryptoUtil.decrypt(rs.getString(CUSTOMER_NAME), CUSTOMER_NAME, false));
		customer.setCustomerUlpId(rs.getString(CUSTOMER_ULP_ID));
		customer.setCustomerMobileNumber(
				StringUtils.isEmpty(rs.getString(CUSTOMER_MOBILE_NO)) ? rs.getString(CUSTOMER_MOBILE_NO)
						: CryptoUtil.decrypt(rs.getString(CUSTOMER_MOBILE_NO), CUSTOMER_MOBILE_NO, false));
		customer.setCustomerTaxNo(StringUtils.isEmpty(rs.getString(CUSTOMER_TAX_NO)) ? rs.getString(CUSTOMER_TAX_NO)
				: CryptoUtil.decrypt(rs.getString(CUSTOMER_TAX_NO), CUSTOMER_TAX_NO, false));

		return customer;
	}

}
