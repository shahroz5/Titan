/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.writer;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.sql.DataSource;

import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.PaymentHostnameMappingDto;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.payment.dao.PaymentHostnameMappingDao;
import com.titan.poss.payment.repository.PaymentHostnameMappingRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class PaymentHostnameMappingJobStagingWriter implements ItemWriter<PaymentHostnameMappingDto> {

	@Autowired
	private DataSource dataSource;

	@Autowired
	private PaymentHostnameMappingRepository paymentHostnameMappingRepository;

	@Autowired
	private PaymentHostnameMappingJobWriter paymentHostnameMappingJobWriter;

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public void write(List<? extends PaymentHostnameMappingDto> items) throws Exception {
		List<PaymentHostnameMappingDto> list = new ArrayList<>();
		items.stream().forEach(item -> {
			if (item != null) {
				list.add(item);
			}
		});
		List<PaymentHostnameMappingDto> paymentHostnameList = checkDuplicateHostname(list);
		paymentHostnameMappingJobWriter.paymentHostnameMappingStagingWriter(dataSource).write(paymentHostnameList);
	}

	private List<PaymentHostnameMappingDto> checkDuplicateHostname(List<PaymentHostnameMappingDto> list) {

		List<PaymentHostnameMappingDao> paymentHostNameDao = paymentHostnameMappingRepository.findByIsActive(true);
		List<PaymentHostnameMappingDto> paymentHostnameList = new ArrayList<>();

		for (PaymentHostnameMappingDto paymentHostnameMappingDto : list) {
			// ensuring the merchant id is not assigned to any other location.
			if (!validateLocationCodeAndPaymentCodeForHostName(paymentHostNameDao,
					paymentHostnameMappingDto.getHostName(), paymentHostnameMappingDto.getLocationCode(),
					paymentHostnameMappingDto.getPaymentCode())) {
				dataAuditService.saveDataAuditData(paymentHostnameMappingDto.getLocationCode(),
						MapperUtil.getJsonString(paymentHostnameMappingDto),
						"Duplicate hostname. This hostname has been assigned to another location for the same payment code.",
						paymentHostnameMappingDto.getFileAuditId(), ErrorTypeEnum.ERROR.toString());
			} else {
				if (validateDuplicateEntry(paymentHostnameList, paymentHostnameMappingDto.getHostName(),
						paymentHostnameMappingDto.getPaymentCode())) {
					paymentHostnameList.add(paymentHostnameMappingDto);
				} else {
					dataAuditService.saveDataAuditData(paymentHostnameMappingDto.getLocationCode(),
							MapperUtil.getJsonString(paymentHostnameMappingDto),
							"Duplicate hostname. This hostname has been assigned to another location for the same payment code.",
							paymentHostnameMappingDto.getFileAuditId(), ErrorTypeEnum.ERROR.toString());
				}
			}
		}
		return paymentHostnameList;
	}

	private boolean validateLocationCodeAndPaymentCodeForHostName(List<PaymentHostnameMappingDao> paymentHostNameDao,
			String hostName, String locationCode, String paymentCode) {
		List<PaymentHostnameMappingDao> paymentHostName = paymentHostNameDao.stream()
				.filter(ph -> ph.getHostName().equalsIgnoreCase(hostName)
						&& !ph.getLocationCode().equalsIgnoreCase(locationCode)
						&& ph.getPaymentCode().equalsIgnoreCase(paymentCode)
						&& ph.getIsActive())
				.collect(Collectors.toList());
		return paymentHostName.isEmpty();
	}

	private boolean validateDuplicateEntry(List<PaymentHostnameMappingDto> paymentHostnameList, String hostName,
			String paymentCode) {

		List<PaymentHostnameMappingDto> paymentHostName = paymentHostnameList.stream().filter(
				ph -> ph.getHostName().equalsIgnoreCase(hostName) && ph.getPaymentCode().equalsIgnoreCase(paymentCode) && ph.getIsActive())
				.collect(Collectors.toList());
		return paymentHostName.isEmpty();
	}
}
