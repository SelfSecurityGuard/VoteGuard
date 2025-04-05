// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PrivateVote.sol";

contract PrivateVoteTest is Test {
    PrivateVote privateVote;
    address admin = address(0x1);
    address voter1 = address(0x2);
    address voter2 = address(0x3);

    string[] options = ["Alice", "Bob", "Charlie"];

    function setUp() public {
        vm.prank(admin); // Simulate admin deploying the contract
        privateVote = new PrivateVote(options, admin);
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

        vm.prank(voter1);
        privateVote.vote("Alice");
        assertEq(privateVote.getVotes("Alice"), 1, "Alice should have 1 vote");

        vm.prank(voter2);
        privateVote.vote("Bob");
        assertEq(privateVote.getVotes("Bob"), 1, "Bob should have 1 vote");
    }

    function testCannotVoteTwice() public {
        vm.prank(admin);
        privateVote.startVoting();

        vm.prank(voter1);
        privateVote.vote("Alice");

        vm.expectRevert("Already voted");
        vm.prank(voter1);
        privateVote.vote("Alice");
    }

    function testCannotVoteForInvalidOption() public {
        vm.prank(admin);
        privateVote.startVoting();

        vm.expectRevert("Invalid option");
        vm.prank(voter1);
        privateVote.vote("InvalidOption");
    }

    function testGetWinner() public {
        vm.prank(admin);
        privateVote.startVoting();

        vm.prank(voter1);
        privateVote.vote("Alice");

        vm.prank(voter2);
        privateVote.vote("Alice");

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
