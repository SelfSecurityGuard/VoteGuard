// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

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

    string[] public options;
    mapping(string => uint256) public votesReceived;
    mapping(address => bool) public hasVoted;

    constructor(string[] memory _options) {
        admin = msg.sender;
        options = _options;
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

    function vote(string calldata option) external votingOpen {
        require(!hasVoted[msg.sender], "Already voted");
        require(validOption(option), "Invalid option");

        hasVoted[msg.sender] = true;
        votesReceived[option]++;
    }

    function validOption(string memory name) public view returns (bool) {
        for (uint256 i = 0; i < options.length; i++) {
            if (keccak256(bytes(options[i])) == keccak256(bytes(name))) {
                return true;
            }
        }
        return false;
    }

    function getVotes(string memory option) external view returns (uint256) {
        return votesReceived[option];
    }

    function getWinner() external view returns (string memory winner) {
        uint256 maxVotes = 0;
        winner = "";

        for (uint256 i = 0; i < options.length; i++) {
            if (votesReceived[options[i]] > maxVotes) {
                maxVotes = votesReceived[options[i]];
                winner = options[i];
            }
        }
    }

    function getAllOptions() external view returns (string[] memory) {
        return options;
    }
}
