package com.titan.poss.core.dto;

import java.util.Date;



import lombok.Data;

@Data
public class DiscountItemMapiingDto {
	
	private String id;
	
	private String discount;
	
	private String itemCode;

	private String lotNumber;

	private String locationCode;

	private Date startDate;

	private Date endDate;

	private Date previewStartDate;

	private Date previewEndDate;

	private Boolean isTransferredLocation;

	private Boolean isPreviewApplicable;

	private String regularConfigDetails;

	private String previewConfigDetails;

	private String correlationId;

	private Integer srcSyncId;

	private Integer destSyncId;

}
