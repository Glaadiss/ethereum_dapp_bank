// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./Token.sol";

contract dBank {
    //assign Token contract to variable
    Token private token;

    //add mappings
    mapping(address => uint256) public etherBalanceOf;
    mapping(address => uint256) public depositStart;
    mapping(address => bool) public isDeposited;

    //add events
    event Deposit(address indexed user, uint256 etherAmount, uint256 timeStart);
    event Withdraw(
        address indexed user,
        uint256 etherAmount,
        uint256 timeStart,
        uint256 interest
    );

    //pass as constructor argument deployed Token contract
    constructor(Token _token) public {
        token = _token;
        //assign token deployed contract to variable
    }

    function deposit() public payable {
        require(
            isDeposited[msg.sender] == false,
            "Error, deposit already active"
        );
        require(msg.value >= 1e16, "Error, deposit must be >= 0.01 ETH");

        etherBalanceOf[msg.sender] = etherBalanceOf[msg.sender] + msg.value;
        depositStart[msg.sender] = block.timestamp;
        isDeposited[msg.sender] = true;
        emit Deposit(msg.sender, msg.value, block.timestamp);
        //check if msg.sender didn't already deposited funds
        //check if msg.value is >= than 0.01 ETH
        //increase msg.sender ether deposit balance
        //start msg.sender hodling time
        //set msg.sender deposit status to true
        //emit Deposit event
    }

    function withdraw() public {
        require(
            isDeposited[msg.sender] == true,
            "Error, deposit doesn't exist"
        );
        uint256 userBalance = etherBalanceOf[msg.sender];
        uint256 depositTime = block.timestamp - depositStart[msg.sender];
        uint256 interestPerSecond =
            31668017 * (etherBalanceOf[msg.sender] / 1e16);
        uint256 interest = interestPerSecond * depositTime;

        token.mint(msg.sender, interest);
        msg.sender.transfer(userBalance);
        etherBalanceOf[msg.sender] = 0;
        depositStart[msg.sender] = 0;
        isDeposited[msg.sender] = false;
        emit Withdraw(msg.sender, userBalance, block.timestamp, interest);
        //check if msg.sender deposit status is true
        //assign msg.sender ether deposit balance to variable for event
        //check user's hodl time
        //calc interest per second
        //calc accrued interest
        //send eth to user
        //send interest in tokens to user
        //reset depositer data
        //emit event
    }

    function borrow() public payable {
        //check if collateral is >= than 0.01 ETH
        //check if user doesn't have active loan
        //add msg.value to ether collateral
        //calc tokens amount to mint, 50% of msg.value
        //mint&send tokens to user
        //activate borrower's loan status
        //emit event
    }

    function payOff() public {
        //check if loan is active
        //transfer tokens from user back to the contract
        //calc fee
        //send user's collateral minus fee
        //reset borrower's data
        //emit event
    }
}
