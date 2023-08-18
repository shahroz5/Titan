package com.titan.poss.integration.dto;

import java.util.Date;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DbBackupAuditDto {
	private String fileName;
	private Integer version;
	private String status;
	private Date startTime;
	private Date endTime;
}
