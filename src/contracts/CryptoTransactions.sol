pragma solidity ^0.5.0;

contract CryptoTransactions {
    string public name;
    uint public transactionsCount = 0;

    mapping(uint => TransactionValues) public transactions;

    struct TransactionValues {
        uint id;
        string transactionType;
        uint amount;
        address payable user;
        uint transactionDate;
        uint rate;
        uint closeDate;
        uint closeRate;
        bool deleted;
    }

    event TransactionCreated(
        uint id,
        string transactionType,
        uint amount,
        address payable user,
        uint transactionDate,
        uint rate
    );

    event TransactionClosed(
        uint id,
        string transactionType,
        uint amount,
        address payable user,
        uint transactionDate,
        uint closeDate,
        uint rate,
        uint closeRate
    );

    constructor() public {
        name = "CryptoTransactions";
    }

    function createTransaction(
        string memory _type,
        uint _amount,
        uint _transactionDate,
        uint _rate
    ) public {
        require(
            _amount > 0 && bytes(_type).length > 0,
            "Amount and type cannot be empty"
        );
        transactionsCount++;
        transactions[transactionsCount] = TransactionValues(
            transactionsCount,
            _type,
            _amount,
            msg.sender,
            _transactionDate,
            _rate,
            0,
            0,
            false
        );
        emit TransactionCreated(
            transactionsCount,
            _type,
            _amount,
            msg.sender,
            _transactionDate,
            _rate
        );
    }

    function closeTrade(
        uint _transactionId,
        uint _closeDate,
        uint _closeRate
    ) public {
        require(
            _transactionId > 0 && _transactionId <= transactionsCount,
            "Invalid Transaction ID"
        );

        require(
            msg.sender == transactions[_transactionId].user,
            "You are not the owner of this post"
        );

        string memory _type = transactions[_transactionId].transactionType;
        uint _amount = transactions[_transactionId].amount;
        uint _transactionDate = transactions[_transactionId].transactionDate;
        uint _rate = transactions[_transactionId].rate;

        transactions[_transactionId].closeDate = _closeDate;
        transactions[_transactionId].closeRate = _closeRate;

        emit TransactionClosed(
            transactionsCount,
            _type,
            _amount,
            msg.sender,
            _transactionDate,
            _closeDate,
            _rate,
            _closeRate
        );
    }

    // function tipPost(uint _id) public payable {
    //     require(_id > 0 && _id <= postsCount);
    //     Post memory _post = posts[_id];
    //     address payable _author = _post.author;
    //     address(_author).transfer(msg.value);
    //     _post.tipAmount = _post.tipAmount + msg.value;
    //     posts[_id] = _post;
    //     emit PostTipped(postsCount, _post.content, _post.tipAmount, _author);
    // }
}
