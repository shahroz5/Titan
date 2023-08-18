/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.utils;

import java.math.BigDecimal;
import java.util.regex.Pattern;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.enums.CNStatus;
import com.titan.poss.core.enums.HistorySearchTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.sales.dto.request.SalesHistoryReqDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public final class SalesHistoryValidator {
	
	private SalesHistoryValidator() {
		throw new IllegalArgumentException("SalesHistoryValidator Util class");
	}
	
	private static final String ERR_SALE_048 = "ERR-SALE-048";
	private static final String INVALID_INPUTS = "Invalid inputs.";

	private static final String ERR_SALE_263 = "ERR-SALE-263";
	private static final String INVALID_RANGE = "Invalid Range";

	private static final String ERR_SALE_264 = "ERR-SALE-264";
	private static final String INVALID_CUSTOMER_SEARCH = "Search type and filed are mandatory for customer search";

	private static final String ERR_SALE_265 = "ERR-SALE-265";
	private static final String INVALID_DOCNO_FISCAL = "Fiscal year is mandatory for Doc No. search";

	private static final String ERR_SALE_266 = "ERR-SALE-266";
	private static final String INVALID_AMOUNT_FISCAL = "Fiscal year is mandatory net amount range search";

	private static final String ERR_SALE_267 = "ERR-SALE-267";
	private static final String INVALID_DATE_DATA = "Invalid date range";

	private static final String ERR_SALE_268 = "ERR-SALE-268";
	private static final String INVALID_DATA = "At least one filter condition required for search";

	private static final String ERR_SALE_269 = "ERR-SALE-269";
	private static final String INVALID_CN = "Destination location is required for Credit Note Transfer- IBT";

	public static void filterValidation(String searchField, String searchType, SalesHistoryReqDto historyDto,
			String status, Integer refDocNo, String destLocation, String employeeCode) {

		// Validate customer search parameter
		validateSearchFields(searchField, searchType);

		// Validate DocNo & FiscalYear check
		validateDocNoFiscalYear(historyDto);

		// Validate Amount Range & FiscalYear
		validateAmountRangeFiscalYear(historyDto);

		// Date Range validation
		validateDateBasedOnRange(historyDto);

		// validate filter parameters
		validateFilterParam(searchField, searchType, historyDto, status, refDocNo, destLocation,employeeCode);

	}

	private static void validateFilterParam(String searchField, String searchType, SalesHistoryReqDto historyDto,
			String status, Integer refDocNo, String destLocation, String employeeCode) {
		if (searchField == null && searchType == null && historyDto != null && historyDto.getDocNo() == null
				&& historyDto.getFiscalYear() == null && historyDto.getToDocDate() == null
				&& historyDto.getFromDocDate() == null && historyDto.getFromNetAmount() == null
				&& historyDto.getToNetAmount() == null && status == null && refDocNo == null && destLocation == null && employeeCode==null) {
			throw new ServiceException(INVALID_DATA, ERR_SALE_268);
		}
	}

	private static void validateDateBasedOnRange(SalesHistoryReqDto historyDto) {
		if ((historyDto.getFromDocDate() != null && historyDto.getToDocDate() == null)
				|| (historyDto.getFromDocDate() == null && historyDto.getToDocDate() != null)) {
			throw new ServiceException(INVALID_RANGE, ERR_SALE_267, "Please provide start date and end date");
		}
		if ((historyDto.getFromDocDate() != null && historyDto.getToDocDate() != null)
				&& historyDto.getToDocDate().before(historyDto.getFromDocDate())) {
			throw new ServiceException(INVALID_DATE_DATA, ERR_SALE_267, "Start date can't be after end date");
		}
		if (historyDto.getFromDocDate() != null && historyDto.getToDocDate() != null) {
			historyDto.setToDocDate(CalendarUtils.getEndOfDay(historyDto.getToDocDate()));
			historyDto.setFromDocDate(CalendarUtils.getStartOfDay(historyDto.getFromDocDate()));
		}
	}

	private static void validateAmountRangeFiscalYear(SalesHistoryReqDto historyDto) {
		if ((historyDto.getFromNetAmount() != null || historyDto.getToNetAmount() != null)
				&& historyDto.getFiscalYear() == null) {
			throw new ServiceException(INVALID_AMOUNT_FISCAL, ERR_SALE_266);
		}
		// Validate NetAmount Range
		validateNetAmount(historyDto.getToNetAmount(), historyDto.getFromNetAmount());
	}

	private static void validateDocNoFiscalYear(SalesHistoryReqDto historyDto) {
		if (historyDto.getDocNo() != null && historyDto.getFiscalYear() == null) {
			throw new ServiceException(INVALID_DOCNO_FISCAL, ERR_SALE_265);
		}
	}

	private static void validateSearchFields(String searchField, String searchType) {
		if (searchType != null && searchField != null) {
			getCustomerTxn(searchField, searchType);
		}
		if ((searchField != null && searchType == null) || (searchField == null && searchType != null)) {
			throw new ServiceException(INVALID_CUSTOMER_SEARCH, ERR_SALE_264);
		}
	}

	public static void validateNetAmount(BigDecimal toNetAmount, BigDecimal fromNetAmount) {
		if ((toNetAmount != null && fromNetAmount != null) && toNetAmount.compareTo(fromNetAmount) < 0) {
			throw new ServiceException(INVALID_RANGE, ERR_SALE_263);
		}
		if ((toNetAmount == null && fromNetAmount != null) || (toNetAmount != null && fromNetAmount == null)) {
			throw new ServiceException(INVALID_RANGE, ERR_SALE_263);
		}
		
	}

	private static void getCustomerTxn(String searchField, String searchType) {
		HistorySearchTypeEnum hEnum = HistorySearchTypeEnum.valueOf(searchType);

		switch (hEnum) {

		case EMAIL_ID:
			searchFieldPatternCheck(searchType, searchField, RegExConstants.EMAIL_REGEX);
			break;

		case MOBILE_NO:
			searchFieldPatternCheck(searchType, searchField, RegExConstants.MOBILE_REGEX);
			break;

		case PAN_NO:
			searchFieldPatternCheck(searchType, searchField, RegExConstants.PAN_REGEX);
			break;

		case ULP_ID:
			searchFieldPatternCheck(searchType, searchField, RegExConstants.ULP_ID_REGEX);
			break;

		case GST_NO:
			searchFieldPatternCheck(searchType, searchField, RegExConstants.GST_REGEX);
			break;
		}
	}

	private static void searchFieldPatternCheck(String searchType, String searchField, String regex) {
		if (!Pattern.matches(regex, searchField)) {
			throw new ServiceException(INVALID_INPUTS, ERR_SALE_048, searchType);
		}
	}

	public static void ibtCnValidation(String status, String destlocation) {
		if (CNStatus.TRANSFER_IBT.name().equals(status) && destlocation == null) {
			throw new ServiceException(INVALID_CN, ERR_SALE_269);
		}
	}

}
