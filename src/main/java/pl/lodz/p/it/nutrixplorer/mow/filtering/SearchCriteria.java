package pl.lodz.p.it.nutrixplorer.mow.filtering;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchCriteria {
    private List<String> filterKeys;
    private Object value;
    private SearchOperation operation;

    public SearchCriteria(String filterKey, SearchOperation operation,
                          Object value) {
        this.filterKeys = new ArrayList<>();
        this.filterKeys.add(filterKey);
        this.operation = operation;
        this.value = value;
    }

    public SearchCriteria(List<String> keys, SearchOperation operation,
                          Object value) {
        this.filterKeys = keys;
        this.operation = operation;
        this.value = value;
    }
}