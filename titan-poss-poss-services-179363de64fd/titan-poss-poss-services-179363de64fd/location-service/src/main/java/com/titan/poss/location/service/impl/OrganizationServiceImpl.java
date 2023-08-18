/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.ProductOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.location.dao.OrganizationDao;
import com.titan.poss.location.dao.SyncStaging;
import com.titan.poss.location.dto.OrgDto;
import com.titan.poss.location.dto.OrganizationSyncDto;
import com.titan.poss.location.dto.request.OrgUpdateDto;
import com.titan.poss.location.repository.LocationSyncStagingRepository;
import com.titan.poss.location.repository.OrganizationRepositoryExt;
import com.titan.poss.location.service.OrganizationService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("organizationService")
public class OrganizationServiceImpl implements OrganizationService {

	private static final String ERR_PRO_023 = "ERR-PRO-023";

	private static final String NO_ORGANIZATION_DETAILS_FOUND_FOR_THE_REQUESTED_ORGCODE = "No Organization details found for the requested orgCode";

	private static final String ERR_PRO_024 = "ERR-PRO-024";

	private static final String ORG_CODE_IS_ALREADY_AVAILABLE = "OrgCode is already available";

	@Autowired
	private OrganizationRepositoryExt orgRepository;

	@Autowired
	private LocationSyncDataServiceImpl syncDataService;

	@Autowired
	private LocationSyncStagingRepository locationSyncStagingRepository;

	@Autowired
	private OrganizationServiceImpl organizationService;

	/**
	 * This method will return the list of Organization details based on the
	 * isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<OrgDto>>
	 */
	@Override
	public PagedRestResponse<List<OrgDto>> listOrganization(Boolean isActive, Pageable pageable) {

		OrganizationDao orgCriteria = new OrganizationDao();
		orgCriteria.setIsActive(isActive);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<OrganizationDao> criteria = Example.of(orgCriteria, matcher);

		Page<OrganizationDao> orgList = orgRepository.findAll(criteria, pageable);

		List<OrgDto> orgDtoList = new ArrayList<>();

		orgList.forEach(org -> {

			OrgDto orgDto = (OrgDto) MapperUtil.getObjectMapping(org, new OrgDto());

			orgDtoList.add(getOrgDepends(org, orgDto));

		});

		return (new PagedRestResponse<>(orgDtoList, orgList));
	}

	/**
	 * This method will return the Organization details based on the orgCode.
	 * 
	 * @param orgCode
	 * @return OrgDto
	 */
	@Override
	public OrgDto getOrganization(String orgCode) {

		OrganizationDao org = orgRepository.findOneByOrgCode(orgCode);

		if (org == null) {
			throw new ServiceException(NO_ORGANIZATION_DETAILS_FOUND_FOR_THE_REQUESTED_ORGCODE, ERR_PRO_023);
		}

		OrgDto orgDto = (OrgDto) MapperUtil.getObjectMapping(org, new OrgDto());

		return getOrgDepends(org, orgDto);

	}

	/**
	 * This method will add the Organization depends to the OrgDto from the
	 * Organization and returns OrgDto.
	 * 
	 * @param org
	 * @param orgDto
	 * @return OrgDto
	 */
	private OrgDto getOrgDepends(OrganizationDao org, OrgDto orgDto) {

		try {

			orgDto.setParentOrgCode(org.getParentOrganization().getOrgCode());

		} catch (NullPointerException e) {

			orgDto.setParentOrgCode("");

		}

		return orgDto;

	}

	/**
	 * This method will save the Organization details.
	 * 
	 * @param orgDto
	 * @return OrgDto
	 */
	@Override
	public OrgDto addOrganization(OrgDto orgDto) {

		OrganizationDao org = orgRepository.findOneByOrgCode(orgDto.getOrgCode());

		if (org != null) {
			throw new ServiceException(ORG_CODE_IS_ALREADY_AVAILABLE, ERR_PRO_024);
		}

		if (orgDto.getParentOrgCode() == null)
			orgDto.setParentOrgCode(orgDto.getOrgCode());

		org = (OrganizationDao) MapperUtil.getObjectMapping(orgDto, new OrganizationDao());
		org.setSrcSyncId(0);
		org.setDestSyncId(0);
		SyncStagingDto data = organizationService.saveOrgToDB(org, orgDto, ProductOperationCodes.ORGANIZATION_ADD);

		// Publishing to data sync queue
		syncDataService.publishLocationMessagesToQueue(data);

		return orgDto;

	}

	/**
	 * This method will add the Organization depends to the Organization from the
	 * OrgDto and returns Organization.
	 * 
	 * @param org
	 * @param orgDto
	 * @return Organization
	 */
	private OrganizationDao addOrgDepends(OrganizationDao org, OrgDto orgDto) {

		String parentOrgCode = orgDto.getParentOrgCode();

		if (parentOrgCode != null && parentOrgCode.length() > 0) {

			OrganizationDao parentOrganization = new OrganizationDao();
			parentOrganization.setOrgCode(parentOrgCode);

			org.setParentOrganization(parentOrganization);

		} else {

			if (parentOrgCode != null && parentOrgCode.length() == 0) {

				org.setParentOrganization(null);

			}

		}

		return org;

	}

	/**
	 * This method will update the Organization details.
	 * 
	 * @param orgCode
	 * @param orgUpdateDto
	 * @return OrgDto
	 */
	@Override
	public OrgDto updateOrganization(String orgCode, OrgUpdateDto orgUpdateDto) {

		OrganizationDao org = orgRepository.findOneByOrgCode(orgCode);

		if (org == null) {
			throw new ServiceException(NO_ORGANIZATION_DETAILS_FOUND_FOR_THE_REQUESTED_ORGCODE, ERR_PRO_023);
		}

		org = (OrganizationDao) MapperUtil.getObjectMapping(orgUpdateDto, org);

		org.setSrcSyncId(org.getSrcSyncId() + 1);

		OrgDto orgDto = (OrgDto) MapperUtil.getObjectMapping(org, new OrgDto());
		SyncStagingDto data = organizationService.saveOrgToDB(org, orgDto, ProductOperationCodes.ORGANIZATION_UPDATE);
		syncDataService.publishLocationMessagesToQueue(data);
		return getOrgDepends(org, orgDto);
	}

	/**
	 * @param orgDto
	 * @return
	 */
	@Transactional
	public SyncStagingDto saveOrgToDB(OrganizationDao orgDao, OrgDto orgDto, String operation) {
		OrganizationDao savedOrg = orgRepository.save(addOrgDepends(orgDao, orgDto));
		List<SyncData> orgSyncDataList = new ArrayList<>();
		OrganizationSyncDto orgSyncDto = new OrganizationSyncDto(savedOrg);
		orgSyncDataList.add(DataSyncUtil.createSyncData(orgSyncDto, 0));
		List<String> destinations = new ArrayList<>();
		MessageRequest orgMsgRequest = DataSyncUtil.createMessageRequest(orgSyncDataList, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(orgMsgRequest);
		SyncStagingDto orgSyncStagingDto = new SyncStagingDto();
		orgSyncStagingDto.setMessageRequest(orgMsgRequest);
		// saving to staging table
		SyncStaging orgStaggingMsg = new SyncStaging();
		orgStaggingMsg.setMessage(requestBody);
		orgStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		orgStaggingMsg = locationSyncStagingRepository.save(orgStaggingMsg);
		orgSyncStagingDto.setId(orgStaggingMsg.getId());
		return orgSyncStagingDto;
	}

}
