package com.titan.poss.datasync.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class ApplicationVersionUpgradeDTO {
	private String versionId;
	private String versionUpgradeMessage;
}
