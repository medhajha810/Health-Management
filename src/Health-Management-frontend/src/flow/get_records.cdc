// Script: get_records.cdc
import HealthRecords from 0xHealthRecords

access(all) fun main(address: Address): [{UInt64: String}] {
  let collectionRef = getAccount(address)
    .capabilities
    .borrow<&HealthRecords.HealthRecordCollection>(/public/HealthRecordCollection)
    ?? panic("Could not borrow HealthRecordCollection capability")
  let ids = collectionRef.getIDs()
  let records: [{UInt64: String}] = []
  for id in ids {
    let record = collectionRef.borrowRecord(id: id)
    records.append({id: record.dataRef})
  }
  return records
}