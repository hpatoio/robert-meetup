import type { AbiItem } from "web3-utils";

// @TODO export it directly from contracts repo

const abiContract: AbiItem[] = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract Organization",
        name: "newOrganization",
        type: "address",
      },
    ],
    name: "NewOrganization",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "organizations",
    outputs: [
      {
        internalType: "contract Organization",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "address[]",
        name: "_organizers",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_shares",
        type: "uint256[]",
      },
    ],
    name: "createOrganization",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default abiContract;
