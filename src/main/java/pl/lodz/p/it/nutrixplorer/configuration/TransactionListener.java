package pl.lodz.p.it.nutrixplorer.configuration;

import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.Nullable;
import org.springframework.transaction.TransactionExecution;
import org.springframework.transaction.TransactionExecutionListener;
import pl.lodz.p.it.nutrixplorer.utils.SecurityContextUtil;

@Slf4j
public class TransactionListener implements TransactionExecutionListener {

    @Override
    public void beforeBegin(TransactionExecution transaction) {
        log.info("Transaction started: {}", transaction.getTransactionName());
        log.info("Transaction isNested: {}", transaction.isNested());
        log.info("Transaction called by user: {}", SecurityContextUtil.getCurrentUser());
    }

    @Override
    public void afterCommit(TransactionExecution transaction, @Nullable Throwable commitFailure) {
        log.info("Transaction committed: {}, by user {}", transaction.getTransactionName(), SecurityContextUtil.getCurrentUser());
    }

    @Override
    public void afterRollback(TransactionExecution transaction, @Nullable Throwable rollbackFailure) {
        log.info("Transaction rolled back: {}, by user {}", transaction.getTransactionName(), SecurityContextUtil.getCurrentUser());
        log.error("Rollback failure: ", rollbackFailure);
    }
}
