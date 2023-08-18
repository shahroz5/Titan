package com.titan.poss.sales.dto.response;

import com.titan.poss.datasync.dto.SyncStagingDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerStaggingResponse {
 private CustomerResDto customerResDto;
 private SyncStagingDto staggingDto;
}
