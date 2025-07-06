pub contract HealthRecords {

    pub resource HealthRecord {
        pub let id: UInt64
        pub let owner: Address
        pub let dataRef: String // IPFS or encrypted data reference
        pub var sharedWith: {Address: Bool}

        init(_id: UInt64, _owner: Address, _dataRef: String) {
            self.id = _id
            self.owner = _owner
            self.dataRef = _dataRef
            self.sharedWith = {}
        }

        pub fun shareWith(addr: Address) {
            self.sharedWith[addr] = true
        }

        pub fun revokeAccess(addr: Address) {
            self.sharedWith[addr] = false
        }
    }

    pub var nextId: UInt64
    pub var records: @{UInt64: HealthRecord}

    pub event RecordCreated(id: UInt64, owner: Address, dataRef: String)
    pub event RecordShared(id: UInt64, sharedWith: Address)
    pub event RecordRevoked(id: UInt64, revokedFrom: Address)

    // --- Health Challenge Section ---
    pub var dailyChallenge: String
    pub event ChallengeSet(challenge: String)

    pub fun setDailyChallenge(challenge: String) {
        self.dailyChallenge = challenge
        emit ChallengeSet(challenge: challenge)
    }

    pub fun getDailyChallenge(): String {
        return self.dailyChallenge
    }

    // --- NFT-like User Collection Section ---
    pub resource HealthRecordCollection {
        pub var ownedRecords: @{UInt64: HealthRecord}

        init() {
            self.ownedRecords <- {}
        }

        pub fun deposit(record: @HealthRecord) {
            let id = record.id
            self.ownedRecords[id] <-! record
        }

        pub fun withdraw(id: UInt64): @HealthRecord {
            let record <- self.ownedRecords.remove(key: id) ?? panic("No record with that ID")
            return <- record
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedRecords.keys
        }

        pub fun borrowRecord(id: UInt64): &HealthRecord {
            return &self.ownedRecords[id] as &HealthRecord
        }
    }

    pub fun setupAccount(account: AuthAccount) {
        if account.borrow<&HealthRecordCollection>(from: /storage/HealthRecordCollection) == nil {
            account.save(<- create HealthRecordCollection(), to: /storage/HealthRecordCollection)
            account.link<&HealthRecordCollection{PublicHealthRecordCollection}>(/public/HealthRecordCollection, target: /storage/HealthRecordCollection)
        }
    }

    pub resource interface PublicHealthRecordCollection {
        pub fun getIDs(): [UInt64]
        pub fun borrowRecord(id: UInt64): &HealthRecord
    }

    pub fun mintRecord(account: AuthAccount, dataRef: String): UInt64 {
        let id = self.nextId
        let record <- create HealthRecord(_id: id, _owner: account.address, _dataRef: dataRef)
        let collection = account.borrow<&HealthRecordCollection>(from: /storage/HealthRecordCollection)
            ?? panic("Collection not found. Did you run setupAccount?")
        collection.deposit(record: <- record)
        self.nextId = self.nextId + 1
        emit RecordCreated(id: id, owner: account.address, dataRef: dataRef)
        return id
    }

    init() {
        self.nextId = 1
        self.records <- {}
        self.dailyChallenge = "Drink 8 glasses of water today!"
    }

    pub fun createRecord(dataRef: String): UInt64 {
        let id = self.nextId
        let record <- create HealthRecord(_id: id, _owner: AuthAccount(payer: self.account).address, _dataRef: dataRef)
        self.records[id] <-! record
        self.nextId = self.nextId + 1
        emit RecordCreated(id: id, owner: AuthAccount(payer: self.account).address, dataRef: dataRef)
        return id
    }

    pub fun shareRecord(id: UInt64, addr: Address) {
        let record = &self.records[id] as &HealthRecord
        record.shareWith(addr: addr)
        emit RecordShared(id: id, sharedWith: addr)
    }

    pub fun revokeRecord(id: UInt64, addr: Address) {
        let record = &self.records[id] as &HealthRecord
        record.revokeAccess(addr: addr)
        emit RecordRevoked(id: id, revokedFrom: addr)
    }

    pub fun createHealthRecordCollection(): @HealthRecordCollection {
        return <- create HealthRecordCollection()
    }
} 