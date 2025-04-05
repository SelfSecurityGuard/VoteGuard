// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./PrivateVote.sol";

contract VotingFactory {
    event VoteCreated(address indexed creator, address voteAddress);

    address[] public allVotes;

    function createVote(
        string[] memory options,
        address identityVerificationHub,
        uint256 scope,
        uint256 attestationId,
        bool olderThanEnabled,
        uint256 olderThan,
        bool forbiddenCountriesEnabled,
        uint256[4] memory forbiddenCountriesListPacked,
        bool[3] memory ofacEnabled
    ) external returns (address) {
        PrivateVote vote = new PrivateVote(
            options,
            msg.sender,
            identityVerificationHub,
            scope,
            attestationId,
            olderThanEnabled,
            olderThan,
            forbiddenCountriesEnabled,
            forbiddenCountriesListPacked,
            ofacEnabled
        );
        allVotes.push(address(vote));
        emit VoteCreated(msg.sender, address(vote));
        return address(vote);
    }

    function getAllVotes() external view returns (address[] memory) {
        return allVotes;
    }
}
