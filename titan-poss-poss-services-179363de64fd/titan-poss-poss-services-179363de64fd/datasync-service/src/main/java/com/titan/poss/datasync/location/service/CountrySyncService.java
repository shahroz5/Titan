/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.location.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.LocationOperationCodes;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.EpossCallServiceImpl;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.location.dao.CountryDao;
import com.titan.poss.location.dao.CurrencyDao;
import com.titan.poss.location.dto.CountrySyncDto;
import com.titan.poss.location.repository.CountryRepository;
import com.titan.poss.location.repository.CurrencyRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class CountrySyncService implements SyncOperation {

	@Autowired
	private CountryRepository countryRepository;

	@Autowired
	private CurrencyRepository currencyRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Autowired
	EpossCallServiceImpl fallBackService;

	private static final Logger LOGGER = LoggerFactory.getLogger(CountrySyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {

		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {

			ObjectMapper mapper = new ObjectMapper();
			CountrySyncDto countrySyncDto = new CountrySyncDto();
			CountryDao sourceCountry = countrySyncDto
					.getCountryDao(mapper.convertValue(data.getData(), new TypeReference<CountrySyncDto>() {
					}));
			CountryDao destinationCountry = countryRepository.findOneByCountryCode(sourceCountry.getCountryCode());

			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(LocationOperationCodes.COUNTRY_ADD)
					|| operationCode.equals(LocationOperationCodes.COUNTRY_UPDATE)) {

				if (destinationCountry == null) {

					saveToDestinationDB(sourceCountry, messageId,messageTransfer.getMessageTransferData().getDestination());

				} else {
					DatasyncStatusEnum status = compareSyncIdVersions(sourceCountry, destinationCountry);
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {

						datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), status.name());

					} else {

						saveToDestinationDB(sourceCountry, messageId,messageTransfer.getMessageTransferData().getDestination());

					}
				}

			}

		});
	}

	@Transactional
	public void saveToDestinationDB(CountryDao sourceCountry, String messageId, String dest) {

		CurrencyDao currency = currencyRepository.findOneByCurrencyCode(sourceCountry.getCurrency().getCurrencyCode());

		int tempSrcDataSyncId = sourceCountry.getSrcSyncId();
		sourceCountry.setSrcSyncId(sourceCountry.getDestSyncId());
		sourceCountry.setDestSyncId(tempSrcDataSyncId);
		try {
			if (currency == null) {
				String currencyUrl = "api/location/v2/currencies/datasync/"
						+ sourceCountry.getCurrency().getCurrencyCode();
				ApiResponseDto epossApiResponseDto = fallBackService.getTheEPOSSData(HttpMethod.GET, currencyUrl, null,
						null);
				CurrencyDao currencyDao = MapperUtil.getObjectMapperInstance()
						.convertValue(epossApiResponseDto.getResponse(), CurrencyDao.class);
				currencyRepository.save(currencyDao);

			}
			countryRepository.save(sourceCountry);
			datasyncAuditService.updateDatasyncAuditStatusById(messageId,dest, DatasyncStatusEnum.SYNCED.name());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,dest,
					DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

	private DatasyncStatusEnum compareSyncIdVersions(CountryDao src, CountryDao dest) {

		return ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(), dest.getSrcSyncId(),
				dest.getDestSyncId());
	}

}
