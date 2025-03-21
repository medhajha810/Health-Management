use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::call::ManualReply;
use ic_cdk_macros::*;
use serde::Serialize;
use std::collections::HashMap;
use ic_cdk::storage;
use uuid;

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub enum AccessLevel {
    Read,
    Write,
    Admin,
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct MedicalRecord {
    id: String,
    patient: Principal,
    metadata: String,
    data: String,
    timestamp: u64,
    access_control: HashMap<Principal, AccessLevel>,
}

#[derive(Default)]
struct State {
    records: HashMap<String, MedicalRecord>,
    user_records: HashMap<Principal, Vec<String>>,
}

thread_local! {
    static STATE: std::cell::RefCell<State> = std::cell::RefCell::new(State::default());
}

#[init]
fn init() {
    STATE.with(|state| {
        *state.borrow_mut() = State::default();
    });
}

#[update]
fn create_record(metadata: String, data: String) -> String {
    let caller = ic_cdk::caller();
    let id = uuid::Uuid::new_v4().to_string();
    let record = MedicalRecord {
        id: id.clone(),
        patient: caller,
        metadata,
        data,
        timestamp: ic_cdk::api::time(),
        access_control: {
            let mut map = HashMap::new();
            map.insert(caller, AccessLevel::Admin);
            map
        },
    };

    STATE.with(|state| {
        let mut state = state.borrow_mut();
        state.records.insert(id.clone(), record);
        state.user_records
            .entry(caller)
            .or_default()
            .push(id.clone());
    });

    id
}

#[query]
fn get_record(id: String) -> Option<MedicalRecord> {
    let caller = ic_cdk::caller();
    STATE.with(|state| {
        let state = state.borrow();
        state.records.get(&id).and_then(|record| {
            if let Some(level) = record.access_control.get(&caller) {
                Some(record.clone())
            } else {
                None
            }
        })
    })
}

#[update]
fn update_record(id: String, metadata: String, data: String) -> bool {
    let caller = ic_cdk::caller();
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if let Some(record) = state.records.get_mut(&id) {
            if let Some(AccessLevel::Write) | Some(AccessLevel::Admin) = record.access_control.get(&caller) {
                record.metadata = metadata;
                record.data = data;
                record.timestamp = ic_cdk::api::time();
                true
            } else {
                false
            }
        } else {
            false
        }
    })
}

#[update]
fn grant_access(id: String, user: Principal, level: AccessLevel) -> bool {
    let caller = ic_cdk::caller();
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if let Some(record) = state.records.get_mut(&id) {
            if let Some(AccessLevel::Admin) = record.access_control.get(&caller) {
                record.access_control.insert(user, level);
                true
            } else {
                false
            }
        } else {
            false
        }
    })
}

#[update]
fn revoke_access(id: String, user: Principal) -> bool {
    let caller = ic_cdk::caller();
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if let Some(record) = state.records.get_mut(&id) {
            if let Some(AccessLevel::Admin) = record.access_control.get(&caller) {
                record.access_control.remove(&user);
                true
            } else {
                false
            }
        } else {
            false
        }
    })
}

#[query]
fn get_patient_records() -> Vec<MedicalRecord> {
    let caller = ic_cdk::caller();
    STATE.with(|state| {
        let state = state.borrow();
        state
            .user_records
            .get(&caller)
            .map(|record_ids| {
                record_ids
                    .iter()
                    .filter_map(|id| state.records.get(id))
                    .cloned()
                    .collect()
            })
            .unwrap_or_default()
    })
} 