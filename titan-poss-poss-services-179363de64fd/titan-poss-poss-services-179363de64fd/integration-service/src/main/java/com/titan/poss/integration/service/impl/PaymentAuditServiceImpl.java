/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.service.impl;

import java.util.Optional;

import javax.transaction.Transactional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.PaymentAuditDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.intg.dao.PaymentAuditDao;
import com.titan.poss.integration.intg.repository.PaymentAuditRepository;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.integration.service.PaymentAuditService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("IntegrationPaymentAuditServiceImpl")
public class PaymentAuditServiceImpl implements PaymentAuditService {

	@Autowired
	private VendorRepository vendorRepository;

	@Autowired
	private PaymentAuditRepository paymentAuditRepository;

	/**
	 * Save card payment audit dto.
	 *
	 * @param paymentAuditDto the unipay audit dto
	 * @return the unipay audit dto
	 */
	@Override
	@Transactional
	public PaymentAuditDto savePaymentAuditData(VendorDao vendorDao, PaymentAuditDto paymentAuditDto) {

		PaymentAuditDao paymentAudit;
		paymentAuditDto.setVendorCode(vendorDao.getVendorCode());
		if (StringUtils.isEmpty(paymentAuditDto.getId())) {
			paymentAudit = (PaymentAuditDao) MapperUtil.getObjectMapping(paymentAuditDto,
					new PaymentAuditDao());
			paymentAudit.setLocationCode(CommonUtil.getLocationCode());
			vendorDao = vendorRepository.findByVendorCode(vendorDao.getVendorCode());
			paymentAudit.setVendor(vendorDao);
		} else {
			Optional<PaymentAuditDao> optionalUnipayAudit = paymentAuditRepository
					.findById(paymentAuditDto.getId());
			if (optionalUnipayAudit.isPresent()) {
				paymentAudit = optionalUnipayAudit.get();
				paymentAudit = (PaymentAuditDao) MapperUtil.getObjectMapping(paymentAuditDto, paymentAudit);
			} else {
				throw new ServiceException("Payment audit data not found", "ERR-INT-014");
			}
		}
		if (paymentAuditDto.getRequest() != null) {
			paymentAudit.setRequest(paymentAuditDto.getRequest().toString());
		}
		if (paymentAuditDto.getResponse() != null) {
			paymentAudit.setResponse(paymentAuditDto.getResponse().toString());
		}
		if (paymentAudit.getSequenceNo() == null) {
			Integer maxId = paymentAuditRepository.getMaxSeqNo(CommonUtil.getLocationCode());
			paymentAudit.setSequenceNo(++maxId);
		}
		return (PaymentAuditDto) MapperUtil.getObjectMapping(paymentAuditRepository.save(paymentAudit),
				paymentAuditDto);
	}
}
