// Transaction: mint_record.cdc
import HealthRecords from 0xHealthRecords

transaction(dataRef: String) {
  prepare(acct: AuthAccount) {
    HealthRecords.mintRecord(account: acct, dataRef: dataRef)
  }
} 