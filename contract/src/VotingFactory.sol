// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./PrivateVote.sol";

contract VotingFactory {
    event VoteCreated(address indexed creator, address voteAddress);

    address[] public allVotes;

    function createVote(string[] memory options) external returns (address) {
        PrivateVote vote = new PrivateVote(options, msg.sender);
        allVotes.push(address(vote));
        emit VoteCreated(msg.sender, address(vote));
        return address(vote);
    }

    function getAllVotes() external view returns (address[] memory) {
        return allVotes;
    }
}
