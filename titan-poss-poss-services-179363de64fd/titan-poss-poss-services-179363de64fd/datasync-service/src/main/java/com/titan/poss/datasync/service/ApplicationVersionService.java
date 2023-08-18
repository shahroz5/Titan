/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.dto.ApplicationVersionDto;
import com.titan.poss.core.enums.ApplicationVersionStatusEnum;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.datasync.dto.AppVersionList;
import com.titan.poss.datasync.dto.ApplicationVersionRequestDto;
import com.titan.poss.datasync.dto.ApplicationVersionSearchDto;
import com.titan.poss.datasync.dto.ApplicationVersionUpgradeDTO;

/**
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface ApplicationVersionService {

	public List<ApplicationVersionDto> getAppVersion(List<String> statusList,String locCode);

	/*
	 * public PagedRestResponse<ApplicationVersionDto> listAppVersion(
	 * ApplicationVersionSearchDto applicationVersionSearchDto, Pageable pageable);
	 */

	public ApplicationVersionDto addAppVersion(ApplicationVersionRequestDto applicationVersionRequestDto);

	public List<ApplicationVersionUpgradeDTO> updateAppVersion(List<String> id, String status);

	public void deleteAppVersion(String id);

	public void publishAppVersion();

	public List<AppVersionList> listAppVersion();
}
