pragma solidity ^0.8.0;
// pragma experimental ABIEncoderV2;

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

    struct TransactionInput {
        string _type;
        uint _amount;
        uint _transactionDate;
        uint _rate;
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

    function createTransactions(
        TransactionInput[] memory _transactions
    ) public {
        // Loop through the array of structs and create transactions
        for (uint i = 0; i < _transactions.length; i++) {
            require(
                _transactions[i]._amount > 0 &&
                    bytes(_transactions[i]._type).length > 0,
                "Amount and type cannot be empty"
            );

            transactionsCount++;
            transactions[transactionsCount] = TransactionValues(
                transactionsCount,
                _transactions[i]._type,
                _transactions[i]._amount,
                payable(msg.sender),
                _transactions[i]._transactionDate,
                _transactions[i]._rate,
                0,
                0,
                false
            );

            emit TransactionCreated(
                transactionsCount,
                _transactions[i]._type,
                _transactions[i]._amount,
                payable(msg.sender),
                _transactions[i]._transactionDate,
                _transactions[i]._rate
            );
        }
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
            payable(msg.sender),
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
            payable(msg.sender),
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
            payable(msg.sender),
            _transactionDate,
            _closeDate,
            _rate,
            _closeRate
        );
    }

    function getTransactionsByUser() public view returns (uint[] memory) {
        uint[] memory result = new uint[](transactionsCount);
        uint counter = 0;

        // Iterate over all transactions and filter by msg.sender (the caller)
        for (uint i = 1; i <= transactionsCount; i++) {
            if (
                transactions[i].user == msg.sender && !transactions[i].deleted
            ) {
                result[counter] = transactions[i].id;
                counter++;
            }
        }

        // Create a properly sized array and copy the result
        uint[] memory filteredResult = new uint[](counter);
        for (uint i = 0; i < counter; i++) {
            filteredResult[i] = result[i];
        }

        return filteredResult;
    }
}
