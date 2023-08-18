/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.controller;

import java.util.Arrays;
import java.util.List;

import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.acl.DatasyncAccessControls;
import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.dto.ApplicationVersionDto;
import com.titan.poss.core.enums.ApplicationVersionStatusEnum;
import com.titan.poss.datasync.dto.AppVersionList;
import com.titan.poss.datasync.dto.ApplicationVersionRequestDto;
import com.titan.poss.datasync.dto.ApplicationVersionStatusDto;
import com.titan.poss.datasync.dto.ApplicationVersionUpgradeDTO;
import com.titan.poss.datasync.service.ApplicationVersionService;

import io.swagger.annotations.ApiOperation;

/**
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RestController("ApplicationVersionController")
@RequestMapping(value = "datasync/v2")
public class ApplicationVersionController {

	@Autowired
	ApplicationVersionService applicationVersionService;

	private static final String VERSION_UPGRADE_ADD_EDIT_VIEW = START + DatasyncAccessControls.VERSION_UPGRADE_ADD_EDIT + END + OR + START + DatasyncAccessControls.VERSION_UPGRADE_VIEW + END;

	@ApiOperation(value = "Get application versions", notes = "Gets the UI,Service and Database version of current runnning application and new versions")
	@GetMapping(value = {"/app-version/{status}/{loccode}","/app-version"})
	@PreAuthorize(IS_STORE_USER + AND + VERSION_UPGRADE_ADD_EDIT_VIEW )
	public List<ApplicationVersionDto> getApplicationVersion(@PathVariable(name = "status", required = false) List<String> statusList,@PathVariable(name="loccode",required = false) String locCode) {

		return applicationVersionService.getAppVersion(statusList,locCode);
	}
	/*
	 * @ApiOperation(value = "Lists application version by Status", notes =
	 * "Gets the List of UI,Service and Database version of applications of POSS and EPOSS based on Status."
	 * +
	 * "This API is used in EPOSS to list and monitor the versions available in all offline Boutique"
	 * )
	 *
	 * @PostMapping(value = "/app-version/all")
	 *
	 * @ApiPageable public PagedRestResponse<ApplicationVersionDto>
	 * listApplicationVersion(
	 *
	 * @Valid @RequestBody ApplicationVersionSearchDto
	 * applicationVersionSearchDto, @ApiIgnore Pageable pageable) { return
	 * applicationVersionService.listAppVersion(applicationVersionSearchDto,
	 * pageable);
	 *
	 * }
	 */

	@ApiOperation(value = "Add new application version", notes = "Adds new application version details in EPOSS. "
			+ "It will create unique record for each offline location selected"
			+ "After successful save in EPOSS same will be synced to Respective Boutique")
	@PostMapping(value = "/app-version")
	public void addApplicationVersion(@RequestBody ApplicationVersionRequestDto applicationVersionRequestDto) {

		applicationVersionService.addAppVersion(applicationVersionRequestDto);
	}

	@ApiOperation(value = "update application version", notes = "Updates status of application version. If this called from EPOSS status will change to INACTIVE"
			+ "If this called from POSS status will change to ACTIVE and Previous version with ACTIVE will become INACTIVE")
	@PutMapping(value = {"/app-version/{id}/{status}","/app-version"})
	public List<ApplicationVersionUpgradeDTO> updateApplicationVersion(@PathVariable(required = false) List<String> id,@PathVariable(required =false) String status) {

		return applicationVersionService.updateAppVersion(id, status);
	}

	@ApiOperation(value = "delete application version", notes = "deletes application version. ")
	@DeleteMapping(value = "/app-version/{id}")
	public void deleteApplicationVersion(@PathVariable String id) {

		applicationVersionService.deleteAppVersion(id);
	}

	@ApiOperation(value = "List app-version status", notes = "Get the list of available app-version status")
	@GetMapping(value = "/app-version/status")
	public ApplicationVersionStatusDto getStatusValues() {
		ApplicationVersionStatusDto as = new ApplicationVersionStatusDto();
		as.setStatus(Arrays.asList(ApplicationVersionStatusEnum.values()));
		return as;
	}

	@ApiOperation(value = "Publish to Boutiques", notes = "Pushes new version to Boutiques")
	@PostMapping(value = "/app-version/publish")
	public void publishApplicationVersion() {

		applicationVersionService.publishAppVersion();
	}

	@ApiOperation(value = "list all application versions", notes = "lists all available versions of all the applications")
	@GetMapping(value = "/app-version/list")
	public List<AppVersionList> listApplicationVersion() {

		return applicationVersionService.listAppVersion();
	}

}
