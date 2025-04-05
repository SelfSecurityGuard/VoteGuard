// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/VotingFactory.sol";
import "../src/PrivateVote.sol";

contract VotingFactoryTest is Test {
    VotingFactory votingFactory;
    address admin = address(0x1);
    address voter1 = address(0x2);

    string[] options = ["Alice", "Bob", "Charlie"];

    function setUp() public {
        vm.prank(admin); // Simulate admin deploying the contract
        votingFactory = new VotingFactory();
    }

    function testCreateVote() public {
        vm.prank(admin);
        address voteAddress = votingFactory.createVote(options);

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
        votingFactory.createVote(options);
        votingFactory.createVote(options);

        // Check that multiple votes are stored
        address[] memory allVotes = votingFactory.getAllVotes();
        assertEq(allVotes.length, 2, "There should be two vote contracts");
    }

    function testQueryVoteResults() public {
        vm.prank(admin);
        address voteAddress = votingFactory.createVote(options);

        PrivateVote vote = PrivateVote(voteAddress);

        string[] memory opt = vote.getAllOptions();
        assertEq(opt.length, options.length, "Option count mismatch");

        for (uint256 i = 0; i < opt.length; i++) {
            uint256 count = vote.getVotes(opt[i]);
            assertEq(count, 0, "Initial vote count should be 0");
        }

        string memory winner = vote.getWinner();
        assertEq(bytes(winner).length, 0, "No winner expected at start");
    }
}
