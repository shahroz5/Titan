package com.titan.poss.sales.dao;

import java.util.List;

import javax.persistence.MappedSuperclass;


import lombok.Data;
import lombok.EqualsAndHashCode;
@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class CmForEpossResponseDto {

	private List<CashMemoDetailsDao> cmList;

	
}
