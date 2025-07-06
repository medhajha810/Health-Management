import * as fcl from '@onflow/fcl';

fcl.config()
  .put('accessNode.api', 'https://rest-mainnet.onflow.org')
  .put('discovery.wallet', 'https://fcl-discovery.onflow.org/authn')
  .put('app.detail.title', 'Health Management System')
  .put('app.detail.icon', 'https://img.freepik.com/free-icon/medical-history_318-10434.jpg')
  .put('0xHealthRecords', '0xMAINNET_CONTRACT_ADDRESS'); // TODO: Replace with your mainnet contract address

// NOTE: Replace '0xHealthRecords' with your deployed contract address in Cadence scripts/transactions. 