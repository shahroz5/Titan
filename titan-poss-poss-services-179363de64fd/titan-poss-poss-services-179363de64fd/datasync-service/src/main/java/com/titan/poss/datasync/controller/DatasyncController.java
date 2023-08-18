/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.controller;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.dto.HeartBeatDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageTransferData;
import com.titan.poss.core.dto.OnlineStatusDto;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.dto.DatasyncAuditMessageResponseDto;
import com.titan.poss.datasync.dto.DatasyncAuditResponseDto;
import com.titan.poss.datasync.dto.DatasyncMessageRequestDto;
import com.titan.poss.datasync.dto.DatasyncStatusCountDto;
import com.titan.poss.datasync.dto.DatasyncStatusRequestDto;
import com.titan.poss.datasync.dto.MessageRequestStatusEnum;
import com.titan.poss.datasync.dto.MessageStatusDto;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.facade.ConsumeFacade;
import com.titan.poss.datasync.facade.PublishFacade;
import com.titan.poss.datasync.service.DatasyncAuditService;

import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping(value = "datasync/v2")
public class DatasyncController {

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Autowired
	PublishFacade publishFacade;

	@Value("${aws.sqs.profile}")
	private String appLocation;

	@Autowired
	private ConsumeFacade consumeFacade;

	@ApiOperation(value = "Publishing Message to Queue", notes = "This Api publishes the message containing datasyc data to destination Queue")
	@PostMapping(value = "/publish")
	public void publish(@Valid @RequestBody MessageRequest messageRequest)
			throws InterruptedException, ExecutionException {

		publishFacade.publishMessage(messageRequest);

	}

	@PostMapping(value = "/receive")
	public void receive(@RequestBody @Valid MessageRequest messageRequest) {

		String id = UUID.randomUUID().toString();
		MessageTransfer messageTransfer = convertToMessageTransfer(messageRequest, id);
		consumeFacade.consumeMessage(messageTransfer);
	}

	private MessageTransfer convertToMessageTransfer(MessageRequest messageRequest, String id) {
		MessageTransfer messageTransfer = new MessageTransfer();
		MessageTransferData data = new MessageTransferData();
		MapperUtil.beanMapping(messageRequest.getMessageRequestData(), data);
		data.setId(id);
		data.setSource(appLocation);
		messageTransfer.setMessageTransferData(data);
		messageTransfer.setMessageType(messageRequest.getMessageType());
		return messageTransfer;
	}

	@ApiOperation(value = "Check heart beat of Eposs", notes = "This Api checks if EPOSS is online")
	@PostMapping(value = "/heartbeat")
	public void heartBeat(@Valid @RequestBody HeartBeatDto heartBeatDto) {

		datasyncAuditService.updateSyncTime(heartBeatDto.getLocationCode());

	}

	@ApiOperation(value = "Check Online status of Boutique", notes = "This Api checks POSS is Online")
	@PostMapping(value = "/onlinecheck")
	public OnlineStatusDto getLocationSyncStatus(@Valid @RequestBody HeartBeatDto heartBeatDto) {

		return datasyncAuditService.getOnlineStatus(heartBeatDto.getLocationCode());

	}

	@ApiOperation(value = "Get count By Message Type", notes = "Lists number of messages for the particular day grouped by message status")
	@PostMapping(value = "/message/status/count")
	public List<DatasyncStatusCountDto> getCount(
			@Valid @RequestBody DatasyncStatusRequestDto datasyncStatusRequestDto) {

		return datasyncAuditService.getStatusCount(datasyncStatusRequestDto);

	}

	@ApiOperation(value = "Get list of Message", notes = "Lists number of messages for the particular day grouped by message status")
	@PostMapping(value = "/message")
	@ApiPageable
	public PagedRestResponse<DatasyncAuditResponseDto> listMessage(
			@Valid @RequestBody DatasyncMessageRequestDto datasyncMessageRequest, @ApiIgnore Pageable pageable) {

		return new PagedRestResponse<>(datasyncAuditService.listMessage(datasyncMessageRequest, pageable));

	}

	@ApiOperation(value = "Get message ", notes = "Get the message by message id and the destination location code")
	@GetMapping(value = "/message/{destination}/{messageid}")
	public DatasyncAuditMessageResponseDto getMessage(@PathVariable String destination,
			@PathVariable String messageid) {

		return datasyncAuditService.getMessage(messageid, destination);

	}

	@ApiOperation(value = "Retry the Job", notes = "This retry the datasync sync job")
	@PutMapping(value = "/message/{destination}/{messageid}")
	public void retryMessageSync(@PathVariable String destination, @PathVariable String messageid) {

		datasyncAuditService.retryMessageSync(messageid, destination);

	}

	@ApiOperation(value = "List message status", notes = "Get the list of available message status")
	@GetMapping(value = "/message/status")
	public MessageStatusDto getStatusValues() {
		MessageStatusDto ms = new MessageStatusDto();
		ms.setStatus(Arrays.asList(MessageRequestStatusEnum.values()));
		return ms;
	}
}
