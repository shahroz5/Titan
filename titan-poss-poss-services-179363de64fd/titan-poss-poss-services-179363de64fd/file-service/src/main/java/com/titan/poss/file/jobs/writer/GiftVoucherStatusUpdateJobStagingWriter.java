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
import com.titan.poss.file.dto.GiftVoucherStatusUpdateIngestionDto;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.payment.dao.GiftMasterDao;
import com.titan.poss.payment.util.GiftStatusUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class GiftVoucherStatusUpdateJobStagingWriter implements ItemWriter<GiftVoucherStatusUpdateIngestionDto> {

	@Autowired
	private DataSource dataSource;

	@Autowired
	private GiftVoucherStatusUpdateJobWriter giftVoucherStatusUpdateJobWriter;

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public void write(List<? extends GiftVoucherStatusUpdateIngestionDto> items) throws Exception {
		List<GiftVoucherStatusUpdateIngestionDto> itemList = new ArrayList<>();
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

		List<GiftVoucherStatusUpdateIngestionDto> dataPresent = checkDataPresentOrNot(itemList, giftVoucherSerialNos);
		List<GiftVoucherStatusUpdateIngestionDto> dataToUpdate = checkStatusApplicableOrNot(dataPresent,
				giftVoucherDetails);
		List<GiftVoucherStatusUpdateIngestionDto> updatableList = checkStatusTransition(dataToUpdate,
				giftVoucherDetails);

		if (!updatableList.isEmpty()) {
			giftVoucherStatusUpdateJobWriter.giftVoucherStatusUpdateStagingWriter(dataSource).write(updatableList);
		}
	}

	private void saveErrorData(GiftVoucherStatusUpdateIngestionDto item, String errorMessage) {
		DataAuditDto dataAudit = new DataAuditDto();
		dataAudit.setPrimaryData(item.getSerialNo().toString());
		dataAudit.setData(MapperUtil.getJsonString(item));
		dataAudit.setErrorMessage(errorMessage);
		dataAudit.setFileId(item.getFileAuditId());
		dataAudit.setErrorType(ErrorTypeEnum.ERROR.toString());
		dataAuditService.saveDataAudit(dataAudit);

	}

	private List<GiftVoucherStatusUpdateIngestionDto> checkStatusTransition(
			List<GiftVoucherStatusUpdateIngestionDto> dataToUpdate, Map<BigInteger, GiftMasterDao> giftVoucherDetails) {
		List<GiftVoucherStatusUpdateIngestionDto> updatableList = new ArrayList<>();
		if (!dataToUpdate.isEmpty()) {

			dataToUpdate.forEach(item -> {
				List<GiftVoucherStatusEnum> giftvoucherEnumList = new ArrayList<>();
				giftvoucherEnumList = GiftStatusUtil.getGiftupdatestatus().get(GiftVoucherStatusEnum
						.valueOf(giftVoucherDetails.get(item.getSerialNo()).getStatus().toUpperCase()));
				if (giftvoucherEnumList
						.contains(GiftStatusUtil.getStatusdetails().get(Integer.parseInt(item.getStatus())))) {
					updatableList.add(item);
				} else {
					saveErrorData(item, "Status Transition Restricted");
				}

			});
		}
		return updatableList;
	}

	private List<GiftVoucherStatusUpdateIngestionDto> checkStatusApplicableOrNot(
			List<GiftVoucherStatusUpdateIngestionDto> dataPresent, Map<BigInteger, GiftMasterDao> giftVoucherDetails) {
		List<GiftVoucherStatusUpdateIngestionDto> dataToUpdate = new ArrayList<>();
		if (!dataPresent.isEmpty()) {
			dataPresent.forEach(item -> {
				if (giftVoucherDetails.get(item.getSerialNo()).getStatus().toUpperCase()
						.equalsIgnoreCase(GiftVoucherStatusEnum.FOR_INWARDING.name())
						|| giftVoucherDetails.get(item.getSerialNo()).getStatus().toUpperCase()
								.equalsIgnoreCase(GiftVoucherStatusEnum.REDEEMABLE.name())
						|| giftVoucherDetails.get(item.getSerialNo()).getStatus().toUpperCase()
								.equalsIgnoreCase(GiftVoucherStatusEnum.EXPIRED.name())
						|| giftVoucherDetails.get(item.getSerialNo()).getStatus().toUpperCase()
								.equalsIgnoreCase(GiftVoucherStatusEnum.BLOCKED.name())) {
					dataToUpdate.add(item);
				} else {
					saveErrorData(item, "Status Can't be modified");
				}
			});
		}
		return dataToUpdate;
	}

	private List<GiftVoucherStatusUpdateIngestionDto> checkDataPresentOrNot(
			List<GiftVoucherStatusUpdateIngestionDto> itemList, List<BigInteger> giftVoucherSerialNos) {
		List<GiftVoucherStatusUpdateIngestionDto> dataPresent = new ArrayList<>();
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
