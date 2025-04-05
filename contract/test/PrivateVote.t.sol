// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import "forge-std/Test.sol";
import "../src/PrivateVote.sol";
import {IVcAndDiscloseCircuitVerifier} from "@selfxyz/contracts/contracts/interfaces/IVcAndDiscloseCircuitVerifier.sol";

contract MockHub {
    uint256 public nullifier;

    constructor(uint256 _nullifier) {
        nullifier = _nullifier;
    }

    function verifyVcAndDisclose(IIdentityVerificationHubV1.VcAndDiscloseHubProof calldata proof)
        external
        pure
        returns (IIdentityVerificationHubV1.VcAndDiscloseVerificationResult memory result)
    {
        result.nullifier = proof.vcAndDiscloseProof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_NULLIFIER_INDEX];
    }
}

struct VerificationConfig {
    address identityVerificationHub;
    uint256 scope;
    uint256 attestationId;
    bool olderThanEnabled;
    uint256 olderThan;
    bool forbiddenCountriesEnabled;
    uint256[4] forbiddenCountriesListPacked;
    bool[3] ofacEnabled;
}

contract PrivateVoteTest is Test {
    PrivateVote privateVote;
    address admin = address(0x1);
    address voter1 = address(0x2);
    MockHub mockHub;

    string[] options = ["Alice", "Bob", "Charlie"];

    error RegisteredNullifier();

    function setUp() public {
        mockHub = new MockHub(111);

        SelfVerificationConfig memory config = SelfVerificationConfig({
            identityVerificationHub: address(mockHub),
            scope: 123,
            attestationId: 456,
            olderThanEnabled: false,
            olderThan: 0,
            forbiddenCountriesEnabled: false,
            forbiddenCountriesListPacked: [uint256(0), 0, 0, 0],
            ofacEnabled: [false, false, false]
        });

        vm.prank(admin);
        privateVote = new PrivateVote(
            "Test Title", // _title
            "Test Description", // _description
            block.timestamp + 1 days, // _endTime
            options, // _options
            admin, // _admin
            config
        );
    }

    function buildProof(uint256 nullifier, uint256 scope, uint256 attestationId)
        internal
        pure
        returns (IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof memory)
    {
        IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof memory proof;
        proof.pubSignals = [uint256(0), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // Initialize fixed-size array
        proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_SCOPE_INDEX] = scope;
        proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_ATTESTATION_ID_INDEX] = attestationId;
        proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_NULLIFIER_INDEX] = nullifier;
        return proof;
    }

    function testAdminCanStartAndEndVoting() public {
        vm.prank(admin);
        privateVote.startVoting();
        assertTrue(privateVote.isVotingOpen(), "Voting should be open");

        vm.prank(admin);
        privateVote.endVoting();
        assertFalse(privateVote.isVotingOpen(), "Voting should be closed");
    }

    function testNonAdminCannotStartOrEndVoting() public {
        vm.expectRevert("Only admin");
        privateVote.startVoting();

        vm.expectRevert("Only admin");
        privateVote.endVoting();
    }

    function testVoteAndGetVotes() public {
        vm.prank(admin);
        privateVote.startVoting();

        privateVote.vote("Alice", buildProof(111, 123, 456));
        assertEq(privateVote.getVotes("Alice"), 1, "Alice should have 1 vote");

        privateVote.vote("Bob", buildProof(222, 123, 456));
        assertEq(privateVote.getVotes("Bob"), 1, "Bob should have 1 vote");
    }

    function testCannotVoteTwice() public {
        vm.prank(admin);
        privateVote.startVoting();

        IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof memory proof = buildProof(999, 123, 456);
        privateVote.vote("Alice", proof);

        vm.expectRevert(abi.encodeWithSelector(RegisteredNullifier.selector));
        privateVote.vote("Alice", proof);
    }

    function testCannotVoteForInvalidOption() public {
        vm.prank(admin);
        privateVote.startVoting();

        vm.expectRevert("Invalid option");
        privateVote.vote("InvalidOption", buildProof(333, 123, 456));
    }

    function testGetWinner() public {
        vm.prank(admin);
        privateVote.startVoting();

        privateVote.vote("Alice", buildProof(1001, 123, 456));
        privateVote.vote("Alice", buildProof(1002, 123, 456));

        assertEq(privateVote.getWinner(), "Alice", "Alice should be the winner");
    }

    function testGetAllOptions() public view {
        string[] memory allOptions = privateVote.getAllOptions();
        assertEq(allOptions.length, options.length, "Option count mismatch");

        for (uint256 i = 0; i < options.length; i++) {
            assertEq(allOptions[i], options[i], "Option mismatch");
        }
    }
}
