// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {IVcAndDiscloseCircuitVerifier} from "@selfxyz/contracts/contracts/interfaces/IVcAndDiscloseCircuitVerifier.sol";
import {IIdentityVerificationHubV1} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV1.sol";
import {Formatter} from "@selfxyz/contracts/contracts/libraries/Formatter.sol";
import {CircuitAttributeHandler} from "@selfxyz/contracts/contracts/libraries/CircuitAttributeHandler.sol";
import {CircuitConstants} from "@selfxyz/contracts/contracts/constants/CircuitConstants.sol";

contract PrivateVote is SelfVerificationRoot {
    address public admin;
    bool public isVotingOpen;

    string[] public options;
    mapping(string => uint256) public votesReceived;
    mapping(uint256 => bool) internal _nullifiers;

    constructor(
        string[] memory _options,
        address _admin,
        address _identityVerificationHub,
        uint256 _scope,
        uint256 _attestationId,
        bool _olderThanEnabled,
        uint256 _olderThan,
        bool _forbiddenCountriesEnabled,
        uint256[4] memory _forbiddenCountriesListPacked,
        bool[3] memory _ofacEnabled
    )
        SelfVerificationRoot(
            _identityVerificationHub,
            _scope,
            _attestationId,
            _olderThanEnabled,
            _olderThan,
            _forbiddenCountriesEnabled,
            _forbiddenCountriesListPacked,
            _ofacEnabled
        )
    {
        admin = _admin;
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

    function vote(string calldata option, IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof calldata proof)
        external
        votingOpen
    {
        require(validOption(option), "Invalid option");

        IIdentityVerificationHubV1.VcAndDiscloseVerificationResult memory result = _identityVerificationHub
            .verifyVcAndDisclose(
            IIdentityVerificationHubV1.VcAndDiscloseHubProof({
                olderThanEnabled: _verificationConfig.olderThanEnabled,
                olderThan: _verificationConfig.olderThan,
                forbiddenCountriesEnabled: _verificationConfig.forbiddenCountriesEnabled,
                forbiddenCountriesListPacked: _verificationConfig.forbiddenCountriesListPacked,
                ofacEnabled: _verificationConfig.ofacEnabled,
                vcAndDiscloseProof: proof
            })
        );

        require(!_nullifiers[result.nullifier], "Already voted");
        _nullifiers[result.nullifier] = true;

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
