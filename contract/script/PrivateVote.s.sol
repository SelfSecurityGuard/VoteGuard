// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PrivateVote.sol";

contract DeployPrivateVote is Script {
    function run() external {
        vm.startBroadcast();

        string[] memory candidates = new string[](3);
        candidates[0] = "Alice";
        candidates[1] = "Bob";
        candidates[2] = "Charlie";

        PrivateVote vote = new PrivateVote(candidates);

        vm.stopBroadcast();
    }
}
