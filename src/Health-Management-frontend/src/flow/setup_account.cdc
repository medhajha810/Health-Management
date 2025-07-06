// Transaction: setup_account.cdc
import HealthRecords from 0xHealthRecords

transaction {
  prepare(account: auth(Storage, Capabilities) &Account) {
    if account.storage.borrow<&HealthRecords.HealthRecordCollection>(from: /storage/HealthRecordCollection) == nil {
      account.storage.save(<- HealthRecords.createHealthRecordCollection(), to: /storage/HealthRecordCollection)
      let cap = account.capabilities.storage.issue<&HealthRecords.HealthRecordCollection>(/storage/HealthRecordCollection)
      account.capabilities.publish(cap, at: /public/HealthRecordCollection)
    }
  }
} 