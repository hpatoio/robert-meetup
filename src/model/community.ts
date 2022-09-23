export interface Community {
  _id: string;
  name: string;
  contractAddress: string; // Address of Community smart contract deployed on chain
}

export interface CommunityPostRequest {
  name: string;
  contractAddress: string;
  founderAddress: string;
  digest: string;
  signedMessage: string;
  message: string;
}
