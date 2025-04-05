// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import "forge-std/Test.sol";
import "../src/VotingFactory.sol";
import "../src/PrivateVote.sol";

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

contract MockHub {
    function verifyVcAndDisclose(IIdentityVerificationHubV1.VcAndDiscloseHubProof calldata)
        external
        pure
        returns (IIdentityVerificationHubV1.VcAndDiscloseVerificationResult memory result)
    {
        result.nullifier = 0; // Mock implementation
    }
}

contract VotingFactoryTest is Test {
    VotingFactory votingFactory;
    MockHub mockHub;
    address admin = address(0x1);

    string[] options = ["Alice", "Bob", "Charlie"];

    function setUp() public {
        mockHub = new MockHub();
        vm.prank(admin); // Simulate admin deploying the contract
        votingFactory = new VotingFactory();
    }

    function testCreateVote() public {
        vm.prank(admin);

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

        // Call createVote with mock parameters
        address voteAddress = votingFactory.createVote(
            "Test Title", // _title
            "Test Description", // _description
            block.timestamp + 1 days,
            options,
            "Test Scope", // _scope
            config
        );

        // Check that the vote contract was created
        assertTrue(voteAddress != address(0), "Vote contract address should not be zero");

        // Check that the vote contract is stored in the factory
        address[] memory allVotes = votingFactory.getAllVotes();
        assertEq(allVotes.length, 1, "There should be one vote contract");
        assertEq(allVotes[0], voteAddress, "Stored vote address mismatch");

        // Check that the created contract is a PrivateVote instance
        PrivateVote privateVote = PrivateVote(voteAddress);
        string[] memory allOptions = privateVote.getAllOptions();
        assertEq(allOptions.length, options.length, "Option count mismatch");
        for (uint256 i = 0; i < options.length; i++) {
            assertEq(allOptions[i], options[i], "Option mismatch");
        }
    }

    function testMultipleVotes() public {
        vm.prank(admin);

        // Create multiple votes
        votingFactory.createVote(
            "Test Title", // _title
            "Test Description", // _description
            block.timestamp + 1 days,
            options,
            "Test Scope", // _scope
            SelfVerificationConfig({
                identityVerificationHub: address(mockHub),
                scope: 123,
                attestationId: 456,
                olderThanEnabled: false,
                olderThan: 0,
                forbiddenCountriesEnabled: false,
                forbiddenCountriesListPacked: [uint256(0), 0, 0, 0],
                ofacEnabled: [false, false, false]
            })
        );

        votingFactory.createVote(
            "Test Title", // _title
            "Test Description", // _description
            block.timestamp + 1 days,
            options,
            "Test Scope", // _scope
            SelfVerificationConfig({
                identityVerificationHub: address(mockHub),
                scope: 123,
                attestationId: 456,
                olderThanEnabled: false,
                olderThan: 0,
                forbiddenCountriesEnabled: false,
                forbiddenCountriesListPacked: [uint256(0), 0, 0, 0],
                ofacEnabled: [false, false, false]
            })
        );

        // Check that multiple votes are stored
        address[] memory allVotes = votingFactory.getAllVotes();
        assertEq(allVotes.length, 2, "There should be two vote contracts");
    }
}
