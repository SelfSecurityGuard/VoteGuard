// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {IVcAndDiscloseCircuitVerifier} from "@selfxyz/contracts/contracts/interfaces/IVcAndDiscloseCircuitVerifier.sol";
import {IIdentityVerificationHubV1} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV1.sol";
import {Formatter} from "@selfxyz/contracts/contracts/libraries/Formatter.sol";
import {CircuitAttributeHandler} from "@selfxyz/contracts/contracts/libraries/CircuitAttributeHandler.sol";
import {CircuitConstants} from "@selfxyz/contracts/contracts/constants/CircuitConstants.sol";

struct SelfVerificationConfig {
    address identityVerificationHub;
    uint256 scope;
    uint256 attestationId;
    bool olderThanEnabled;
    uint256 olderThan;
    bool forbiddenCountriesEnabled;
    uint256[4] forbiddenCountriesListPacked;
    bool[3] ofacEnabled;
}

contract PrivateVote is SelfVerificationRoot {
    address public admin;
    bool public isVotingOpen;

    string[] public options;
    string public title;
    string public description;
    uint256 public endTime;
    uint256 public totalVotes;
    string public originalScope;
    uint32 private age;
    string private country;
    mapping(string => uint256) public votesReceived;
    mapping(uint256 => bool) internal _nullifiers;

    error RegisteredNullifier();

    constructor(
        string memory _title,
        string memory _description,
        uint256 _endTime,
        string[] memory _options,
        string memory _originalScope,
        uint32 _age,
        string memory _country,
        address _admin,
        SelfVerificationConfig memory _config
    )
        SelfVerificationRoot(
            _config.identityVerificationHub,
            _config.scope,
            _config.attestationId,
            _config.olderThanEnabled,
            _config.olderThan,
            _config.forbiddenCountriesEnabled,
            _config.forbiddenCountriesListPacked,
            _config.ofacEnabled
        )
    {
        admin = _admin;
        options = _options;
        title = _title;
        description = _description;
        endTime = _endTime;
        originalScope = _originalScope;
        age = _age;
        country = _country;
        isVotingOpen = true;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier votingOpen() {
        require(isVotingOpen, "Voting is not open");
        require(block.timestamp < endTime, "Voting has ended");
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

        if (_scope != proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_SCOPE_INDEX]) {
            revert InvalidScope();
        }

        if (_attestationId != proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_ATTESTATION_ID_INDEX]) {
            revert InvalidAttestationId();
        }

        if (_nullifiers[proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_NULLIFIER_INDEX]]) {
            revert RegisteredNullifier();
        }

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

        if (_isAgeVerified(result.revealedDataPacked) && _isCountryVerified(result.revealedDataPacked)) {
            _nullifiers[result.nullifier] = true;

            votesReceived[option]++;
            totalVotes++;
        } else {
            revert("Identity verification failed");
        }
    }

    function _isAgeVerified(uint256[3] memory revealedDataPacked) public view virtual returns (bool) {
        bytes memory charcodes = Formatter.fieldElementsToBytes(revealedDataPacked);
        string memory dob = CircuitAttributeHandler.getDateOfBirth(charcodes);
        uint256 dobTimestamp = Formatter.dateToUnixTimestamp(dob);

        uint256 secondsPerYear = 365 days;
        uint256 ageFromTimestamp = (block.timestamp - dobTimestamp) / secondsPerYear;

        return ageFromTimestamp >= age;
    }

    function _isCountryVerified(uint256[3] memory revealedDataPacked) public view virtual returns (bool) {
        bytes memory charcodes = Formatter.fieldElementsToBytes(revealedDataPacked);
        string memory nationality = CircuitAttributeHandler.getNationality(charcodes);

        return keccak256(bytes(country)) == keccak256(bytes(nationality));
    }

    function validOption(string memory name) public view returns (bool) {
        for (uint256 i = 0; i < options.length; i++) {
            if (keccak256(bytes(options[i])) == keccak256(bytes(name))) {
                return true;
            }
        }
        return false;
    }

    function stringToUint(string memory s) public pure returns (uint256) {
        bytes memory b = bytes(s);
        uint256 result = 0;
        for (uint256 i = 0; i < b.length; i++) {
            require(b[i] >= 0x30 && b[i] <= 0x39, "Invalid character in string");
            result = result * 10 + (uint256(uint8(b[i])) - 48);
        }
        return result;
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

    function getTitle() external view returns (string memory) {
        return title;
    }

    function getDescription() external view returns (string memory) {
        return description;
    }

    function getEndTime() external view returns (uint256) {
        return endTime;
    }

    function getTotalVotes() external view returns (uint256) {
        return totalVotes;
    }

    function getCreator() external view returns (address) {
        return admin;
    }

    function getScope() external view returns (string memory) {
        return originalScope;
    }
}
