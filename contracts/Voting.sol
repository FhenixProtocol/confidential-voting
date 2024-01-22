// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity >=0.8.19 <0.9.0;

import "@fhenixprotocol/contracts/FHE.sol";

contract Voting {
    euint16 internal zero = FHE.asEuint16(0);
    euint16 internal one = FHE.asEuint16(1);
    uint8 public constant MAX_OPTIONS = 4;
    euint8[MAX_OPTIONS] internal encOptions = [FHE.asEuint8(0), FHE.asEuint8(1), FHE.asEuint8(2), FHE.asEuint8(3)];

    string public question;
    string[] public options;
    euint16[MAX_OPTIONS] internal tally; // Since every vote is worth 1, I assume we can use a 16-bit integer

    mapping(address => euint8) internal votes;

    constructor(string memory _question, string[] memory _options) {
        require(_options.length <= MAX_OPTIONS, "too many options!");

        question = _question;
        options = _options;
    }

    function vote(inEuint8 memory voteBytes) public {
        euint8 encryptedVote = FHE.asEuint8(voteBytes); // Cast bytes into an encrypted type
        if (FHE.isInitialized(votes[msg.sender])) {
            revert("already voted!");
        }
        requireValid(encryptedVote);

        votes[msg.sender] = encryptedVote;
        addToTally(encryptedVote, one);
    }

    function requireValid(euint8 encryptedVote) internal view {
        // Make sure that: (0 <= vote <= 3)
        ebool isValid = FHE.and(
            FHE.gte(encryptedVote, encOptions[0]),
            FHE.lte(encryptedVote, encOptions[options.length - 1])
        );
        FHE.req(isValid);
    }

    function addToTally(euint8 option, euint16 amount) internal {
        // We don't want to leak the user's vote, so we have to change the tally of every option.
        // So for example, if the user voted for option 1:
        // tally[0] = tally[0] + enc(0)
        // tally[1] = tally[1] + enc(1)
        // etc ..
        for (uint8 i = 0; i < encOptions.length; i++) {
            euint16 amountOrZero = FHE.select(FHE.eq(option, encOptions[i]), amount, FHE.asEuint16(0));
            tally[i] = FHE.add(tally[i], amountOrZero);
        }
    }
}
