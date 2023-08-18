/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dto.response.CashbackUtilizedDto;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.service.PaymentEpossService;
import com.titan.poss.sales.utils.EpossCallServiceImpl;

import lombok.extern.slf4j.Slf4j;

/**
 * Service class for EPOSS payment.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("salesPaymentEpossServiceImpl")
public class PaymentEpossServiceImpl implements PaymentEpossService {

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepositoryExt;

	@Autowired
	private EpossCallServiceImpl epossCallService;

	@Override
	public CashbackUtilizedDto getCashbackUtilized(String instrumentNo, String offerId) {

		// check if it's a cardNo or not
		String cardNo = CryptoUtil.asymmetricDecrypt(instrumentNo, "instrumentNo", false);
		Pattern pattern = Pattern.compile(RegExConstants.NUMERIC_REGEX);
		if (!pattern.matcher(cardNo).matches()) {
			log.info("Invalid card number provided.");
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Invalid card number provided.");
		}
		String hashedInstrumentNo = CryptoUtil.getMd5(cardNo);
		CashbackUtilizedDto cashbackUtilizedDto;
		// if in EPOSS application, then create and execute query
		if (CommonUtil.isEpossApp()) {
			log.info("In EPOSS");
			cashbackUtilizedDto = getCashBackUtilizedCount(hashedInstrumentNo, offerId);
		} else {

			try {
				// if in POSS application, then call to EPOSS.
				// call to EPOSS
				log.info("In POSS, call to EPOSS");
				Map<String, String> requestParamters = new HashMap<>();
				requestParamters.put("instrumentNo", instrumentNo);
				requestParamters.put("offerId", offerId);
				cashbackUtilizedDto = epossCallService.callEposs(HttpMethod.GET,
						"api/sales/v2/payments/eposs/cash-back", requestParamters, null, CashbackUtilizedDto.class);

			} catch (Exception e) {
				// if in POSS application and EPOSS call failed, then create and execute query
				// call function.
				log.info("In POSS, call to EPOSS failed\nCause: " + e.toString() + "\n");
				cashbackUtilizedDto = getCashBackUtilizedCount(hashedInstrumentNo, offerId);
			}
		}

		return cashbackUtilizedDto;
	}

	private CashbackUtilizedDto getCashBackUtilizedCount(String instrumentHash, String offerId) {
		Integer usageCount = paymentDetailsRepositoryExt.countOfOfferUtilized(PaymentCodeEnum.CASHBACK.getPaymentcode(),
				instrumentHash, offerId);
		return new CashbackUtilizedDto(offerId, usageCount);
	}

}
