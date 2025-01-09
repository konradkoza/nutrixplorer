package pl.lodz.p.it.nutrixplorer.configuration;

import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.Nullable;
import org.springframework.transaction.TransactionExecution;
import org.springframework.transaction.TransactionExecutionListener;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import pl.lodz.p.it.nutrixplorer.utils.SecurityContextUtil;

import java.util.UUID;

@Slf4j
public class TransactionListener implements TransactionExecutionListener {

    ThreadLocal<String> id = new ThreadLocal<>();

    @Override
    public void afterBegin(TransactionExecution transaction, @Nullable Throwable beginFailure) {
        id.set(UUID.randomUUID().toString());
        log.info("Transaction with id: {} started by user with id {}, called from method: {}, isolation level: {}",
                id.get(), SecurityContextUtil.getCurrentUser(), transaction.getTransactionName(), TransactionSynchronizationManager.getCurrentTransactionIsolationLevel());
//        log.info("Transaction isNested: {}", transaction.isNested());
    }

    @Override
    public void afterCommit(TransactionExecution transaction, @Nullable Throwable commitFailure) {
        log.info("Transaction {} committed, by user with id:  {}, isolation level: {}",
                id.get(), SecurityContextUtil.getCurrentUser(), TransactionSynchronizationManager.getCurrentTransactionIsolationLevel());
    }

    @Override
    public void afterRollback(TransactionExecution transaction, @Nullable Throwable rollbackFailure) {
        log.info("Transaction {} rolled back: {}, by user with id: {}, isolation level: {}",
                id.get(), transaction.getTransactionName(), SecurityContextUtil.getCurrentUser(), TransactionSynchronizationManager.getCurrentTransactionIsolationLevel());

        log.error("Rollback cause: {}", rollbackFailure != null ? rollbackFailure.getCause() : "No cause");
        log.error("Rollback cause: {}", rollbackFailure != null ? rollbackFailure.getMessage() : "No message");
        log.error("Rollback cause: ", rollbackFailure);
    }
}
