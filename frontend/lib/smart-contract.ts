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
    name: "createVote",
    type: "function",
    inputs: [{ internalType: "string[]", name: "options", type: "string[]" }],
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "nonpayable",
  },
]

export const FACTORY_ADDRESS = "0xA72b7c9c2101AaAC57d86cDEBc490CA53Bca4A33"
