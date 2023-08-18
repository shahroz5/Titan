/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;
import com.titan.poss.core.dto.VendorConfigDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.QcgcConfigDto;
import com.titan.poss.integration.dto.RazorpayConfigResponseDto;
import com.titan.poss.integration.dto.request.AirpayConfigPropertiesDto;
import com.titan.poss.integration.dto.request.VendorConfigAddDto;
import com.titan.poss.integration.intg.dao.VendorConfigDaoExt;
import com.titan.poss.integration.intg.repository.VendorConfigRepositoryExt;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.integration.service.VendorConfigService;
import com.titan.poss.integration.service.factory.VendorConfigFactory;

/**
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("IntegrationVendorConfigService")
public class VendorConfigServiceImpl implements VendorConfigService {

	/** The vendor config repository. */
	@Autowired
	private VendorConfigRepositoryExt vendorConfigRepository;

	/** The vendor repository. */
	@Autowired
	private VendorRepository vendorRepository;

	@Autowired
	private EngineServiceClient engineServiceClient;

	@Autowired
	private VendorConfigFactory vendorConfigFactory;

	private static final String ERR_INT_013 = "ERR-INT-013";

	private static final String ERR_INT_015 = "ERR-INT-015";

	private static final String VENDOR_ERR_MSG = "Vendor not present";

	/**
	 * Gets the all vendor configs.
	 *
	 * @param vendorCode the vendor code
	 * @param isActive   the is active
	 * @return the all vendor configs
	 */
	@Override
	public List<VendorConfigDto> getAllVendorConfigs(String vendorCode, Boolean isActive) {
		List<VendorConfigDaoExt> vendorConfigDaoList = vendorConfigRepository
				.findByVendorVendorCodeAndIsActive(vendorCode, isActive);
		List<VendorConfigDto> vendorConfigDtoList = new ArrayList<>();
		for (int i = 0; i < vendorConfigDaoList.size(); i++) {
			VendorConfigDto vendorConfigDto = (VendorConfigDto) MapperUtil.getObjectMapping(vendorConfigDaoList.get(i),
					new VendorConfigDto());
			vendorConfigDto.setVendorCode(vendorCode);
			vendorConfigDto.setConfigDetails(MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(vendorConfigDaoList.get(i).getConfigDetails()), JsonData.class));
			vendorConfigDto.setConnectionDetails(
					MapperUtil.getJsonFromString(vendorConfigDaoList.get(i).getConnectionDetails()).toString());
			vendorConfigDtoList.add(vendorConfigDto);
		}

		return vendorConfigDtoList;
	}

	/**
	 * Gets the vendor config.
	 *
	 * @param configId the config id
	 * @return the vendor config
	 */
	@Override
	public VendorConfigDto getVendorConfig(String configId) {
		Optional<VendorConfigDaoExt> vendorConfigOptional = vendorConfigRepository.findById(configId);
		if (!vendorConfigOptional.isPresent()) {
			throw new ServiceException("Vendor config not present for {vendorCode}", ERR_INT_013,
					Map.of("vendorCode", "given id"));
		}
		VendorConfigDto vendorConfigDto = (VendorConfigDto) MapperUtil.getObjectMapping(vendorConfigOptional.get(),
				new VendorConfigDto());
		vendorConfigDto.setVendorCode(vendorConfigOptional.get().getVendor().getVendorCode());
		vendorConfigDto.setConfigDetails(MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.getJsonFromString(vendorConfigOptional.get().getConfigDetails()), JsonData.class));
		vendorConfigDto.setConnectionDetails(
				MapperUtil.getJsonFromString(vendorConfigOptional.get().getConnectionDetails()).toString());

		return vendorConfigDto;
	}

	@Override
	public VendorConfigDaoExt getActiveByVendorCodeAndLocationCode(String vendorCode, String locationCode) {
		List<VendorConfigDaoExt> vendorConfigs = vendorConfigRepository
				.findAllByVendorVendorCodeAndLocationCodeAndIsActiveTrue(vendorCode, locationCode);
		if (vendorConfigs.isEmpty())
			throw new ServiceException("No active vendor config details found", ERR_INT_013, vendorCode);
		if (vendorConfigs.size() > 1)
			throw new ServiceException("More than one active vendor config details found", "ERR-INT-007", vendorCode);
		return vendorConfigs.get(0);

	}

	/**
	 * Creates the vendor config.
	 *
	 * @param vendorConfigAddDto the vendor config add dto
	 * @return the vendor config dto
	 */
	@Override
	@Transactional
	public VendorConfigDto createVendorConfig(String vendorCode, VendorConfigAddDto vendorConfigAddDto) {
		BaseFieldsValidator vendorConfigDto = vendorConfigFactory.getVendorConfig(vendorCode);
		vendorConfigDto.validate(vendorConfigAddDto.getConfigDetails());

		VendorConfigDaoExt vendorConfigDao = (VendorConfigDaoExt) MapperUtil.getObjectMapping(vendorConfigAddDto,
				new VendorConfigDaoExt());
		VendorDao vendor = vendorRepository.findByVendorCode(vendorCode);
		if (vendor == null) {
			throw new ServiceException(VENDOR_ERR_MSG, ERR_INT_015);
		}

		vendorConfigDao.setVendor(vendor);
		vendorConfigDao.setConfigDetails(MapperUtil.getJsonString(vendorConfigAddDto.getConfigDetails()));
		VendorConfigDaoExt savedVendoConfig = vendorConfigRepository.save(vendorConfigDao);
		VendorConfigDto newVendorConfigDto = (VendorConfigDto) MapperUtil.getObjectMapping(savedVendoConfig,
				new VendorConfigDto());
		newVendorConfigDto.setVendorCode(vendorCode);
		newVendorConfigDto.setConfigDetails(MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(savedVendoConfig.getConfigDetails()), JsonData.class));
		newVendorConfigDto
				.setConnectionDetails(MapperUtil.getJsonFromString(savedVendoConfig.getConnectionDetails()).toString());

		return newVendorConfigDto;
	}

	/**
	 * Update vendor config.
	 *
	 * @param configId              the config id
	 * @param vendorConfigUpdateDto the vendor config update dto
	 * @return the vendor config dto
	 */
	@Override
	@Transactional
	public VendorConfigDto updateVendorConfig(String configId, VendorConfigAddDto vendorConfigUpdateDto) {
		Optional<VendorConfigDaoExt> vendorConfigOptional = vendorConfigRepository.findById(configId);
		if (!vendorConfigOptional.isPresent()) {
			throw new ServiceException("Vendor config not present", ERR_INT_013);
		}
		BaseFieldsValidator ruleDto = vendorConfigFactory
				.getVendorConfig(vendorConfigOptional.get().getVendor().getVendorCode());
		ruleDto.validate(vendorConfigUpdateDto.getConfigDetails());
		vendorConfigOptional.get().setConfigDetails(MapperUtil.getJsonString(vendorConfigUpdateDto.getConfigDetails()));
		VendorConfigDaoExt updatedVendorConfigDao = (VendorConfigDaoExt) MapperUtil
				.getObjectMapping(vendorConfigUpdateDto, vendorConfigOptional.get());
		VendorConfigDaoExt savedVendorConfigDao = vendorConfigRepository.save(updatedVendorConfigDao);
		VendorConfigDto newVendorConfigDto = (VendorConfigDto) MapperUtil.getObjectMapping(savedVendorConfigDao,
				new VendorConfigDto());
		newVendorConfigDto.setVendorCode(savedVendorConfigDao.getVendor().getVendorCode());
		newVendorConfigDto.setConfigDetails(MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(savedVendorConfigDao.getConfigDetails()), JsonData.class));
		newVendorConfigDto.setConnectionDetails(
				MapperUtil.getJsonFromString(savedVendorConfigDao.getConnectionDetails()).toString());

		return newVendorConfigDto;
	}

	@Override
	public PagedRestResponse<Object> getAllVendorConfigurations(String vendorCode, String locationCode,
			Boolean isActive, Pageable pageable) {
		if (!StringUtils.isEmpty(locationCode)) {
			validateLocationCode(locationCode);
		}
		Page<VendorConfigDaoExt> vendorConfigDaoList = findAllStockRequestsByCriteria(
				vendorCode, locationCode, isActive, pageable);
		if (vendorConfigDaoList.isEmpty()) {
			throw new ServiceException(VENDOR_ERR_MSG, "ERR-INT-059");
		}
		if (vendorCode.equalsIgnoreCase(VendorCodeEnum.PAYMENT_AIRPAY.toString())) {
			return new PagedRestResponse<>(
					vendorConfigDaoList.stream().map(this::mapAirpayConfigDto).collect(Collectors.toList()),
					vendorConfigDaoList);
		} else if (vendorCode.equalsIgnoreCase(VendorCodeEnum.QC_GC.toString())) {
			return new PagedRestResponse<>(
					vendorConfigDaoList.stream().map(this::mapQcgcConfigDto).collect(Collectors.toList()),
					vendorConfigDaoList);
		} else if (vendorCode.equalsIgnoreCase(VendorCodeEnum.PAYMENT_RAZORPAY.toString())) {
			return new PagedRestResponse<>(
					vendorConfigDaoList.stream().map(this::mapRazorpayConfigDto).collect(Collectors.toList()),
					vendorConfigDaoList);
		} else {
			throw new ServiceException("Invalid vendor code", ERR_INT_015);
		}
	}

	private QcgcConfigDto mapQcgcConfigDto(VendorConfigDaoExt vendorConfig) {

		ObjectMapper mapper = new ObjectMapper();
		String terminalId = null;
		try {
			JsonNode root = mapper.readTree(vendorConfig.getConfigDetails());
			JsonNode dataNode = root.path("data");
			terminalId = dataNode.get("TerminalId").asText();
		} catch (IOException e) {
			throw new ServiceException("Exception while parsing json data", "ERR-INT-058");
		}
		QcgcConfigDto qcgcConfigResponseDto = new QcgcConfigDto();
		qcgcConfigResponseDto.setTerminalId(terminalId);
		qcgcConfigResponseDto.setLocationCode(vendorConfig.getLocationCode());
		return qcgcConfigResponseDto;
	}

	private RazorpayConfigResponseDto mapRazorpayConfigDto(VendorConfigDaoExt vendorConfig) {

		ObjectMapper mapper = new ObjectMapper();
		String accountId = null;
		try {
			JsonNode root = mapper.readTree(vendorConfig.getConfigDetails());
			JsonNode dataNode = root.path("data");
			accountId = dataNode.get("accountId").asText();
		} catch (IOException e) {
			throw new ServiceException("Exception while parsing json data", "ERR-INT-058");
		}
		RazorpayConfigResponseDto razorpayConfigResponseDto = new RazorpayConfigResponseDto();
		razorpayConfigResponseDto.setAccountId(accountId);
		razorpayConfigResponseDto.setLocationCode(vendorConfig.getLocationCode());
		return razorpayConfigResponseDto;
	}

	private AirpayConfigPropertiesDto mapAirpayConfigDto(VendorConfigDaoExt vendorConfig) {

		JsonData jsonData = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendorConfig.getConfigDetails()), JsonData.class);
		AirpayConfigPropertiesDto airpayConfigResponseDto = MapperUtil.mapObjToClass(jsonData.getData(),
				AirpayConfigPropertiesDto.class);

		// decrypting password
		airpayConfigResponseDto.setPassword(
				CryptoUtil.decrypt(airpayConfigResponseDto.getPassword(), CommonConstants.PASS_WORD, false));
		airpayConfigResponseDto.setLocationCode(vendorConfig.getLocationCode());
		return airpayConfigResponseDto;
	}

	private Page<VendorConfigDaoExt> findAllStockRequestsByCriteria(String vendorCode, String locationCode,
			Boolean isActive, Pageable pageable) {
		return vendorConfigRepository.findAllLocation(locationCode, vendorCode, isActive, pageable);
	}

	private Example<VendorConfigDaoExt> generateCriteriaToListVendorConfigs(String vendorCode, String locationCode) {
		VendorDao vendor = vendorRepository.findByVendorCode(vendorCode);
		if (vendor == null) {
			throw new ServiceException(VENDOR_ERR_MSG, ERR_INT_015);
		}
		VendorConfigDaoExt vendorConfig = new VendorConfigDaoExt();
		vendorConfig.setVendor(vendor);
		vendorConfig.setIsActive(true);
		vendorConfig.setLocationCode(locationCode);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		return Example.of(vendorConfig, matcher);
	}

	private void validateLocationCode(String locationCode) {
		engineServiceClient.getStoreLocation(locationCode);
	}

}
