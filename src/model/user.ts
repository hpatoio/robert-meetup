export interface User {
  username: string;
  wallet: string;
  nftAddress?: string;
  nftAvatar?: string;
}

export interface UserPostRequest extends User {
  signedMessage: string;
}
