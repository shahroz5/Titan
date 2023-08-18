package com.titan.poss.inventory.dto.request;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import lombok.Data;

@Data
public class InventoryStageBinUpdateDto {

	@NotEmpty(message = "bin transfer items cannot be empty")
	@Size(max = 50, message = "cannot transfer more than 50 items")
	private List<@Valid StageBinItemDto> stageBinItems;
}
