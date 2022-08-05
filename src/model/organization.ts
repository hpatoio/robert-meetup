export interface Organization {
  id: string; // Arweave transaction id
  name: string;
  organizers: string[]; // Array of the wallet addresses of organizers
  smartcontractAddress: string; // Address of Organization smart contract deployed on chain
}

export type OrganizationPostRequest = Pick<Organization, "name" | "organizers">;

export type OrganizationExcerpt = Pick<Organization, "id" | "name">;

export interface OrganizationCreationJobStatus {
  status: "COMPLETED" | "IN_PROGRESS" | "ERROR";
  organizationId?: string; // Arweave transaction id
  smartcontractAddress?: string;
  error?: string;
}
