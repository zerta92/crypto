pragma solidity >=0.4.21 <0.6.0;

contract SocialNetwork {
    string public name;
    uint public postsCount = 0;

    mapping(uint => Post) public posts;

    struct Post {
        uint id;
        string content;
        uint tipAmount;
        address payable author;
        bool deleted;
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

    event PostDeleted(uint postsCount, address payable author);

    constructor() public {
        name = "Social Network";
    }

    function createPost(string memory _content) public {
        require(bytes(_content).length > 0);
        postsCount++;
        posts[postsCount] = Post(postsCount, _content, 0, msg.sender, false);
        emit PostCreated(postsCount, _content, 0, msg.sender);
    }

    function deletePost(uint _postId) public {
        require(_postId > 0 && _postId <= postsCount, "Invalid post ID");

        require(
            msg.sender == posts[_postId].author,
            "You are not the owner of this post"
        );

        posts[_postId].deleted = true;

        emit PostDeleted(postsCount, posts[_postId].author);
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
