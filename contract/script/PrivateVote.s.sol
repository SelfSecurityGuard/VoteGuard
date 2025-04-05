// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/VotingFactory.sol";

contract DeployVotingFactory is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy the VotingFactory contract
        VotingFactory votingFactory = new VotingFactory();

        // Log the deployed contract address
        console.log("VotingFactory deployed at:", address(votingFactory));

        vm.stopBroadcast();
    }
}
