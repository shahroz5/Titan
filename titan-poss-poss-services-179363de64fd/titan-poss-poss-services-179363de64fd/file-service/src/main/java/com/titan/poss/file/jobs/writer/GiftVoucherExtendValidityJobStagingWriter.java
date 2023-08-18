/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.writer;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.dto.DataAuditDto;
import com.titan.poss.core.enums.GiftVoucherStatusEnum;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.GiftVoucherExtendValidityIngestionDto;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.payment.dao.GiftMasterDao;
import com.titan.poss.payment.util.PaymentCommonUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class GiftVoucherExtendValidityJobStagingWriter implements ItemWriter<GiftVoucherExtendValidityIngestionDto> {

	@Autowired
	private DataSource dataSource;

	@Autowired
	private GiftVoucherExtendValidityJobWriter giftVoucherExtendValidityJobWriter;

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public void write(List<? extends GiftVoucherExtendValidityIngestionDto> items) throws Exception {
		List<GiftVoucherExtendValidityIngestionDto> itemList = new ArrayList<>();
		List<BigInteger> serialNoListDuplicate = new ArrayList<>();

		items.forEach(item -> serialNoListDuplicate.add(item.getSerialNo()));
		List<BigInteger> serialNoListNotDuplicate = new ArrayList<>();
		if (!items.isEmpty()) {
			items.forEach(item -> {
				if (Collections.frequency(serialNoListDuplicate, item.getSerialNo()) > 1) {
					saveErrorData(item, "Duplicate Data");
				} else {
					serialNoListNotDuplicate.add(item.getSerialNo());
					itemList.add(item);
				}
			});
		}
		SqlParameterSource parameters = new MapSqlParameterSource("serialNos", serialNoListNotDuplicate);
		String sql = "SELECT * FROM payments.dbo.gift_master where serial_no IN (:serialNos)";
		List<GiftMasterDao> giftVoucherList = namedParameterJdbcTemplate.query(sql, parameters,
				new BeanPropertyRowMapper<>(GiftMasterDao.class));
		List<BigInteger> giftVoucherSerialNos = new ArrayList<>();
		giftVoucherList.forEach(giftVoucher -> giftVoucherSerialNos.add(giftVoucher.getSerialNo()));
		Map<BigInteger, GiftMasterDao> giftVoucherDetails = new HashMap<>();
		giftVoucherList.forEach(item -> giftVoucherDetails.put(item.getSerialNo(), item));

		List<GiftVoucherExtendValidityIngestionDto> dataPresent = checkDataPresentOrNot(itemList, giftVoucherSerialNos);
		List<GiftVoucherExtendValidityIngestionDto> dataToUpdate = checkStatusApplicableOrNot(giftVoucherDetails,
				dataPresent);
		List<GiftVoucherExtendValidityIngestionDto> updatableList = checkDateIsValidOrNot(dataToUpdate,
				giftVoucherDetails);
		if (!updatableList.isEmpty()) {
			giftVoucherExtendValidityJobWriter.giftVoucherExtendValidityStagingWriter(dataSource).write(updatableList);
		}
	}

	private void saveErrorData(GiftVoucherExtendValidityIngestionDto item, String errorMessage) {

		DataAuditDto dataAudit = new DataAuditDto();
		dataAudit.setPrimaryData(item.getSerialNo().toString());
		dataAudit.setData(MapperUtil.getJsonString(item));
		dataAudit.setErrorMessage(errorMessage);
		dataAudit.setFileId(item.getFileAuditId());
		dataAudit.setErrorType(ErrorTypeEnum.ERROR.toString());
		dataAuditService.saveDataAudit(dataAudit);

	}

	private List<GiftVoucherExtendValidityIngestionDto> checkDateIsValidOrNot(
			List<GiftVoucherExtendValidityIngestionDto> dataToUpdate, Map<BigInteger, GiftMasterDao> giftVoucherDetails) {
		List<GiftVoucherExtendValidityIngestionDto> updatableList = new ArrayList<>();
		if (!dataToUpdate.isEmpty()) {
			dataToUpdate.forEach(item -> {
				if (PaymentCommonUtil.dateValidation(item.getValidTill(),
						giftVoucherDetails.get(item.getSerialNo()).getValidFrom())) {
					updatableList.add(item);
				} else {
					saveErrorData(item, "Date is invalid");
				}
			});
		}
		return updatableList;
	}

	private List<GiftVoucherExtendValidityIngestionDto> checkStatusApplicableOrNot(
			Map<BigInteger, GiftMasterDao> giftVoucherDetails, List<GiftVoucherExtendValidityIngestionDto> dataPresent) {
		List<GiftVoucherExtendValidityIngestionDto> dataToUpdate = new ArrayList<>();
		if (!dataPresent.isEmpty()) {
			dataPresent.forEach(item -> {
				if (giftVoucherDetails.get(item.getSerialNo()).getStatus().toUpperCase()
						.equalsIgnoreCase(GiftVoucherStatusEnum.REDEEMABLE.name())) {
					dataToUpdate.add(item);
				} else {
					saveErrorData(item, "Status Should be REDEEMABLE");
				}

			});
		}
		return dataToUpdate;
	}

	private List<GiftVoucherExtendValidityIngestionDto> checkDataPresentOrNot(
			List<GiftVoucherExtendValidityIngestionDto> itemList, List<BigInteger> giftVoucherSerialNos) {
		List<GiftVoucherExtendValidityIngestionDto> dataPresent = new ArrayList<>();
		if (!itemList.isEmpty()) {
			itemList.forEach(item -> {
				if (!giftVoucherSerialNos.contains(item.getSerialNo())) {
					saveErrorData(item, "Data Not Present");
				} else {
					dataPresent.add(item);
				}
			});
		}
		return dataPresent;
	}

}
