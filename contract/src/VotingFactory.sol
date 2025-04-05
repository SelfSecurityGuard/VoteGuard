// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./PrivateVote.sol";

contract VotingFactory {
    event VoteCreated(address indexed creator, address voteAddress);

    struct AllVotes {
        address voteAddress;
        string scope;
    }

    AllVotes[] public allVotes;

    constructor() {}

    function createVote(
        string memory title,
        string memory description,
        uint256 endTime,
        string[] memory options,
        string memory scope,
        SelfVerificationConfig memory config
    ) external returns (address) {
        PrivateVote vote = new PrivateVote(
            title,
            description,
            endTime,
            options,
            msg.sender,
            SelfVerificationConfig(
                config.identityVerificationHub,
                config.scope,
                config.attestationId,
                config.olderThanEnabled,
                config.olderThan,
                config.forbiddenCountriesEnabled,
                config.forbiddenCountriesListPacked,
                config.ofacEnabled
            )
        );
        allVotes.push(AllVotes(address(vote), scope));
        emit VoteCreated(msg.sender, address(vote));
        return address(vote);
    }

    function getAllVotes() external view returns (AllVotes[] memory) {
        return allVotes;
    }
}
