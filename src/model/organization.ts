export interface Organization {
  id: string; // Arweave transaction id
  name: string;
  organizers: string[]; // Array of the wallet addresses of organizers
  smartcontractAddress: string; // Address of Organization smart contract deployed on chain
}

export interface OrganizationCreationJobStatus {
  status: "COMPLETED" | "IN_PROGRESS" | "ERROR";
  organizationId?: string; // Arweave transaction id
  error?: string;
}
