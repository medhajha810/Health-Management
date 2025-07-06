access(all) contract HealthRecords {

    access(all) resource HealthRecord {
        access(all) let id: UInt64
        access(all) let dataRef: String // IPFS or encrypted data reference
        access(all) var sharedWith: {Address: Bool}

        init(_id: UInt64, _dataRef: String) {
            self.id = _id
            self.dataRef = _dataRef
            self.sharedWith = {}
        }

        access(all) fun shareWith(addr: Address) {
            self.sharedWith[addr] = true
        }

        access(all) fun revokeAccess(addr: Address) {
            self.sharedWith[addr] = false
        }
    }

    access(all) var nextId: UInt64
    access(all) var records: @{UInt64: HealthRecord}

    access(all) event RecordCreated(id: UInt64, owner: Address, dataRef: String)
    access(all) event RecordShared(id: UInt64, sharedWith: Address)
    access(all) event RecordRevoked(id: UInt64, revokedFrom: Address)

    // --- Health Challenge Section ---
    access(all) var dailyChallenge: String
    access(all) event ChallengeSet(challenge: String)

    access(all) fun setDailyChallenge(challenge: String) {
        self.dailyChallenge = challenge
        emit ChallengeSet(challenge: challenge)
    }

    access(all) fun getDailyChallenge(): String {
        return self.dailyChallenge
    }

    // --- NFT-like User Collection Section ---
    access(all) resource HealthRecordCollection {
        access(all) var ownedRecords: @{UInt64: HealthRecord}

        init() {
            self.ownedRecords <- {}
        }

        access(all) fun deposit(record: @HealthRecord) {
            let id = record.id
            self.ownedRecords[id] <-! record
        }

        access(all) fun withdraw(id: UInt64): @HealthRecord {
            let record <- self.ownedRecords.remove(key: id) ?? panic("No record with that ID")
            return <- record
        }

        access(all) fun getIDs(): [UInt64] {
            return self.ownedRecords.keys
        }

        access(all) fun borrowRecord(id: UInt64): &HealthRecord {
            return (&self.ownedRecords[id] as &HealthRecord?)!
        }
    }

    access(all) fun mintRecord(dataRef: String): UInt64 {
        let id = self.nextId
        let record <- create HealthRecord(_id: id, _dataRef: dataRef)
        self.records[id] <-! record
        self.nextId = id + 1
        emit RecordCreated(id: id, owner: 0x0, dataRef: dataRef)
        return id
    }

    access(all) fun createRecord(dataRef: String): UInt64 {
        let id = self.nextId
        let record <- create HealthRecord(_id: id, _dataRef: dataRef)
        self.records[id] <-! record
        self.nextId = id + 1
        emit RecordCreated(id: id, owner: 0x0, dataRef: dataRef)
        return id
    }

    access(all) fun shareRecord(id: UInt64, addr: Address) {
        let record = (&self.records[id] as &HealthRecord?)!
        record.shareWith(addr: addr)
        emit RecordShared(id: id, sharedWith: addr)
    }

    access(all) fun revokeRecord(id: UInt64, addr: Address) {
        let record = (&self.records[id] as &HealthRecord?)!
        record.revokeAccess(addr: addr)
        emit RecordRevoked(id: id, revokedFrom: addr)
    }

    init() {
        self.nextId = 1
        self.records <- {}
        self.dailyChallenge = "Drink 8 glasses of water today!"
    }
} 