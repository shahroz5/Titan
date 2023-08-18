package com.titan.poss.user.dto.response;

import java.util.List;

import com.titan.poss.datasync.dto.SyncStagingDto;

import lombok.Data;

/**
*
* 
* @author Mindtree Ltd.
* @version 1.0
*/
@Data
public class PublishResponse {
	private Object apiResponse;
	private List<SyncStagingDto> syncStagingDtoList;
}
