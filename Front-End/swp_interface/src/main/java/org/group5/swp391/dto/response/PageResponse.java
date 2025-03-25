package org.group5.swp391.dto.response;

import lombok.*;

import java.util.List;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PageResponse<T> {
    private Integer pageNo;
    private Integer pageSize;
    private Long totalPages;
    private List<T> data;
}
