// This file would contain the actual smart contract ABI and address
// For a real implementation, you would deploy a contract like this:

/*
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract VotingPlatform {
    struct Poll {
        uint256 id;
        address creator;
        string title;
        string description;
        string[] options;
        uint256[] votes;
        uint256 totalVotes;
        uint256 endTime;
        bool exists;
    }
    
    mapping(uint256 => Poll) public polls;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    uint256 public pollCount;
    
    event PollCreated(uint256 indexed pollId, address indexed creator, string title);
    event VoteCast(uint256 indexed pollId, address indexed voter, uint256 optionIndex);
    
    function createPoll(
        string memory _title,
        string memory _description,
        string[] memory _options,
        uint256 _endTime
    ) public returns (uint256) {
        require(_options.length >= 2, "At least 2 options required");
        require(_endTime > block.timestamp, "End time must be in the future");
        
        uint256 pollId = pollCount++;
        
        uint256[] memory initialVotes = new uint256[](_options.length);
        
        polls[pollId] = Poll({
            id: pollId,
            creator: msg.sender,
            title: _title,
            description: _description,
            options: _options,
            votes: initialVotes,
            totalVotes: 0,
            endTime: _endTime,
            exists: true
        });
        
        emit PollCreated(pollId, msg.sender, _title);
        
        return pollId;
    }
    
    function castVote(uint256 _pollId, uint256 _optionIndex) public {
        Poll storage poll = polls[_pollId];
        
        require(poll.exists, "Poll does not exist");
        require(block.timestamp < poll.endTime, "Poll has ended");
        require(_optionIndex < poll.options.length, "Invalid option");
        require(!hasVoted[_pollId][msg.sender], "Already voted");
        
        poll.votes[_optionIndex]++;
        poll.totalVotes++;
        hasVoted[_pollId][msg.sender] = true;
        
        emit VoteCast(_pollId, msg.sender, _optionIndex);
    }
    
    function getPoll(uint256 _pollId) public view returns (
        uint256 id,
        address creator,
        string memory title,
        string memory description,
        string[] memory options,
        uint256[] memory votes,
        uint256 totalVotes,
        uint256 endTime
    ) {
        Poll storage poll = polls[_pollId];
        require(poll.exists, "Poll does not exist");
        
        return (
            poll.id,
            poll.creator,
            poll.title,
            poll.description,
            poll.options,
            poll.votes,
            poll.totalVotes,
            poll.endTime
        );
    }
    
    function getActivePolls(uint256 _limit, uint256 _offset) public view returns (uint256[] memory) {
        uint256 count = 0;
        
        // Count active polls
        for (uint256 i = 0; i < pollCount; i++) {
            if (polls[i].exists && polls[i].endTime > block.timestamp) {
                count++;
            }
        }
        
        count = count < _limit ? count : _limit;
        uint256[] memory activePollIds = new uint256[](count);
        
        uint256 current = 0;
        uint256 skipped = 0;
        
        for (uint256 i = 0; i < pollCount && current < count; i++) {
            if (polls[i].exists && polls[i].endTime > block.timestamp) {
                if (skipped >= _offset) {
                    activePollIds[current] = i;
                    current++;
                } else {
                    skipped++;
                }
            }
        }
        
        return activePollIds;
    }
}
*/

export const FACTORY_ABI = [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allVotes",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "voteAddress", type: "address", internalType: "address" },
      { name: "scope", type: "string", internalType: "string" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "createVote",
    inputs: [
      { name: "title", type: "string", internalType: "string" },
      { name: "description", type: "string", internalType: "string" },
      { name: "endTime", type: "uint256", internalType: "uint256" },
      { name: "options", type: "string[]", internalType: "string[]" },
      { name: "scope", type: "string", internalType: "string" },
      {
        name: "config",
        type: "tuple",
        internalType: "struct SelfVerificationConfig",
        components: [
          { name: "identityVerificationHub", type: "address", internalType: "address" },
          { name: "scope", type: "uint256", internalType: "uint256" },
          { name: "attestationId", type: "uint256", internalType: "uint256" },
          { name: "olderThanEnabled", type: "bool", internalType: "bool" },
          { name: "olderThan", type: "uint256", internalType: "uint256" },
          { name: "forbiddenCountriesEnabled", type: "bool", internalType: "bool" },
          { name: "forbiddenCountriesListPacked", type: "uint256[4]", internalType: "uint256[4]" },
          { name: "ofacEnabled", type: "bool[3]", internalType: "bool[3]" },
        ],
      },
    ],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getAllVotes",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct VotingFactory.AllVotes[]",
        components: [
          { name: "voteAddress", type: "address", internalType: "address" },
          { name: "scope", type: "string", internalType: "string" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "VoteCreated",
    inputs: [
      { name: "creator", type: "address", internalType: "address", indexed: true },
      { name: "voteAddress", type: "address", internalType: "address", indexed: false },
    ],
    anonymous: false,
  },
]

export const FACTORY_ADDRESS = "0xCb02Ec5A79D4d4560FA19AB14B40615bFBF74F7F"

export const VOTE_ABI = [
  {
    type: "constructor",
    inputs: [
      { name: "_title", type: "string" },
      { name: "_description", type: "string" },
      { name: "_endTime", type: "uint256" },
      { name: "_options", type: "string[]" },
      { name: "_admin", type: "address" },
      {
        name: "_config",
        type: "tuple",
        components: [
          { name: "identityVerificationHub", type: "address" },
          { name: "scope", type: "uint256" },
          { name: "attestationId", type: "uint256" },
          { name: "olderThanEnabled", type: "bool" },
          { name: "olderThan", type: "uint256" },
          { name: "forbiddenCountriesEnabled", type: "bool" },
          { name: "forbiddenCountriesListPacked", type: "uint256[4]" },
          { name: "ofacEnabled", type: "bool[3]" },
        ]
      }
    ],
    stateMutability: "nonpayable"
  },
  { type: "function", name: "title", inputs: [], outputs: [{ type: "string" }], stateMutability: "view" },
  { type: "function", name: "description", inputs: [], outputs: [{ type: "string" }], stateMutability: "view" },
  { type: "function", name: "endTime", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "getAllOptions", inputs: [], outputs: [{ type: "string[]" }], stateMutability: "view" },
  { type: "function", name: "getCreator", inputs: [], outputs: [{ type: "address" }], stateMutability: "view" },
  { type: "function", name: "getDescription", inputs: [], outputs: [{ type: "string" }], stateMutability: "view" },
  { type: "function", name: "getEndTime", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "getTitle", inputs: [], outputs: [{ type: "string" }], stateMutability: "view" },
  { type: "function", name: "getTotalVotes", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "getVotes", inputs: [{ name: "option", type: "string" }], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "getWinner", inputs: [], outputs: [{ name: "winner", type: "string" }], stateMutability: "view" },
  { type: "function", name: "isVotingOpen", inputs: [], outputs: [{ type: "bool" }], stateMutability: "view" },
  { type: "function", name: "startVoting", inputs: [], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "endVoting", inputs: [], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "admin", inputs: [], outputs: [{ type: "address" }], stateMutability: "view" },
  { type: "function", name: "totalVotes", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  {
    type: "function",
    name: "verifySelfProof",
    inputs: [
      {
        name: "proof",
        type: "tuple",
        components: [
          { name: "a", type: "uint256[2]" },
          { name: "b", type: "uint256[2][2]" },
          { name: "c", type: "uint256[2]" },
          { name: "pubSignals", type: "uint256[21]" }
        ]
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "vote",
    inputs: [
      { name: "option", type: "string" },
      {
        name: "proof",
        type: "tuple",
        components: [
          { name: "a", type: "uint256[2]" },
          { name: "b", type: "uint256[2][2]" },
          { name: "c", type: "uint256[2]" },
          { name: "pubSignals", type: "uint256[21]" }
        ]
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "votesReceived",
    inputs: [{ name: "", type: "string" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view"
  },
  { type: "error", name: "InvalidAttestationId", inputs: [] },
  { type: "error", name: "InvalidScope", inputs: [] },
  { type: "error", name: "RegisteredNullifier", inputs: [] }
]
