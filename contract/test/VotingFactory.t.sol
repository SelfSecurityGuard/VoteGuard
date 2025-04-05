// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/VotingFactory.sol";
import "../src/PrivateVote.sol";

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

        // Call createVote with mock parameters
        address voteAddress = votingFactory.createVote(
            options,
            address(mockHub),
            123, // scope
            456, // attestationId
            false, // olderThanEnabled
            0, // olderThan
            false, // forbiddenCountriesEnabled
            [uint256(0), 0, 0, 0], // forbiddenCountriesListPacked
            [false, false, false] // ofacEnabled
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
            options, address(mockHub), 123, 456, false, 0, false, [uint256(0), 0, 0, 0], [false, false, false]
        );

        votingFactory.createVote(
            options, address(mockHub), 123, 456, false, 0, false, [uint256(0), 0, 0, 0], [false, false, false]
        );

        // Check that multiple votes are stored
        address[] memory allVotes = votingFactory.getAllVotes();
        assertEq(allVotes.length, 2, "There should be two vote contracts");
    }
}
