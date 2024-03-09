pragma solidity ^0.5.0;

contract SocialNetwork {
    string public name;
    uint public postsCount = 0;

    mapping(uint => Post) public posts;

    struct Post {
        uint id;
        string content;
        uint tipAmount;
        address payable author;
    }

    event PostCreated(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );
    event PostTipped(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );

    constructor() public {
        name = "Fuck Boy University Social Network";
    }

    function createPost(string memory _content) public {
        require(bytes(_content).length > 0);
        postsCount++;
        posts[postsCount] = Post(postsCount, _content, 0, msg.sender);
        emit PostCreated(postsCount, _content, 0, msg.sender);
    }

    function tipPost(uint _id) public payable {
        require(_id > 0 && _id <= postsCount);
        Post memory _post = posts[_id];
        address payable _author = _post.author;
        address(_author).transfer(msg.value);
        _post.tipAmount = _post.tipAmount + msg.value;
        posts[_id] = _post;
        emit PostTipped(postsCount, _post.content, _post.tipAmount, _author);
    }
}
