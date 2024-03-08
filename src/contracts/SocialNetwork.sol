pragma solidity ^0.5.0;

contract SocialNetwork {
    string public name;
    uint public postsCount = 0;

    mapping(uint => Post) posts;

    struct Post {
        uint id;
        string content;
        uint tipAmount;
        address author;
    }

    event PostCreated(uint id, string content, uint tipAmount, address author);

    constructor() public {
        name = "Fuck Boy University Social Network";
    }

    function createPost(string memory _content) public {
        require(bytes(_content).length > 0);
        postsCount++;
        posts[postsCount] = Post(postsCount, _content, 0, msg.sender);
        emit PostCreated(postsCount, _content, 0, msg.sender);
    }
}
