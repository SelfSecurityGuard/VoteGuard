// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {IVcAndDiscloseCircuitVerifier} from "@selfxyz/contracts/contracts/interfaces/IVcAndDiscloseCircuitVerifier.sol";
import {IIdentityVerificationHubV1} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV1.sol";
import {Formatter} from "@selfxyz/contracts/contracts/libraries/Formatter.sol";
import {CircuitAttributeHandler} from "@selfxyz/contracts/contracts/libraries/CircuitAttributeHandler.sol";
import {CircuitConstants} from "@selfxyz/contracts/contracts/constants/CircuitConstants.sol";

contract PrivateVote {
    address public admin;
    bool public isVotingOpen;

    string[] public candidates;
    mapping(string => uint256) public votesReceived;
    mapping(address => bool) public hasVoted;

    constructor(string[] memory _candidates) {
        admin = msg.sender;
        candidates = _candidates;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier votingOpen() {
        require(isVotingOpen, "Voting is not open");
        _;
    }

    function startVoting() external onlyAdmin {
        isVotingOpen = true;
    }

    function endVoting() external onlyAdmin {
        isVotingOpen = false;
    }

    function vote(string calldata candidate) external votingOpen {
        require(!hasVoted[msg.sender], "Already voted");
        require(validCandidate(candidate), "Invalid candidate");

        hasVoted[msg.sender] = true;
        votesReceived[candidate]++;
    }

    function validCandidate(string memory name) public view returns (bool) {
        for (uint256 i = 0; i < candidates.length; i++) {
            if (keccak256(bytes(candidates[i])) == keccak256(bytes(name))) {
                return true;
            }
        }
        return false;
    }

    function getVotes(string memory candidate) external view returns (uint256) {
        return votesReceived[candidate];
    }

    function getWinner() external view returns (string memory winner) {
        uint256 maxVotes = 0;
        winner = "";

        for (uint256 i = 0; i < candidates.length; i++) {
            if (votesReceived[candidates[i]] > maxVotes) {
                maxVotes = votesReceived[candidates[i]];
                winner = candidates[i];
            }
        }
    }

    function getAllCandidates() external view returns (string[] memory) {
        return candidates;
    }

    function getVoteCount(string memory candidate) external view returns (uint256) {
        return votesReceived[candidate];
    }
}