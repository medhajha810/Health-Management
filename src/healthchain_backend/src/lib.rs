use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::{caller, time};
use ic_cdk_macros::*;
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(CandidType, Deserialize, Clone)]
struct HealthRecord {
    id: String,
    date: u64,
    record_type: String,
    description: String,
    doctor: String,
    patient: Principal,
}

thread_local! {
    static RECORDS: RefCell<HashMap<String, HealthRecord>> = RefCell::new(HashMap::new());
    static NEXT_ID: RefCell<u64> = RefCell::new(1);
}

#[update]
fn create_record(record_type: String, description: String, doctor: String) -> HealthRecord {
    let id = NEXT_ID.with(|next_id| {
        let current = *next_id.borrow();
        *next_id.borrow_mut() = current + 1;
        current.to_string()
    });

    let user = caller();
    let record = HealthRecord {
        id,
        date: time(),
        record_type,
        description,
        doctor,
        patient: user,
    };

    RECORDS.with(|records| {
        records.borrow_mut().insert(record.id.clone(), record.clone());
    });

    record
}

#[query]
fn get_health_records() -> Vec<HealthRecord> {
    let user = caller();
    RECORDS.with(|records| {
        records
            .borrow()
            .values()
            .filter(|record| record.patient == user)
            .cloned()
            .collect()
    })
}

#[query]
fn get_record(id: String) -> Option<HealthRecord> {
    let user = caller();
    RECORDS.with(|records| {
        records
            .borrow()
            .get(&id)
            .filter(|record| record.patient == user)
            .cloned()
    })
}

#[update]
fn update_record(id: String, record_type: String, description: String, doctor: String) -> bool {
    let user = caller();
    RECORDS.with(|records| {
        let mut records_mut = records.borrow_mut();
        if let Some(record) = records_mut.get(&id) {
            if record.patient != user {
                return false;
            }
            let updated_record = HealthRecord {
                id: id.clone(),
                date: record.date,
                record_type,
                description,
                doctor,
                patient: user,
            };
            records_mut.insert(id, updated_record);
            true
        } else {
            false
        }
    })
}

#[update]
fn delete_record(id: String) -> bool {
    let user = caller();
    RECORDS.with(|records| {
        let mut records_mut = records.borrow_mut();
        if let Some(record) = records_mut.get(&id) {
            if record.patient != user {
                return false;
            }
            records_mut.remove(&id);
            true
        } else {
            false
        }
    })
}

// Required by candid
ic_cdk::export_candid!(); 