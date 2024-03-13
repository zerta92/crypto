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

    // function deletePost(uint _postId) public {
    //     require(_postId > 0 && _postId <= postsCount, "Invalid post ID");

    //     require(
    //         msg.sender == posts[_postId].author,
    //         "You are not the owner of this post"
    //     );

    //     posts[_postId].deleted = true;

    //     emit PostDeleted(postsCount, posts[_postId].author);
    // }

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
